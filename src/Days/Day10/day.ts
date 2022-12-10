import { DayResult } from '../../types'
import NumberUtils from '../../Utils/NumberUtils'

export default function Day(): DayResult {
  function modifyInput(input: string[]) {
    let modifiedInput: string[] = []
    input.forEach((line) => {
      if (!line.startsWith('add')) {
        modifiedInput.push(line)
        return
      }
      let [op, value] = line.split(' ')
      if (!op.startsWith('addx')) throw `Invalid input: ${line}`
      modifiedInput.push(op, value)
    })

    return modifiedInput
  }

  async function solve1(input: string[]) {
    const cyclesToCheck = [20, 60, 100, 140, 180, 220]
    let valueX = 1
    let sum = 0
    modifyInput(input).forEach((op, index) => {
      const cycle = index + 1
      if (cyclesToCheck.includes(cycle)) {
        sum += cycle * valueX
        console.log(`Value of X during cycle ${cycle}=`, valueX, cycle * valueX)
      }
      if (op === 'noop' || op === 'addx') return
      valueX += Number.parseInt(op)
    })

    return sum
  }
  async function solve2(input: string[]) {
    let valueX = 1
    let printStr = ''
    console.log('')
    modifyInput(input).forEach((op, index) => {
      let cycle = index % 40
      printStr += NumberUtils.inRange(cycle, valueX - 1, valueX + 1) ? '#' : '.'
      if (cycle + 1 >= 40) {
        console.log(printStr)
        printStr = ''
      }
      if (op === 'noop' || op === 'addx') return
      valueX += Number.parseInt(op)
    })

    return 'see above'
  }

  return { solve1, solve2 }
}
