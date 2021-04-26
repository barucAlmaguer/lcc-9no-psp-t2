
/**
* *****************************************************************************
* *****************************************************************************
* Program assignment: Linear regression
* Name: Rafael Baruc Almaguer López
* uanl_id: 1443335
* email: baruc.almaguer@gmail.com
* date: 2021-03-24
* description:
*   This program calculates linear regression parameters and evaluates it
*   to give accurate approximations for new data points.
*   
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
// ...

/**
* *****************************************************************************
* * LOCAL MODULES IMPLEMENTATION: *********************************************
*/

// * type definitions (may be types / interfaces / classes)
export interface RelativeSizeInput {
  partName: string
  partSize: number
  partNumItems?: number
}

export interface RelativeRanges {
  vs: number
  s: number
  m: number
  l: number
  vl: number
}

// * Main methods *************************************************************
export function normalizeSizeInput(input: RelativeSizeInput[]): number[] {
  throw new Error('Not implemented')
}
export function normalizeLogSizeInput(input: number[]): number[]  {
  throw new Error('Not implemented')
}
export function calcAverage(values: number[]): number {
  throw new Error('Not implemented')
}
export function calcVariance(logValues: number[], average: number): number {
  throw new Error('Not implemented')
}
export function calcStdDeviation(variance: number): number {
  throw new Error('Not implemented')
}
export function calcRelativeLogRanges(average: number, stdDev: number ): RelativeRanges {
  throw new Error('Not implemented')
}
export function calcNormalRelativeRanges(ranges: RelativeRanges): RelativeRanges {
  throw new Error('Not implemented')
}
export function printRelativeSizeTable(ranges: RelativeRanges) {
  throw new Error('Not implemented')
}


function printResult(ranges: RelativeRanges) {
  throw new Error('Not implemented')
  let date = new Date()
  const offset = date.getTimezoneOffset()
  date = new Date(date.getTime() - (offset * 60 * 1000))
  const dateString = date.toISOString().split('T')[0]
  // let tabularResults: ILinearRegressionResult
  // TODO: print results in table
  console.log('************************************************')
  console.log(`FCFM UANL [${dateString}]`)
  console.log('PSP PROBLEMA 2: CALCULO DE LOC PARA LENGUAJE TYPESCRIPT')
  console.log('RESULTADOS DE CONTEO DE LOC:')
  console.log('------------------------------------------------')
  // console.table(tabularResults)
}

// async function main() {
//   const filePath = getFilePath()
//   const codeLines = await getCodeLines(filePath)
//   const locCount = runLocCounter(codeLines)
//   printResult(locCount)
//   // EXAMPLE USAGE:
//   // locService.send({type: 'BLOCK_FOUND', payload: {parsedLine: 'function () {'}})
// }

/**
* *****************************************************************************
* START OF PROGRAM EXECUTION **************************************************
*/

// main()

// THIS LINE IS LEFT BLANK INTENTIONALLY, DO NOT REMOVE:
