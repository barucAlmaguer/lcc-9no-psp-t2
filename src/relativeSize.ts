
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
  const normalizedSizeInput = input.map((item: RelativeSizeInput) => (
    item.partSize / (item.partNumItems ?? 1)
  ))
  return normalizedSizeInput
}

export function normalizeLogSizeInput(input: number[]): number[]  {
  const logSizeInput = input.map((input) => (
    Math.log(input)
  ))
  return logSizeInput
}

export function calcAverage(values: number[]): number {
  const valuesSum = values.reduce((sum, current) => {
    return sum + current
  }, 0)
  return valuesSum / values.length
}

export function calcVariance(logValues: number[], average: number): number {
  const sumSquareDiffs = logValues.reduce((sum, current) => {
    const squareDiff = Math.pow((current - average), 2)
    return sum + squareDiff
  }, 0)
  const nMinus1 = (logValues.length - 1)
  return sumSquareDiffs / nMinus1
}

export function calcStdDeviation(variance: number): number {
  return Math.sqrt(variance)
}

export function calcRelativeLogRanges(average: number, stdDev: number ): RelativeRanges {
  return {
    vs: average - (2 * stdDev),
    s: average - (1 * stdDev),
    m: average,
    l: average + (1 * stdDev),
    vl: average + (2 * stdDev)
  }
}

export function calcNormalRelativeRanges(ranges: RelativeRanges): RelativeRanges {
  return {
    vs: Math.exp(ranges.vs),
    s: Math.exp(ranges.s),
    m: Math.exp(ranges.m),
    l: Math.exp(ranges.l),
    vl: Math.exp(ranges.vl)
  }
}

export function printRelativeSizeTable(ranges: RelativeRanges) {
  let date = new Date()
  const offset = date.getTimezoneOffset()
  date = new Date(date.getTime() - (offset * 60 * 1000))
  const dateString = date.toISOString().split('T')[0]
  // TODO: print results in table
  console.log(`************************************************
  FCFM UANL [${dateString}]
  ALUMNO: Rafael Baruc Almaguer López
  MATRICULA: 1443335
  PSP PROBLEMA 4: ESTIMACION DE TAMAÑO RELATIVO
  RESULTADOS DE ESTIMACION:
  ------------------------------------------------
  `)
  console.table(ranges)
}

// async function main() {
//   const filePath = getFilePath()
//   const codeLines = await getCodeLines(filePath)
//   const locCount = runLocCounter(codeLines)
//   printResult(locCount)
// }

/**
* *****************************************************************************
* START OF PROGRAM EXECUTION **************************************************
*/

// main()

// THIS LINE IS LEFT BLANK INTENTIONALLY, DO NOT REMOVE:
