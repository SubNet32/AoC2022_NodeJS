import NumberUtils from '../../Utils/NumberUtils'
import Utils from '../../Utils/Utils'

export default class Operation {
  public a: number | null = null
  public b: number | null = null
  public operation: string

  constructor(a: number | null, b: number | null, operation: string) {
    this.a = a
    this.b = b
    this.operation = operation
  }

  public static FromInput(input: string) {
    const [t1, op, t2] = input.trim().split(' ')
    return new Operation(NumberUtils.isNumericString(t1) ? Number.parseFloat(t1) : null, NumberUtils.isNumericString(t2) ? Number.parseFloat(t2) : null, op)
  }

  public evaluate(value: number) {
    const t1 = !!this.a ? this.a : value
    const t2 = !!this.b ? this.b : value
    switch (this.operation) {
      case '+':
        return t1 + t2
      case '*':
        return t1 * t2
      default:
        throw `operation '${this.operation}' not implemented`
    }
  }
}
