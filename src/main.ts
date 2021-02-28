
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
import {
  Machine,
  StateMachine,
  interpret,
  // types
  StateSchema,
  EventObject,
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
interface LocContext {
  total: number
  global: number
  blocks: {
    [blockName: string]: number 
  }
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

type LocEvent = 
  | { type: 'EOF_FOUND', payload: LocEventPayload }
  | { type: 'GLOBAL_FOUND', payload: LocEventPayload }
  | { type: 'BLOCK_FOUND', payload: LocEventPayload }
  | { type: 'BLOCK_SECTION', payload: LocEventPayload }
  | { type: 'END_OF_BLOCK_FOUND', payload: LocEventPayload }
  | { type: 'MULTILINE_COMMENT_FOUND', payload: LocEventPayload }
  | { type: 'MULTILINE_END_FOUND', payload: LocEventPayload }
  | { type: 'COMMENT_FOUND', payload: LocEventPayload }
  | { type: 'WHITESPACE_FOUND', payload: LocEventPayload }

type LocAction = ImmerAssigner<LocContext, LocEvent>
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
export function getLocMachine(): StateMachine<LocContext, LocStateSchema, LocEvent> {
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
  const locMachineDefinition = {
    id: 'locCounter',
    initial: 'parsing_global' as const,
    context: locDefaultContext,
    states: locStateSchema
  }
  return Machine(locMachineDefinition, { guards })
}

function main(): void {
  console.log('hi from LOC counter!')
  const locMachine = getLocMachine()
  const locService = interpret(locMachine)
  locService.start()
  // EXAMPLE USAGE:
  // locService.send({type: 'BLOCK_FOUND', payload: {parsedLine: 'function () {'}})
}

/**
* *****************************************************************************
* START OF PROGRAM EXECUTION **************************************************
*/

main()

/** THIS LINE IS LEFT BLANK INTENTIONALLY, DO NOT REMOVE: */
