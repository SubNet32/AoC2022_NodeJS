import { FiFo } from '../../Models/Storage/FiFo'
import { DayResult } from '../../types'
import Utils from '../../Utils/Utils'

export default function Day(): DayResult {
  function findMarker(input: string, size: number) {
    let fifo = new FiFo<string>(size)
    let chars = Array.from(input)
    let index = 0
    while (true) {
      index++
      fifo.add(chars.shift())
      if (fifo.isFull() && !Utils.containsDuplicate(fifo.items)) {
        return index
      }
      if (index > input.length) throw 'Too many iterations'
    }
  }

  async function solve1(input: string[]) {
    return findMarker(input[0], 4)
  }
  async function solve2(input: string[]) {
    return findMarker(input[0], 14)
    return ''
  }

  return { solve1, solve2 }
}
