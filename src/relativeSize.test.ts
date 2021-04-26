
import {
  normalizeSizeInput,
  normalizeLogSizeInput,
  calcAverage,
  calcVariance,
  calcStdDeviation,
  calcRelativeLogRanges,
  calcNormalRelativeRanges,
  printRelativeSizeTable,
  RelativeSizeInput
} from './relativeSize'

it('calculates correctly the relative size for LOC/method', () => {
  const data: RelativeSizeInput[] = [
    {partName: 'each_char',           partSize: 18,   partNumItems: 3},
    {partName: 'string_read',         partSize: 18,   partNumItems: 3},
    {partName: 'single_character',    partSize: 25,   partNumItems: 3},
    {partName: 'each_line',           partSize: 31,   partNumItems: 3},
    {partName: 'single_char',         partSize: 37,   partNumItems: 3},
    {partName: 'string_builder',      partSize: 82,   partNumItems: 5},
    {partName: 'string_manager',      partSize: 82,   partNumItems: 4},
    {partName: 'list_clump',          partSize: 87,   partNumItems: 4},
    {partName: 'list_clip',           partSize: 89,   partNumItems: 4},
    {partName: 'string_decrementer',  partSize: 230,  partNumItems: 10},
    {partName: 'Char',                partSize: 85,   partNumItems: 3},
    {partName: 'Character',           partSize: 87,   partNumItems: 3},
    {partName: 'Converter',           partSize: 558,  partNumItems: 10}
  ]

  const normalizedData = normalizeSizeInput(data)
  const logData = normalizeLogSizeInput(normalizedData)
  const average = calcAverage(logData)
  const variance = calcVariance(logData, average)
  const stdDev = calcStdDeviation(variance)
  const relativeLogRanges = calcRelativeLogRanges(average, stdDev)
  const relativeRanges = calcNormalRelativeRanges(relativeLogRanges)
  const expectedRelativeRanges = {
    vs: 4.3953,
    s: 8.5081,
    m: 16.4696,
    l: 31.8811,
    vl: 61.7137
  }
  expect(relativeRanges.vs).toBeCloseTo(expectedRelativeRanges.vs)
  expect(relativeRanges.s).toBeCloseTo(expectedRelativeRanges.s)
  expect(relativeRanges.m).toBeCloseTo(expectedRelativeRanges.m)
  expect(relativeRanges.l).toBeCloseTo(expectedRelativeRanges.l)
  expect(relativeRanges.vl).toBeCloseTo(expectedRelativeRanges.vl)
})

it('calculates correctly the relative size for chapters', () => {
  const data: RelativeSizeInput[] = [
    {partName: 'Preface', partSize: 7},
    {partName: 'Chapter 1', partSize: 12},
    {partName: 'Chapter 2', partSize: 10},
    {partName: 'Chapter 3', partSize: 12},
    {partName: 'Chapter 4', partSize: 10},
    {partName: 'Chapter 5', partSize: 12},
    {partName: 'Chapter 6', partSize: 12},
    {partName: 'Chapter 7', partSize: 12},
    {partName: 'Chapter 8', partSize: 12},
    {partName: 'Chapter 9', partSize: 8},
    {partName: 'Appendix A', partSize: 8},
    {partName: 'Appendix B', partSize: 8},
    {partName: 'Appendix C', partSize: 20},
    {partName: 'Appendix D', partSize: 14},
    {partName: 'Appendix E', partSize: 18},
    {partName: 'Appendix F', partSize: 12}, 
  ]

  const normalizedData = normalizeSizeInput(data)
  const logData = normalizeLogSizeInput(normalizedData)
  const average = calcAverage(logData)
  const variance = calcVariance(logData, average)
  const stdDev = calcStdDeviation(variance)
  const relativeLogRanges = calcRelativeLogRanges(average, stdDev)
  const relativeRanges = calcNormalRelativeRanges(relativeLogRanges)
  const expectedRelativeRanges = {
    vs: 6.3375,
    s: 8.4393,
    m: 11.2381,
    l: 14.9650,
    vl: 19.9280
  }
  expect(relativeRanges.vs).toBeCloseTo(expectedRelativeRanges.vs)
  expect(relativeRanges.s).toBeCloseTo(expectedRelativeRanges.s)
  expect(relativeRanges.m).toBeCloseTo(expectedRelativeRanges.m)
  expect(relativeRanges.l).toBeCloseTo(expectedRelativeRanges.l)
  expect(relativeRanges.vl).toBeCloseTo(expectedRelativeRanges.vl)
})
