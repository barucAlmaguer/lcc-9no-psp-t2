
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
  let sum = 0
  let count = 0
  let current = values.head
  while (current) {
    sum += current.value
    count += 1
    current = current.next
  }
  if (!count) return 0
  else return sum / count
}

export function zip<T, S>(xList: LinkedList<T>, yList: LinkedList<S>): LinkedList<[T, S]> {
  const zipped = new LinkedList<[T, S]>()
  let currentX = xList.head
  let currentY = yList.head
  while (currentX && currentY) {
    zipped.append([currentX.value, currentY.value])
    currentX = currentX.next
    currentY = currentY.next
  }
  return zipped
}

export function unzip(list: LinkedList<[number, number]>): [LinkedList<number>, LinkedList<number>] {
  const unzippedX = new LinkedList<number>()
  const unzippedY = new LinkedList<number>()
  let current = list.head
  while (current) {
    unzippedX.append(current.value[0])
    unzippedY.append(current.value[1])
    current = current.next
  }
  return [unzippedX, unzippedY]
}

type ItemReducerFn = (current: [number, number]) => number

export function sum(values: LinkedList<[number, number]>, itemReducer: ItemReducerFn): number {
  let accum = 0
  let current = values.head
  while (current) {
    accum += itemReducer(current.value)
    current = current.next
  }
  return accum
}

export function calcBeta1(values: LinkedList<[number, number]>): number {
  const [listX, listY] = unzip(values)
  const beta1 = (
    sum(values, ([xi, yi]) => ((xi - average(listX)) * (yi - average(listY)))) /
    sum(values, ([xi]) => ((xi - average(listX)) ** 2))
  )
  return beta1
}

export function calcBeta0(values: LinkedList<[number, number]>): number {
  const [listX, listY] = unzip(values)
  const beta1 = calcBeta1(values)
  const beta0 = average(listY) - (beta1 * average(listX))
  return beta0
}

export function linearRegression(x: number, b0: number, b1: number): number {
  return x * b1 + b0
}

export function calcR2(values: LinkedList<[number, number]>): number {
  const [, listY] = unzip(values)
  const b1 = calcBeta1(values)
  const b0 = calcBeta0(values)
  const ssTotal = sum(values, ([, yi]) => (yi - average(listY)) ** 2)
  const ssResidual = sum(values, ([xi, yi]) => (yi - linearRegression(xi, b0, b1)) ** 2)
  const r2 = 1 - (ssResidual / ssTotal)
  return r2
}

export function calcR(values: LinkedList<[number, number]>): number {
  const r2 = calcR2(values)
  const r = r2 ** (0.5)
  return r
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
