
import { LinkedList } from './LinkedList'
import { linearRegression, calcBeta0, calcBeta1, calcR, calcR2, zip } from './linearRegression'

it('estimates correctly "estimated proxy size" vs "actual added and modified size"', () => {
  const proxy = new LinkedList<number>().fromArray([130, 650, 99, 150, 128, 302, 95, 945, 368, 961])
  const actualAddedSize = new LinkedList<number>().fromArray([186, 699, 132, 272, 291, 331, 199, 1890, 788, 1601])
  const list = zip(proxy, actualAddedSize)
  const b0 = calcBeta0(list)
  const b1 = calcBeta1(list)
  const yk = linearRegression(386, b0, b1)
  const r = calcR(list)
  const r2 = calcR2(list)
  expect(b0).toBeCloseTo(-22.55)
  expect(b1).toBeCloseTo(1.7279)
  expect(r).toBeCloseTo(0.9545)
  expect(r2).toBeCloseTo(0.9111)
  expect(yk).toBeCloseTo(644.429)
})

it('estimates correctly "estimated proxy size" and "actual development time"', () => {
  const proxy = new LinkedList<number>().fromArray([130, 650, 99, 150, 128, 302, 95, 945, 368, 961])
  const actualDevTime = new LinkedList<number>().fromArray([15.0, 69.9, 6.5, 22.4, 28.4, 65.9, 19.4, 198.7, 38.8, 138.2])
  const list = zip(proxy, actualDevTime)
  const b0 = calcBeta0(list)
  const b1 = calcBeta1(list)
  const yk = linearRegression(386, b0, b1)
  const r = calcR(list)
  const r2 = calcR2(list)
  expect(b0).toBeCloseTo(-4.039)
  expect(b1).toBeCloseTo(0.1681)
  expect(r).toBeCloseTo(0.9333)
  expect(r2).toBeCloseTo(0.8711)
  expect(yk).toBeCloseTo(60.858)
})

it('estimates correctly "plan added and modified size" and "actual added and modified size"', () => {
  const planSize = new LinkedList<number>().fromArray([163, 765, 141, 166, 137, 355, 136, 1206, 433, 1130])
  const actualSize = new LinkedList<number>().fromArray([186, 699, 132, 272, 291, 331, 199, 1890, 788, 1601])
  const list = zip(planSize, actualSize)
  const b0 = calcBeta0(list)
  const b1 = calcBeta1(list)
  const yk = linearRegression(386, b0, b1)
  const r = calcR(list)
  const r2 = calcR2(list)
  expect(b0).toBeCloseTo(-23.92)
  expect(b1).toBeCloseTo(1.43097)
  expect(r).toBeCloseTo(0.9631)
  expect(r2).toBeCloseTo(0.9276)
  expect(yk).toBeCloseTo(528.4294)
})

it('estimates correctly "plan added and modified size" and "actual development time"', () => {
  const planSize = new LinkedList<number>().fromArray([163, 765, 141, 166, 137, 355, 136, 1206, 433, 1130])
  const actualDevTime = new LinkedList<number>().fromArray([15.0, 69.9, 6.5, 22.4, 28.4, 65.9, 19.4, 198.7, 38.8, 138.2])
  const list = zip(planSize, actualDevTime)
  const b0 = calcBeta0(list)
  const b1 = calcBeta1(list)
  const yk = linearRegression(386, b0, b1)
  const r = calcR(list)
  const r2 = calcR2(list)
  expect(b0).toBeCloseTo(-4.604)
  expect(b1).toBeCloseTo(0.140164)
  expect(r).toBeCloseTo(0.9480)
  expect(r2).toBeCloseTo(0.8988)
  expect(yk).toBeCloseTo(49.4994)
})
