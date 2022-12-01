import { DayResult } from '../../types'

export default function Day(): DayResult {
  function convertToElfList(input: string[]) {
    let caloriesPerElf: number[] = []
    let currentSum = 0
    for (let line of input) {
      if (!line) {
        caloriesPerElf.push(currentSum)
        currentSum = 0
        continue
      }
      currentSum += Number.parseInt(line)
    }
    caloriesPerElf.sort((a, b) => b - a)
    return caloriesPerElf
  }

  async function solve1(input: string[]) {
    return convertToElfList(input)[0]
  }
  async function solve2(input: string[]) {
    let list = convertToElfList(input)
    return list[0] + list[1] + list[2]
  }

  return { solve1, solve2 }
}
