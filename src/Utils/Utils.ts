import { DayFile } from '../types'

const Utils = {
  mapFiles(files: string[]): DayFile[] {
    return files
      .filter((q) => q.match(/^day\d{2}(_test)?.txt/g))
      .map((file) => ({
        file,
        day: Utils.extractDay(file),
        isTest: !!file.includes('test'),
      }))
  },
  extractDay(file: string) {
    try {
      return Number.parseInt(file.match(/\d{2}/)[0])
    } catch (_reason) {
      return 0
    }
  },
  getMaxDay(files: DayFile[]) {
    return files.reduce((result, current) => {
      if (result === undefined) return current
      if (result.day > current.day || (result.day === current.day && !result.isTest)) return result
      return current
    }, undefined)
  },
  XOR(a: any, b: any) {
    return (!!a && !b) || (!a && !!b)
  },
  logAndPassThrough<T>(value: T, message?: string) {
    console.log(message ?? '', value)
    return value
  },
}

export default Utils
