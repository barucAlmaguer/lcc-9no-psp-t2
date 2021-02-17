
const { LinkedList, mean, stdDeviation } = require('./main')

it('isEmpty returns true when linkedList has no nodes', () => {
  const linkedList = new LinkedList()
  expect(linkedList.isEmpty()).toBe(true)
})

it('mean returns 0 for empty list', () => {
  let list = new LinkedList().fromArray([])
  expect(mean(list)).toBe(0)
})

it('mean returns N for a same-number list', () => {
  let list = new LinkedList().fromArray([4, 4, 4, 4, 4, 4, 4])
  expect(mean(list)).toBe(4)
})

it('mean returns a value between its input min and max values', () => {
  let list = new LinkedList().fromArray([10, 20, 30, 100, 50])
  let listMean = mean(list)
  expect(listMean).toBeGreaterThanOrEqual(10)
  expect(listMean).toBeLessThanOrEqual(100)
})

it('mean returns same value for a single-item mean', () => {
  let list = new LinkedList().fromArray([5])
  expect(mean(list)).toBe(5)

  list = new LinkedList().fromArray([3])
  expect(mean(list)).toBe(3)

  list = new LinkedList().fromArray([-1])
  expect(mean(list)).toBe(-1)
})

it('mean returns correct value for heterogeneous arrays', () => {
  let list = new LinkedList().fromArray([1, 2, 3])
  expect(mean(list)).toBeCloseTo(2)
  list = new LinkedList().fromArray([2, 4, 6, 8, 10])
  expect(mean(list)).toBeCloseTo(6)
  list = new LinkedList().fromArray([1, 3])
  expect(mean(list)).toBeCloseTo(2)
  list = new LinkedList().fromArray([1, 4])
  expect(mean(list)).toBeCloseTo(2.5)
})

it('std deviation is 0 for single-item arrays', () => {
  let list = new LinkedList().fromArray([10000])
  expect(stdDeviation(list)).toBe(0)
})

it('std deviation is non-negative for any array', () => {
  let L0 = new LinkedList().fromArray([])
  let L1 = new LinkedList().fromArray([10])
  let L2 = new LinkedList().fromArray([-20])
  let L3 = new LinkedList().fromArray([-20, -40])
  let L4 = new LinkedList().fromArray([20, 40])
  let L5 = new LinkedList().fromArray([20, -40])
  const testCases = [L0,L1,L2,L3,L4,L5]
  testCases.forEach(testCase => {
    expect(stdDeviation(testCase)).toBeGreaterThanOrEqual(0)
  })
})

// ! Homework test cases:

it('returns expected values from mean and std. deviation functions', () => {
  const estimateProxySizes = new LinkedList().fromArray([ 160, 591, 114, 229, 230, 270, 128, 1657, 624, 1503])
  const developmentHours = new LinkedList().fromArray([ 15.0,69.9,6.5,22.4,28.4,65.9,19.4,198.7,38.8,138.2])
  // * tests ProxySizes
  let meanValue = mean(estimateProxySizes)
  let stdDevValue = stdDeviation(estimateProxySizes)
  expect(meanValue).toBeCloseTo(550.6)
  expect(stdDevValue).toBeCloseTo(572.03)
  // * tests ProxySizes
  meanValue = mean(developmentHours)
  stdDevValue = stdDeviation(developmentHours)
  expect(meanValue).toBeCloseTo(60.32)
  expect(stdDevValue).toBeCloseTo(62.26)
})

