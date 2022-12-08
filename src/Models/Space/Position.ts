import SpaceUtils from '../../Utils/SpaceUtils'

export interface IPoint {
  x: number
  y: number
}

export interface IRectangle {
  start: IPoint
  end: IPoint
}

export class Position implements IPoint {
  public x: number
  public y: number

  public lowerLimit: IPoint = { x: 0, y: 0 }
  public upperLimit: IPoint | null = null
  public wrapAroundX: boolean = false
  public wrapAroundY: boolean = false

  constructor(x: number, y: number, upperLimit?: IPoint, lowerLimit?: IPoint) {
    this.x = x
    this.y = y
    this.upperLimit = upperLimit
    if (lowerLimit) this.lowerLimit = lowerLimit
  }

  public getPoint(): IPoint {
    return { x: this.x, y: this.y }
  }

  public movePositionBy(point: IPoint) {
    this.x = SpaceUtils.transform1DPoint(this.x, point.x, this.upperLimit ? { min: this.lowerLimit.x ?? 0, max: this.upperLimit.x, wrapAround: this.wrapAroundX } : undefined)
    this.y = SpaceUtils.transform1DPoint(this.y, point.y, this.upperLimit ? { min: this.lowerLimit.y ?? 0, max: this.upperLimit.y, wrapAround: this.wrapAroundY } : undefined)
    return this
  }

  public print(prefix?: string, suffix?: string) {
    SpaceUtils.printPoint(this.getPoint(), prefix, suffix)
  }

  public isAtBounds() {
    if (!this.upperLimit) throw 'unable to determine isAtBounds() since bounds are not defined'
    return this.x === this.lowerLimit.x || this.x === this.upperLimit.x || this.y === this.lowerLimit.y || this.y === this.upperLimit.y
  }

  public getMoveDistanceTo(point: IPoint) {
    return Math.abs(point.x - this.x) + Math.abs(point.y - this.y)
  }

  public getDistanceTo(point: IPoint) {
    return Math.sqrt(Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2))
  }
}
