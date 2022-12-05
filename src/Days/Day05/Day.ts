import { DayResult } from '../../types'

type Stack = { boxes: string[] }

export default function Day(): DayResult {
  function getStack(input: string[]) {
    let stack: Stack[] = []
    let startPoint = input.findIndex((i) => !i)
    for (let i = startPoint - 2; i >= 0; i--) {
      let terms = (input[i] + ' ').match(/.{4}/g).map((m) => m.replace(/[\[\]\s]/g, ''))
      console.log(terms)
      terms.forEach((term, index) => {
        if (!term) return
        if (index >= stack.length) stack.push({ boxes: [term] })
        else stack[index].boxes.push(term)
      })
    }
    // console.log('Stacks')
    // stack.forEach((s) => console.log(s.boxes.join(', ')))
    return stack
  }

  function getLineOperation(line: string) {
    const [_dummy1, amount, _dummy2, from, _dummy3, to] = line.split(' ')
    return { amount: Number(amount), from: Number(from) - 1, to: Number(to) - 1 }
  }

  function modifyStack(stack: Stack[], line: string) {
    const op = getLineOperation(line)
    for (let c = 0; c < op.amount; c++) {
      stack[op.to].boxes.push(stack[op.from].boxes.pop())
    }
  }

  function modifyStackPart2(stack: Stack[], line: string) {
    const op = getLineOperation(line)
    stack[op.to].boxes.push(...stack[op.from].boxes.slice(stack[op.from].boxes.length - op.amount))
    stack[op.from].boxes.length = stack[op.from].boxes.length - op.amount
  }

  function printStack(stack: Stack[]) {
    stack.forEach((s) => console.log(s.boxes.join(', ')))
  }

  async function solve1(input: string[]) {
    let stack = getStack(input)
    printStack(stack)
    let startPoint = input.findIndex((i) => !i) + 1
    for (let i = startPoint; i < input.length; i++) {
      modifyStack(stack, input[i])
      console.log('Stack after ', input[i])
      printStack(stack)
    }

    return stack.map((s) => s.boxes.pop()).join('')
  }

  async function solve2(input: string[]) {
    let stack = getStack(input)
    printStack(stack)
    let startPoint = input.findIndex((i) => !i) + 1
    for (let i = startPoint; i < input.length; i++) {
      modifyStackPart2(stack, input[i])
      console.log('Stack after ', input[i])
      printStack(stack)
    }

    return stack.map((s) => s.boxes.pop()).join('')
  }

  return { solve1, solve2 }
}
