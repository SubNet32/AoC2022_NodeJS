import { DayResult } from '../../types'

export default function Day(): DayResult {
  async function solve1(input: string[]) {
    return input.join(',')
  }
  async function solve2(input: string[]) {
    return ''
  }

  return { solve1, solve2 }
}
