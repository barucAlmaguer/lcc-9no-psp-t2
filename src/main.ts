
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
  blocks: { [blockName: string]: number }
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

type CodeLineType = 
  | 'GLOBAL'
  | 'STATEMENT'
  | 'ASSIGNMENT'
  | 'CONTROL_STRUCT'
  | 'TYPE_DECLARATION'
  | 'BLOCK_START'
  | 'BLOCK_END'
  | 'MULTILINE_COMMENT_START'
  | 'MULTILINE_COMMENT_BODY'
  | 'MULTILINE_COMMENT_END'
  | 'INLINE_COMMENT'
  | 'WHITESPACE'
  | 'UNKNOWN'

interface CodeLine extends LocEventPayload {
  type: CodeLineType
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
type LocStateMachine = StateMachine<LocContext, LocStateSchema, LocEventSchema>
function getLocMachine(): LocStateMachine {
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
            'countTotal',
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
          target: 'parsing_global',
          actions: ['countGlobal', 'countTotal']
        },
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
        GLOBAL_FOUND: {
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
    isInsideBlock: (ctx: LocContext) => !!ctx.currentBlock,
    isNestedBlock: (ctx: LocContext) => ctx.currentBlock && ctx.bracketDepth > 0
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

function getFilePath(): string {
  const args = parse<LocCounterArgs>({source: { type: String, optional: true }})
  const filePath = args.source ? join(process.cwd(), args.source) : __filename
  return filePath
}

function checkIfFileExists(path: string): boolean {
  try {
    if (existsSync(path)) {
      return true
    }
  } catch (err) {
    return false
  }
}

async function getCodeLines(path: string): Promise<string[] | null> {
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

type CodeLinePattern = {
  expr: RegExp,
  type: CodeLineType,
  metadata?: (line: string) => LocEventPayload
}

// magic happens here:
function parseLine (line: string): CodeLine {
  const variableDeclarationRegex = /^ *(const|let|var) */
  const multilineCommentStartRegex = /^\s*\/\*.*/
  const multilineCommentBodyRegex = /^ *\* */
  const multilineCommentEndRegex = /.*\*\/\s*/
  const whitespaceRegex = /^\s*$/
  const returnRegex = /^ *return/
  const ifRegex = / *((switch)|((else )?if)) ?\(/
  const tryRegex = /^ *try ?{/
  const blockStartRegex = /^ *((const|let|var) \w+(: *\w+)? *=)? *(async)?\s*function ?([a-zA-Z]+\w*)? ?\( ?[\s\S]* ?\)/
  const blockEndRegex = /^\s*(}|\])\s*/
  const functionCallRegex = /^ *(\w+\.)?\w+\((((\w|.)+|"\w+"|'[\s\S]+'|`[\s\S]+`)( *\, *(\w|.)+)*)?\)/
  const importStartRegex = /^import +{/
  const importEndRegex = /\s*(}|\w+) +from ("\w+"|'\w+')/
  const variableAssignRegex = / *\w+(.\w+|\[\w+(.\w+)+\])+ *(\+|\*|\-)?= */
  const objectShortAssignRegex = /^ *(\w+|"\w+"|'\w+'),?\s*$/
  const objectFullAssignRegex = / *(\w+|"\w+"|'\w+')\?? ?:/
  const interfaceStartRegex = /interface \w+(<\w+>)? +(extends \w+(<\w+>)? +)?{/
  const typeDeclarationRegex = /^type \w+ =/
  const typeUnionSegmentRegex = /^ *\| (\w+|"\w+"|'\w+')/ 
  if (line.match(whitespaceRegex)) {
    return  { type: 'WHITESPACE', parsedLine: line }
  } else if (line.match(blockStartRegex)) {
    return { type: 'BLOCK_START', parsedLine: line }
  } else if (line.match(variableDeclarationRegex)) {
    return { type: 'ASSIGNMENT', parsedLine: line }
  } else if (line.match(multilineCommentStartRegex)) {
    return { type: 'MULTILINE_COMMENT_START', parsedLine: line}
  } else if (line.match(multilineCommentEndRegex)) {
    return { type: 'MULTILINE_COMMENT_END', parsedLine: line }
  } else if (line.match(multilineCommentBodyRegex)) {
    return { type: 'MULTILINE_COMMENT_BODY', parsedLine: line }
  } else if (line.match(returnRegex)) {
    return { type: 'STATEMENT', parsedLine: line }
  } else if (line.match(ifRegex)) {
    return { type: 'CONTROL_STRUCT', parsedLine: line }
  } else if (line.match(tryRegex)) {
    return { type: 'CONTROL_STRUCT', parsedLine: line }
  } else if (line.match(interfaceStartRegex)) {
    return { type: 'TYPE_DECLARATION', parsedLine: line }
  } else if (line.match(variableAssignRegex)) {
    return { type: 'ASSIGNMENT', parsedLine: line }
  } else if (line.match(objectShortAssignRegex)) {
    return { type: 'ASSIGNMENT', parsedLine: line }
  } else if (line.match(objectFullAssignRegex)) {
    return { type: 'ASSIGNMENT', parsedLine: line }
  } else if (line.match(blockEndRegex)) {
    return { type: 'BLOCK_END', parsedLine: line }
  } else if (line.match(functionCallRegex)) {
    return { type: 'STATEMENT', parsedLine: line }
  } else if (line.match(importStartRegex)) {
    return { type: 'STATEMENT', parsedLine: line }
  } else if (line.match(importEndRegex)) {
    return { type: 'STATEMENT', parsedLine: line }
  } else if (line.match(typeDeclarationRegex)) {
    return { type: 'TYPE_DECLARATION', parsedLine: line }
  } else if (line.match(typeUnionSegmentRegex)) {
    return { type: 'TYPE_DECLARATION', parsedLine: line }
  }
  return { type: 'UNKNOWN', parsedLine: line }
}

function removeInlineComments(line: string): string {
  return line.split('//')[0]
}

'async function getCodeLines(path: string): Promise<string[] | null> {'
function getBlockName(line: string): string {
  const varFunctionRegex = / *(const|let|var) (\w+)/
  const regularFunctionRegex = / *function (\w+)/
  const isAnonymus = line.trim().match(/(const|let|var)/)
  const name = !isAnonymus ? line.match(regularFunctionRegex)[1] : line.match(varFunctionRegex)[2]
  return name
}

function getBracketNesting(parsedLine) {
  const plus = (parsedLine.match(/{/g) || []).length
  const sub = (parsedLine.match(/}/g) || []).length
  return plus - sub
}

function getLocEvent(codeLine: CodeLine): LocEventSchema {
  const { parsedLine } = codeLine
  switch (codeLine.type){
    case 'MULTILINE_COMMENT_START':
      return { type: 'MULTILINE_COMMENT_FOUND', payload: { parsedLine } }
    case 'MULTILINE_COMMENT_BODY':
      return { type: 'COMMENT_FOUND', payload: { parsedLine } }
    case 'MULTILINE_COMMENT_END':
      return { type: 'MULTILINE_END_FOUND', payload: { parsedLine } }
    case 'INLINE_COMMENT':
      return { type: 'COMMENT_FOUND', payload: { parsedLine } }
    case 'WHITESPACE':
      return { type: 'WHITESPACE_FOUND', payload: { parsedLine } }
    case 'BLOCK_START':
      return {
          type: 'BLOCK_FOUND', payload: {
          parsedLine,
          blockName: getBlockName(parsedLine),
          bracketDepth: getBracketNesting(parsedLine)
        }
      }
    case 'TYPE_DECLARATION':
      return { type: 'GLOBAL_FOUND', payload: { parsedLine, bracketDepth: getBracketNesting(parsedLine) }, }
    case 'BLOCK_END':
      return { type: 'END_OF_BLOCK_FOUND', payload: { parsedLine, bracketDepth: getBracketNesting(parsedLine) } }
    case 'GLOBAL':
    case 'ASSIGNMENT':
    case 'CONTROL_STRUCT':
    case 'STATEMENT':
      return { type: 'GLOBAL_FOUND', payload: {
        parsedLine,
        bracketDepth: getBracketNesting(parsedLine)
        }
      }
    
    case 'UNKNOWN':
    default:
      return { type: 'EOF_FOUND', payload: { parsedLine } }
  }
}

function runLocCounter(lines: string[]): LocCount {
  const locMachine = getLocMachine()
  const locService = interpret(locMachine)
  // locService.onTransition((state) => {
  //   console.log(`state: ${state.value}. count: ${state.context.total}. nested: ${state.context.bracketDepth}`)
  // })
  locService.start()
  let unknowns = 0
  // "some" function works as a .forEach with Break capability
  lines.some((line, i) => {
    if (locService.status !== InterpreterStatus.Running) { return true } // nothing to interpret anymore
    const codeLine = parseLine(removeInlineComments(line))
    unknowns += codeLine.type === 'UNKNOWN' ? 1 : 0
    const locEvent = getLocEvent(codeLine)
    locService.send(locEvent)
  })
  locService.send({type: 'EOF_FOUND', payload: {parsedLine: ''}})
  if (unknowns) console.log(`unknown lines count: ${unknowns}`)
  return locService.state.context
}

interface LocResult {
  block: string
  size: number
}
function printResult(locCount: LocCount) {
  let date = new Date()
  const offset = date.getTimezoneOffset()
  date = new Date(date.getTime() - (offset * 60 * 1000))
  const dateString = date.toISOString().split('T')[0]
  let tabularResults: LocResult[] = []
  tabularResults.push({block: 'global', size: locCount.global})
  Object.keys(locCount.blocks).forEach((key) => {
    tabularResults.push({ block: key, size: locCount.blocks[key] })
  })
  tabularResults.push({ block: 'total', size: locCount.total })
  console.log('************************************************')
  console.log(`FCFM UANL [${dateString}]`)
  console.log('PSP PROBLEMA 2: CALCULO DE LOC PARA LENGUAJE TYPESCRIPT')
  console.log('RESULTADOS DE CONTEO DE LOC:')
  console.log('------------------------------------------------')
  console.table(tabularResults)
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

// THIS LINE IS LEFT BLANK INTENTIONALLY, DO NOT REMOVE:
