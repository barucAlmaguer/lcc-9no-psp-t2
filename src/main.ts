
/**
* *****************************************************************************
* *****************************************************************************
* Program assignment: LOC counter
* Name: Rafael Baruc Almaguer López
* uanl_id: 1443335
* email: baruc.almaguer@gmail.com
* date: 2021-02-28
* description:
*   This program counts physical LOCs, from this or another program.
*   You need to pass an argument as the file to analyze like this:
*   $ yarn main --source="./src/main.ts"
*   
*   The output should be a list of blocks detected in the program, along with
*   the amount of LOCs per block, and the total.
* *****************************************************************************
* *****************************************************************************
*/

/**
* *****************************************************************************
* * SUMMARY OF MAIN FUNCTIONS: ************************************************
*
* - FUNCTION - DESCRIPTION
* - myFunction():
* - - function description
*/

/**
* *****************************************************************************
* * EXTERNAL MODULES: *********************************************************
*/
import { createReadStream, existsSync } from 'fs'
import { createInterface } from 'readline'
import { join } from 'path'
import {
  Machine,
  StateMachine,
  interpret,
  // types
  StateSchema,
  EventObject,
  InterpreterStatus
} from 'xstate'
import { assign, ImmerAssigner } from '@xstate/immer'
import { parse } from 'ts-command-line-args'
// ...

/**
* *****************************************************************************
* * LOCAL MODULES IMPLEMENTATION: *********************************************
*/

// * type definitions (may be types / interfaces / classes)
/**
* LocContext represents the current extended state of the LOC counter.
* The extended state keeps state information that is not suitable to store
* directly as a state of the state machine.
* This information contains the current LOC count for each block and other
* state info
*/

interface LocCount {
  total: number
  global: number
  blocks: {
    [blockName: string]: number
  }
}

interface LocContext extends LocCount {
  currentBlock?: string
  bracketDepth: number
}

/**
 * The LocStateSchema represents the finite states the LocMachine can be in
 * at a single time.
 * Example: The parser may be inside a multiline comment,
 * or it might be inside a code block, or at the global scope
 * But only one of those at a time.
 */
interface LocStateSchema extends StateSchema<LocContext> {
  states: {
    parsing_global: {}
    parsing_multicomment: {}
    parsing_block: {}
    finished: {}
    finished_with_error: {}
  }
}

interface LocEventPayload {
  parsedLine: string
  blockName?: string
  bracketDepth?: number
} 

type LocEventKind<T> = { type: T, payload: LocEventPayload }

type LocEventSchema = 
  | LocEventKind<'EOF_FOUND'>
  | LocEventKind<'GLOBAL_FOUND'>
  | LocEventKind<'BLOCK_FOUND'>
  | LocEventKind<'BLOCK_SECTION'>
  | LocEventKind<'END_OF_BLOCK_FOUND'>
  | LocEventKind<'MULTILINE_COMMENT_FOUND'>
  | LocEventKind<'MULTILINE_END_FOUND'>
  | LocEventKind<'COMMENT_FOUND'>
  | LocEventKind<'WHITESPACE_FOUND'>

type LocAction = ImmerAssigner<LocContext, LocEventSchema>

interface LocCounterArgs {
  source?: string
}
// Top-level function declarations: -------------------------------------------

// Machine actions:
const countGlobal: LocAction = function (context, event) {
  context.global += 1
}
const countTotal: LocAction = function (context, event) {
  context.total += 1
}
const initBlock: LocAction = function (context, event) {
  if (event.payload.blockName) {
    context.blocks[event.payload.blockName] = 0
    context.currentBlock = event.payload.blockName
  }
}
const resetBracketDepth: LocAction = function (context, event) {
  context.bracketDepth = 0
}
const countCurrentBlock: LocAction = function (context, event) {
  if (context.currentBlock) {
    context.blocks[context.currentBlock] += 1
  }
}
const clearCurrentBlock: LocAction = function (context, event) {
  context.currentBlock = null
}
const updateBracketDepth: LocAction = function (context, event) {
  if(event.payload.bracketDepth) {
    context.bracketDepth += event.payload.bracketDepth
  }
}

/**
 * getLocMachine sets up the machine required to keep the state of the
 * LOC counter, it configures it and returns for the main program to use.
 */
export function getLocMachine(): StateMachine<LocContext, LocStateSchema, LocEventSchema> {
  const locDefaultContext: LocContext = {
    total: 0,
    global: 0,
    blocks: {
      // functionX: 0 
    },
    currentBlock: null,
    bracketDepth: 0
  }
  const locStateSchema = {
    parsing_global: {
      on: {
        EOF_FOUND: 'finished',
        GLOBAL_FOUND: {
          target: 'parsing_global',
          actions: ['countGlobal', 'countTotal']
        },
        BLOCK_FOUND: {
          target: 'parsing_block',
          actions: [
            'initBlock',
            'resetBracketDepth',
            'countCurrentBlock',
            'countTotal'
          ]
        },
        MULTILINE_COMMENT_FOUND: 'parsing_multicomment',
        COMMENT_FOUND: {
          target: 'parsing_global'
        },
        WHITESPACE_FOUND: {
          target: 'parsing_global'
        },
        END_OF_BLOCK_FOUND: {
          target: 'finished_with_error'
        }
      }
    },
    parsing_multicomment: {
      on: {
        MULTILINE_COMMENT_SEGMENT_FOUND: {
          target: 'parsing_multicomment'
        },
        WHITESPACE_FOUND: {
          target: 'parsing_multicomment'
        },
        BLOCK_SECTION: {
          target: 'parsing_multicomment'
        },
        END_OF_BLOCK_FOUND: {
          target: 'parsing_multicomment'
        },
        MULTILINE_END_FOUND: [{
          target: 'parsing_block',
          cond: 'isInsideBlock'
        }, {
          target: 'parsing_global'
        }],
        EOF_FOUND: 'finished_with_error'
      }
    },
    parsing_block: {
      on: {
        BLOCK_SECTION: {
          target: 'parsing_block',
          actions: [
            'countCurrentBlock',
            'countTotal',
            'updateBracketDepth'
          ]
        },
        END_OF_BLOCK_FOUND: [{
          target: 'parsing_block',
          actions: [
            'countCurrentBlock',
            'countTotal',
            'updateBracketDepth'
          ],
          cond: 'isNestedBlock'
        }, {
          target: 'parsing_global',
          actions: ['clearCurrentBlock']
        }],
        MULTILINE_COMMENT_FOUND: 'parsing_multicomment',
        COMMENT_FOUND: {
          target: 'parsing_block'
        },
        WHITESPACE_FOUND: {
          target: 'parsing_block'
        },
        EOF_FOUND: 'finished_with_error'
      }
    },
    finished: {
      type: 'final' as const
    },
    finished_with_error: {
      type: 'final' as const
    }
  }
  const guards = {
    isInsideBlock: (ctx: LocContext) => !!ctx.currentBlock
  }
  const actions = {
    countGlobal: assign(countGlobal),
    countTotal: assign(countTotal),
    initBlock: assign(initBlock),
    resetBracketDepth: assign(resetBracketDepth),
    countCurrentBlock: assign(countCurrentBlock),
    clearCurrentBlock: assign(clearCurrentBlock),
    updateBracketDepth: assign(updateBracketDepth)
  }
  const locMachineDefinition = {
    id: 'locCounter',
    initial: 'parsing_global' as const,
    context: locDefaultContext,
    states: locStateSchema
  }
  return Machine(locMachineDefinition, { guards, actions })
}

export function getFilePath(): string {
  const args = parse<LocCounterArgs>({source: { type: String, optional: true }})
  const filePath = args.source
    ? join(process.cwd(), args.source)
    : __filename
  return filePath
}

export function checkIfFileExists(path: string): boolean {
  try {
    if (existsSync(path)) {
      return true
    }
  } catch (err) {
    return false
  }
}

export async function getCodeLines(path: string): Promise<string[] | null> {
  if (!checkIfFileExists(path)) {return null}
  const lineReader = createInterface({
    input: createReadStream(path)
  })
  let lines: string[] = []
  lineReader.on('line', (line) => {
    lines.push(line)
  })
  const readerPromise = new Promise<string[]>((resolve) => {
    lineReader.on('close', () => {
      resolve(lines)
    })
  })
  return readerPromise
}

function runLocCounter(lines: string[]): LocCount {
  const locMachine = getLocMachine()
  const locService = interpret(locMachine)
  locService.start()
  // while(locService.status === InterpreterStatus.Running) {

  // }
  return {
    blocks: {},
    global: 0,
    total: 0
  }
}

function printResult(locCount: LocCount) {
  console.log(locCount)
}

async function main() {
  const filePath = getFilePath()
  const codeLines = await getCodeLines(filePath)
  const locCount = runLocCounter(codeLines)
  printResult(locCount)
  // EXAMPLE USAGE:
  // locService.send({type: 'BLOCK_FOUND', payload: {parsedLine: 'function () {'}})
}

/**
* *****************************************************************************
* START OF PROGRAM EXECUTION **************************************************
*/

main()

/** THIS LINE IS LEFT BLANK INTENTIONALLY, DO NOT REMOVE: */
