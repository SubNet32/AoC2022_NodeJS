import { DayResult } from '../../types'
import Utils from '../../Utils/Utils'
import Valve from './Valve'

export default function Day(): DayResult {
  function createValveList(input: string[]) {
    let valves: Valve[] = []
    input.forEach((line) => {
      valves.push(new Valve(line))
    })
    valves.forEach((valve) => valve.assignLinkedValves(valves))
    let reducedValves = valves.filter((v) => v.flowRate > 0 || v.name === 'AA')
    reducedValves.forEach((r) =>
      r.reduceLinkedValves(
        valves,
        reducedValves.filter((v) => v.flowRate > 0)
      )
    )
    return reducedValves
  }

  async function solve1(input: string[]) {
    let valves = createValveList(input)
    let startValve = valves.find((v) => v.name === 'AA')

    let path = startValve.findMaxPressureReleasePath(
      30,
      valves.filter((v) => v.flowRate > 0)
    )
    path.forEach((p) => console.log(`(T-${p.remainingTime}) ${p.valve?.name} ${p.value}`))
    return Utils.sum(path, (p) => p.value)
  }
  async function solve2(input: string[]) {
    let valves = createValveList(input)
    let startValve = valves.find((v) => v.name === 'AA')

    return Valve.findMaxPressureReleasePath2(26, startValve, startValve, 0, 0, valves)
  }

  return { solve1, solve2 }
}
