import SpaceUtils from '../../Utils/SpaceUtils'
import { IPoint, IRectangle } from './Position'

export class FieldMap<T> {
  public map: Map<string, T>
  public boundaries: IRectangle

  constructor(boundaries: IRectangle, iterable?: Iterable<readonly [string, T]>) {
    this.boundaries = boundaries
    this.map = new Map<string, T>(iterable)
  }

  public addItem(point: IPoint, value: T) {
    this.map.set(SpaceUtils.pointToString(point), value)
  }

  public getItem(point: IPoint): T | undefined {
    return this.map.get(SpaceUtils.pointToString(point))
  }

  public static fromInput<TValue>(input: string[], valueProvider: (char: string, x: number, y: number) => TValue | undefined) {
    const inputMap = new FieldMap<TValue>({ start: { x: 0, y: 0 }, end: { x: input[0].length - 1, y: input.length - 1 } })
    input.forEach((line, y) => {
      Array.from(line).forEach((char, x) => {
        const value = valueProvider(char, x, y)
        if (value !== undefined && value !== null) inputMap.addItem({ x, y }, value)
      })
    })
    return inputMap
  }

  public findItemWithValue(value: T) {
    return SpaceUtils.stringToPoint(Array.from(this.map.keys()).find((key) => this.map.get(key) === value))
  }

  public print(valuePrinter?: (value: T) => string) {
    console.log([...this.map])
  }
}
