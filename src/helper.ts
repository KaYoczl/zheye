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
