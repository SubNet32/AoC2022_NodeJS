import { DayFile, StartupArguments } from '../types'

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
  getMaxDay(files: DayFile[], getTest: boolean) {
    return files.reduce((maxDay, currentDay) => {
      if (maxDay === undefined) return currentDay
      if (currentDay.day > maxDay.day || (currentDay.day === maxDay.day && !currentDay.isTest && !getTest)) return currentDay
      return maxDay
    }, undefined)
  },
  XOR(a: any, b: any) {
    return (!!a && !b) || (!a && !!b)
  },
  logAndPassThrough<T>(value: T, message?: string) {
    console.log(message ?? '', value)
    return value
  },
  getNumberFromString(stringToParse: string, ignoreExceptions?: boolean) {
    if (!stringToParse) return undefined
    try {
      return Number.parseInt(stringToParse.replace(/[^\d]/g, ''))
    } catch (exception) {
      if (!ignoreExceptions) throw exception
      return undefined
    }
  },
  getProcessArgs(): StartupArguments {
    const processArgs = process.argv.slice(2)
    const day = processArgs.find((a) => a.toLowerCase().includes('day') || !!a.match(/^\d+$/))
    const part = processArgs.find((a) => a.toLowerCase().includes('part'))
    return { day: this.getNumberFromString(day, true), part: this.getNumberFromString(part, true), test: !!processArgs.find((a) => a.toLowerCase().includes('test')) }
  },
}

export default Utils
