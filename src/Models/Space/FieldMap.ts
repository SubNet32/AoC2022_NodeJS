import SpaceUtils from '../../Utils/SpaceUtils'
import { IPoint, IRectangle, Position } from './Position'

export class FieldMap<T> {
  public map: Map<string, T>
  public boundaries: IRectangle | undefined

  constructor(boundaries?: IRectangle, iterable?: Iterable<readonly [string, T]>) {
    this.boundaries = boundaries
    this.map = new Map<string, T>(iterable)
  }

  public addItem(point: IPoint, value: T) {
    this.map.set(SpaceUtils.pointToString(point), value)
  }

  public addLine(startPoint: IPoint, endPoint: IPoint, value: T) {
    let current = new Position(startPoint.x, startPoint.y)
    this.addItem(current, value)
    let moveVector = current.getDistanceVector(endPoint).normalize()
    while (!SpaceUtils.comparePoints(current, endPoint)) {
      current.movePositionBy(moveVector)
      this.addItem(current, value)
    }
  }

  public getItem(point: IPoint): T | undefined {
    return this.map.get(SpaceUtils.pointToString(point))
  }

  public hasItem(point: IPoint) {
    return this.map.has(SpaceUtils.pointToString(point))
  }

  public deleteItem(point: IPoint) {
    this.map.delete(SpaceUtils.pointToString(point))
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

  public printField(valuePrinter?: (value: T | null) => string, inverseY?: boolean, window?: IRectangle) {
    let bounds = this.calcBounds()
    let printStrings: string[] = []
    let yBounds = { start: bounds.start.y, end: bounds.end.y }
    let xBounds = { start: bounds.start.x, end: bounds.end.x }
    if (window) {
      yBounds = { start: window.start.y, end: window.end.y }
      xBounds = { start: window.start.x, end: window.end.x }
    }
    for (let y = yBounds.start; y <= yBounds.end; y++) {
      let printsString = ''
      for (let x = xBounds.start; x <= xBounds.end; x++) {
        printsString += valuePrinter(this.getItem({ x, y }))
      }
      printStrings.push(printsString)
    }
    if (inverseY) {
      printStrings.reverse()
    }
    printStrings.forEach((p) => console.log(p))
    console.log('')
  }

  public getMaximum() {
    let max: IPoint = { x: 0, y: 0 }
    Array.from(this.map.keys()).forEach((key) => {
      let point = SpaceUtils.stringToPoint(key)
      if (point.x > max.x) max.x = point.x
      if (point.y > max.y) max.y = point.y
    })
    return max
  }

  public calcBounds(overwriteBounds?: boolean): IRectangle {
    let bounds = SpaceUtils.getLimitsOfPoints(Array.from(this.map.keys()).map((k) => SpaceUtils.stringToPoint(k)))
    if (overwriteBounds) {
      this.boundaries = bounds
      return this.boundaries
    }
    return bounds
  }

  public isInBounds(point: IPoint) {
    return !(point.x > this.boundaries.end.x || point.x < this.boundaries.start.x || point.y > this.boundaries.end.y || point.y < this.boundaries.start.y)
  }
}
