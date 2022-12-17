import { PathFinder2 } from '../../Models/Space/PathFinder'
import Utils from '../../Utils/Utils'

type ValvePressureRelease = { valve: Valve | undefined; value: number; remainingTime: number }
type LinkedValve = { valve: Valve; moveCost: number }

type NextValvePair = { nextValveA: LinkedValve | null; nextValveB: LinkedValve | null }

export default class Valve {
  public name: string
  public flowRate: number
  public initLinkedNames: string[]
  public initLinkedValves: Valve[] = []
  public linkedVales: LinkedValve[] = []

  constructor(input: string) {
    let [name, flowRate, ...linkedVales] = input
      .replace('Valve ', '')
      .replace('has flow rate=', '')
      .replace('; tunnels lead to valves', '')
      .replace('; tunnel leads to valve', '')
      .replace(/,/g, '')
      .split(' ')
    this.name = name
    this.flowRate = Number.parseInt(flowRate)
    this.initLinkedNames = linkedVales
  }

  public assignLinkedValves(valves: Valve[]) {
    this.initLinkedNames.forEach((valve) => {
      this.initLinkedValves.push(valves.find((v) => v.name === valve))
    })
  }

  public reduceLinkedValves(allValves: Valve[], targetValves: Valve[]) {
    targetValves.forEach((target) => {
      if (target === this) return
      let path = PathFinder2(allValves, this, target, (currentNode) => currentNode.initLinkedValves.map((v) => ({ node: v, cost: 1 })))
      path.reverse()
      console.log(`Path from ${this.name} to ${target.name} (length:${path.length - 1}):   ${path.map((p) => p.name).join(' -> ')}`)
      this.linkedVales.push({ valve: target, moveCost: path.length - 1 })
    })
  }

  public findMaxPressureReleasePath(remainingTime: number, closedValves: Valve[]): ValvePressureRelease[] {
    //   console.log(`${'-'.repeat(30 - remainingTime)}> (T-${remainingTime})  ${this.name}`)
    if (remainingTime <= 0) return [{ valve: undefined, value: 0, remainingTime }]
    if (closedValves.length === 0) return [{ valve: undefined, value: 0, remainingTime }]
    let bestPath: ValvePressureRelease[] = []
    let bestPathSum = 0

    function checkBestPath(path: ValvePressureRelease[]) {
      let sum = Utils.sum(path, (p) => p.value)
      if (sum > 0 && sum > bestPathSum) {
        bestPath = path
        bestPathSum = sum
      }
    }

    for (let valve of this.linkedVales.filter((v) => closedValves.includes(v.valve))) {
      //open this valve and then go to linked valve
      if (this.flowRate > 0) {
        let path = valve.valve.findMaxPressureReleasePath(
          remainingTime - valve.moveCost - 1,
          closedValves.filter((c) => c !== this)
        )
        path = [{ valve: this, value: this.calcPressureRelease(remainingTime - 1), remainingTime: remainingTime - 1 }, ...path]
        checkBestPath(path)
      }
      //for valve AA
      else {
        let path = valve.valve.findMaxPressureReleasePath(remainingTime - valve.moveCost, closedValves)
        path = [{ valve: this, value: 0, remainingTime }, ...path]
        checkBestPath(path)
      }
    }
    return bestPath
  }

  public static findMaxPressureReleasePath2(remainingTime: number, targetA: Valve | null, targetB: Valve | null, movingTimeA: number, movingTimeB: number, closedValves: Valve[]): number {
    if (remainingTime <= 0) return 0
    if (closedValves.length === 0) return 0
    let bestPath = 0

    let targetAReached = (movingTimeA <= 0 && !!targetA) || !targetA
    let targetBReached = (movingTimeB <= 0 && !!targetB) || !targetB
    let possibleNextValvesA = targetAReached ? targetA.linkedVales.filter((v) => closedValves.includes(v.valve) && v.valve !== targetB) : [{ valve: targetA, moveCost: 0 }]
    if (possibleNextValvesA.length === 0) possibleNextValvesA.push({ valve: targetA, moveCost: 0 })
    for (let valveA of possibleNextValvesA) {
      let possibleNextValvesB = targetBReached
        ? targetB.linkedVales.filter((v) => closedValves.includes(v.valve) && v.valve !== valveA.valve && v.valve !== targetA)
        : [{ valve: targetB, moveCost: 0 }]
      if (possibleNextValvesB.length === 0) possibleNextValvesB.push({ valve: targetB, moveCost: 0 })
      for (let valveB of possibleNextValvesB) {
        let newClosedValves = closedValves.filter((c) => (!targetAReached || c !== targetA) && (!targetBReached || c !== targetB))
        let pathValue = 0
        let pressureRelease = 0
        if (targetAReached && closedValves.includes(targetA)) pressureRelease += targetA.calcPressureRelease(remainingTime)
        if (targetBReached && closedValves.includes(targetB) && targetA !== targetB) pressureRelease += targetB.calcPressureRelease(remainingTime)

        //for starting valve AA
        if (targetA.name === 'AA') {
          pathValue = Valve.findMaxPressureReleasePath2(remainingTime - 1, valveA.valve, valveB.valve, valveA.moveCost, valveB.moveCost, newClosedValves)
        } else {
          pathValue =
            pressureRelease +
            Valve.findMaxPressureReleasePath2(
              remainingTime - 1,
              valveA.valve,
              valveB.valve,
              targetAReached ? valveA.moveCost : movingTimeA - 1,
              targetBReached ? valveB.moveCost : movingTimeB - 1,
              newClosedValves
            )
        }

        if (pathValue > bestPath) bestPath = pathValue
      }
    }

    return bestPath
  }

  public calcPressureRelease(remainingTime: number) {
    return this.flowRate * remainingTime
  }

  public checkAllValvesAreOpen(allValves: Valve[], openValves: Valve[]) {
    for (let valve of allValves) {
      if (valve.flowRate > 0 && !openValves.includes(valve)) return false
    }
    return true
  }
}
