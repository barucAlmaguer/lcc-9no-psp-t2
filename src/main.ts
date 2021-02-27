
/**
* *****************************************************************************
* *****************************************************************************
* Program assignment: <<PROG_##>>
* Name: <<Developer full name>>
* uanl_id: <<#######>>
* email: <<Developer email contact>>
* date: <<Date when the program development started in format YYYY-MM-DD>>
* description: <<Short description of program purpose>>
* *****************************************************************************
* *****************************************************************************
*/

/**
* *****************************************************************************
* SUMMARY OF MAIN FUNCTIONS: **************************************************
*
* - FUNCTION - DESCRIPTION
* - initializeData():
* - - Extracts the data required for the program to work
* - processInfo():
* - - Process information to extract required information
* - finalizeProcess():
* - - Prints the results to the desired output and cleans memory if needed
*/

/**
* *****************************************************************************
* EXTERNAL MODULES: ***********************************************************
*/
import _ from 'lodash'
// ...

/**
* *****************************************************************************
* LOCAL MODULES IMPLEMENTATION: ***********************************************
*/

// type definitions (may be types / interfaces / classes)
/**
* <<InlineTypeDeclaration>> explanation:
* <<description>>
*/
type InlineTypeDeclaration = void
/**
* <<InlineUnionDeclaration>> explanation:
* <<description>>
*/
type InlineUnionDeclaration = 1 | 2 | "3" // | ...
/**
* <<MultilineTypeDeclaration>> explanation:
* <<description>>
*/
type MultilineTypeDeclaration = {
  field1: boolean
  optionalField2?: string
}
/**
* <<MyInterface>> explanation:
* <<description>>
*/
interface MyInterface {
  // <<if required, inline comment for field description>>
  field1: string
  // <<if required, inline comment for field description>>
  optionalField2?: boolean
}

// Top-level function declarations: -----------------------
function initializeData(): object {
  return {}
}
function processInfo(data: object): object {
  return {}
}
function finalizeProcess(process: object): boolean {
  return true
}
function main(): void {
  console.log('hi from template!')
}

/**
* *****************************************************************************
* START OF PROGRAM EXECUTION **************************************************
*/

main()

/** THIS LINE IS LEFT BLANK INTENTIONALLY, DO NOT REMOVE: */
