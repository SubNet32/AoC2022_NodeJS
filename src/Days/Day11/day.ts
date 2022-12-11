import { DayResult } from '../../types'
import Monkey from './Monkey'

export default function Day(): DayResult {
  function initMonkeys(input: string[], part: number) {
    const monkeys: Monkey[] = []
    for (let i = 0; i < input.length; i += 7) {
      monkeys.push(new Monkey(input.slice(i, i + 7), part === 1 ? 3 : 1))
    }
    let mod = monkeys.reduce((prod, m) => prod * m.test, 1)
    monkeys.forEach((m) => {
      m.assignTargets(monkeys)
      m.mod = mod
    })
    return monkeys
  }

  async function solve1(input: string[]) {
    const monkeys = initMonkeys(input, 1)
    let round = 1
    while (round <= 20) {
      console.log(`\nRound ${round}`)
      monkeys.forEach((m) => m.throwItems())
      monkeys.forEach((m) => m.printItems())
      round++
    }

    monkeys.sort((a, b) => b.itemCounter - a.itemCounter)
    return monkeys[0].itemCounter * monkeys[1].itemCounter
  }
  async function solve2(input: string[]) {
    const monkeys = initMonkeys(input, 2)
    let round = 1
    while (round <= 10000) {
      monkeys.forEach((m) => m.throwItems())
      // console.log(`\nRound ${round}`)
      // monkeys.forEach((m) => m.printItems())
      round++
    }

    monkeys.sort((a, b) => b.itemCounter - a.itemCounter)
    return monkeys[0].itemCounter * monkeys[1].itemCounter
  }

  return { solve1, solve2 }
}
