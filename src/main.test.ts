
const { LinkedList, mean, stdDeviation } = require('./main')

it('isEmpty returns true when linkedList has no nodes', () => {
  const linkedList = new LinkedList()
  expect(linkedList.isEmpty()).toBe(true)
})

it('mean returns same value for ')