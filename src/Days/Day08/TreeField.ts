import { FieldMap } from '../../Models/Space/FieldMap'
import { IPoint, Position } from '../../Models/Space/Position'

const pathsToCheck: IPoint[] = [
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: -1 },
  { x: 0, y: 1 },
]

export class TreeField {
  public field: FieldMap<number>

  constructor(input: string[]) {
    this.field = FieldMap.fromInput(input, (char) => Number.parseInt(char))
  }

  public checkTreeVisible(point: IPoint) {
    const treeHight = this.field.getItem(point)
    for (let path of pathsToCheck) {
      const position = new Position(point.x, point.y, this.field.boundaries.end, this.field.boundaries.start)
      while (true) {
        position.movePositionBy(path)
        if (this.field.getItem(position) >= treeHight) break
        if (position.isAtBounds()) return true
      }
    }
    return false
  }

  public getViewDistance(point: IPoint) {
    const treeHight = this.field.getItem(point)
    let viewDistance = 1
    for (let path of pathsToCheck) {
      const position = new Position(point.x, point.y, this.field.boundaries.end, this.field.boundaries.start)
      if (position.isAtBounds()) continue
      while (true) {
        position.movePositionBy(path)
        if (this.field.getItem(position) >= treeHight || position.isAtBounds()) {
          viewDistance *= position.getDistanceTo(point)
          break
        }
      }
    }
    return viewDistance
  }
}
