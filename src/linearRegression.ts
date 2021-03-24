
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
import { LinkedList } from './LinkedList'
// ...

/**
* *****************************************************************************
* * LOCAL MODULES IMPLEMENTATION: *********************************************
*/

// * type definitions (may be types / interfaces / classes)
interface ILinearRegressionResult {
  B0: number
  B1: number
  Rxy: number
  R2: number
  Yk: number
}

// * Main methods *************************************************************
export function average(values: LinkedList<number>): number {
  throw new Error('"average" Not implemented')
}
export function zip<T, S>(xList: LinkedList<T>, yList: LinkedList<S>): LinkedList<[T, S]> {
  throw new Error('"zip" Not implemented')
}

type Tuple<T, S> = [T, S]
type ItemReducerFn<T, S> = (item: Tuple<T, S>) => number
export function sum<T, S>(values: LinkedList<[T, S]>, itemReducer: ItemReducerFn<T, S>): number {
  throw new Error('"sum" Not implemented')
}

export function calcBeta1(values: LinkedList<[number, number]>): number {
  throw new Error('"calcBeta1" Not implemented')
}

export function calcBeta0(values: LinkedList<[number, number]>): number {
  throw new Error('"calcBeta0" Not implemented')
}

export function linearRegression(x: number, b0: number, b1: number): number {
  throw new Error('"linearRegression" Not implemented')
}

export function calcR(values: LinkedList<[number, number]>): number {
  throw new Error('"calcR" Not implemented')
}

export function calcR2(values: LinkedList<[number, number]>): number {
  throw new Error('"calcR" Not implemented')
}

function printResult(regression: ILinearRegressionResult) {
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
