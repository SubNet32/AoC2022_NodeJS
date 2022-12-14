import { FieldMap } from '../../Models/Space/FieldMap'
import { IPoint, Position } from '../../Models/Space/Position'
import SpaceUtils from '../../Utils/SpaceUtils'

export default class Sand {
  public position: Position
  private field: FieldMap<string>
  public maxY: number = 0
  private moveVectors: IPoint[] = [
    { x: 0, y: 1 },
    { x: -1, y: 1 },
    { x: 1, y: 1 },
  ]

  constructor(field: FieldMap<string>, startPoint: IPoint, maxY: number) {
    this.field = field
    this.maxY = maxY
    this.position = Position.FromPoint(startPoint)
  }

  public evaluate() {
    while (true)
      for (let i = 0; i < this.moveVectors.length; i++) {
        const mV = this.moveVectors[i]
        if (!this.isBlocked(mV)) {
          //Sand could move in any of the allowed directions
          this.field.deleteItem(this.position)
          this.position.movePositionBy(mV)
          this.field.addItem(this.position, 'o')
          if (this.position.y > this.maxY) {
            this.field.deleteItem(this.position)
            return false
          } //Sand fell of the end of the field
          break //restart with first movement
        }
        if (i === this.moveVectors.length - 1) return true //Sand came to rest
      }
  }

  private isBlocked(moveVector: IPoint) {
    return this.field.hasItem(SpaceUtils.addToPoint(this.position, moveVector))
  }
}
