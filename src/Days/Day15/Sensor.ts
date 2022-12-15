import { IPoint } from '../../Models/Space/Position'
import Vector2 from '../../Models/Space/Vector2'

export class Sensor {
  public position: Vector2
  public beaconPosition: Vector2
  public distanceToBeacon: number = 0

  constructor(sx: number, sy: number, bx: number, by: number) {
    this.position = new Vector2(sx, sy)
    this.beaconPosition = new Vector2(bx, by)
    this.distanceToBeacon = this.position.lineDistanceTo(this.beaconPosition)
  }

  public isInSensorRange(point: IPoint) {
    return this.position.lineDistanceTo(point) <= this.distanceToBeacon
  }

  public getFirstXOutOfRangeOnY(y: number) {
    let distY = Math.abs(this.position.y - y)
    return this.position.x + (this.distanceToBeacon - distY) + 1
  }
}
