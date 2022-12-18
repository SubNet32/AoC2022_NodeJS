import NumberUtils from '../../../Utils/NumberUtils'
import SpaceUtils from '../../../Utils/SpaceUtils'
import { ICube, IPoint3D } from './types3D'
import Vector3 from './Vector3'

export class SpaceMap<T> {
  public map: Map<string, T>
  public boundaries: ICube

  constructor(boundaries?: ICube, iterable?: Iterable<readonly [string, T]>) {
    this.boundaries = boundaries
    this.map = new Map<string, T>(iterable)
  }

  public addItem(point: IPoint3D, value: T) {
    this.map.set(SpaceUtils.point3DToString(point), value)
  }

  public getItem(point: IPoint3D): T | undefined {
    return this.map.get(SpaceUtils.point3DToString(point))
  }

  public hasItem(point: IPoint3D) {
    return this.map.has(SpaceUtils.point3DToString(point))
  }

  public deleteItem(point: IPoint3D) {
    this.map.delete(SpaceUtils.point3DToString(point))
  }

  public findItemWithValue(value: T) {
    return SpaceUtils.stringToPoint3D(Array.from(this.map.keys()).find((key) => this.map.get(key) === value))
  }

  public getAllPositionsWithValue(value?: T) {
    let positions: IPoint3D[] = []
    Array.from(this.map.keys()).forEach((key) => {
      let pos = SpaceUtils.stringToPoint3D(key)
      if (value === undefined || this.getItem(pos) === value) {
        positions.push(pos)
      }
    })
    return positions
  }

  public getBoundaries() {
    return SpaceUtils.getLimitsOfPoints3D(this.getAllPositionsWithValue())
  }

  public calcBoundaries() {
    this.boundaries = this.getBoundaries()
    return this.boundaries
  }

  public expandBoundariesBy(value: number) {
    this.boundaries.start.x -= value
    this.boundaries.start.y -= value
    this.boundaries.start.z -= value
    this.boundaries.end.x += value
    this.boundaries.end.y += value
    this.boundaries.end.z += value
  }

  public isPointInsideBoundaries(point: IPoint3D) {
    if (!this.boundaries) this.calcBoundaries()
    return (
      NumberUtils.inRange(point.x, this.boundaries.start.x, this.boundaries.end.x) &&
      NumberUtils.inRange(point.y, this.boundaries.start.y, this.boundaries.end.y) &&
      NumberUtils.inRange(point.z, this.boundaries.start.z, this.boundaries.end.z)
    )
  }
}
