import NumberUtils from '../../Utils/NumberUtils'

export interface INumberRange {
  begin: number
  end: number
}

export class NumberRange implements INumberRange {
  public begin: number
  public end: number

  constructor(begin: number, end: number) {
    this.begin = Math.min(begin, end)
    this.end = Math.max(begin, end)
  }

  public static fromString(input: string) {
    let [begin, end] = input.split('-').map((i) => Number.parseInt(i))
    return new NumberRange(begin, end)
  }

  public print(prefix?: string) {
    console.log(prefix ?? 'Range:', `[${this.begin} - ${this.end}]`)
  }

  public overlaps(range: INumberRange) {
    return (
      NumberUtils.inRange(range.begin, this.begin, this.end) ||
      NumberUtils.inRange(range.end, this.begin, this.end) ||
      NumberUtils.inRange(this.begin, range.begin, range.end) ||
      NumberUtils.inRange(this.end, range.begin, range.end)
    )
  }

  public contains(range: INumberRange) {
    return NumberUtils.inRange(range.begin, this.begin, this.end) && NumberUtils.inRange(range.end, this.begin, this.end)
  }
}
