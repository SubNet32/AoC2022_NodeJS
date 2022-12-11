import Operation from './Operation'

export default class Monkey {
  public index: number = 0
  public items: number[] = []
  public operation: Operation
  public divisor: number = 1
  public test: number = 1
  public targetIfTestTrueIndex: number
  public targetIfTestTrue: Monkey | null = null
  public targetIfTestFalseIndex: number
  public targetIfTestFalse: Monkey | null = null
  public mod: number = 0

  public itemCounter = 0

  constructor(input: string[], divisor: number) {
    this.index = Number.parseInt(input[0].replace('Monkey ', '').replace(':', ''))
    this.items = input[1]
      .replace('Starting items: ', '')
      .split(',')
      .map((i) => Number.parseInt(i))
    this.operation = Operation.FromInput(input[2].replace('Operation: new = ', ''))
    this.divisor = divisor
    this.test = Number.parseInt(input[3].replace('Test: divisible by ', ''))
    this.targetIfTestTrueIndex = Number.parseInt(input[4].replace('If true: throw to monkey ', ''))
    this.targetIfTestFalseIndex = Number.parseInt(input[5].replace('If false: throw to monkey ', ''))
  }

  public assignTargets(monkeys: Monkey[]) {
    this.targetIfTestTrue = monkeys.find((m) => m.index === this.targetIfTestTrueIndex)
    this.targetIfTestFalse = monkeys.find((m) => m.index === this.targetIfTestFalseIndex)
  }

  public addItem(item: number) {
    this.items.push(item)
  }

  public throwItems() {
    for (let item of this.items) {
      const newItem = Math.floor(this.operation.evaluate(item) / this.divisor) % this.mod
      if (newItem % this.test === 0) {
        this.targetIfTestTrue.addItem(newItem)
      } else {
        this.targetIfTestFalse.addItem(newItem)
      }
    }
    this.itemCounter += this.items.length
    this.items = []
  }

  public printItems() {
    console.log(`Monkey ${this.index}: (${this.itemCounter}) ${this.items.join(', ')}`)
  }
}
