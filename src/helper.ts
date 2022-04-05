import { ColumnProps } from './store'
export function generateFitUrl (column: ColumnProps) {
  if (!column.avatar) {
    column.avatar = {
      url: require('@/assets/column.jpg')
    }
  }
}
interface CheckCondition {
  // 格式，可以包括多种格式
  format?: string[]
  size?: number
}
type ErrorType = 'size' | 'format' | null
export function beforeUploadCheck (file: File, condition: CheckCondition) {
  const { format, size } = condition
  const isValidFormat = format ? format.includes(file.type) : true
  const isValidSize = size ? (file.size / 1024 / 1024 < size) : true
  let error: ErrorType = null
  if (!isValidFormat) {
    error = 'format'
  }
  if (!isValidSize) {
    error = 'size'
  }
  return {
    passed: isValidFormat && isValidSize,
    error
  }
}

interface TestProps {
  _id: string
  name: string
}
const testData1: TestProps[] = [{ _id: '1', name: 'a' }, { _id: '2', name: 'b' }]

// 约束泛型extends，我们要约束这个泛型让它必须符合某种特殊的条件
export const arrToObj = <T extends { _id?: string }>(arr: Array<T>) => {
  return arr.reduce((prev, current) => {
    if (current._id) {
      prev[current._id] = current
    }
    return prev
  }, {} as { [key: string]: T })
}
const result1 = arrToObj(testData1)
// console.log(result1)
// { 1: { _id: '1', name: 'a' }, 2: { _id: '2', name: 'b' } }

export const objToArr = <T>(obj: {[key: string]: T}) => {
  return Object.keys(obj).map(key => obj[key])
}
const testData2: {[key: string]: TestProps} = {
  1: { _id: '1', name: 'a' },
  2: { _id: '2', name: 'b' }
}
const result2 = objToArr(testData2)
// console.log(result2)
// [{ _id: '1', name: 'a' }, { _id: '2', name: 'b' }]
