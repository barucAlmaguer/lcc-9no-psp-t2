
const { LinkedList, mean, stdDeviation } = require('./main')

it('isEmpty returns true when linkedList has no nodes', () => {
  const linkedList = new LinkedList()
  expect(linkedList.isEmpty()).toBe(true)
})

it('mean returns 0 for empty list', () => {
  let list = new LinkedList().fromArray([])
  expect(mean(list)).toBe(0)
})

it('mean returns same value for a single-item mean', () => {
  let list = new LinkedList().fromArray([5])
  expect(mean(list)).toBe(5)

  list = new LinkedList().fromArray([3])
  expect(mean(list)).toBe(3)

  list = new LinkedList().fromArray([-1])
  expect(mean(list)).toBe(-1)
})