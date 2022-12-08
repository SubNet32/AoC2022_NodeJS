import { FieldMap } from '../../Models/Space/FieldMap'
import { IPoint, Position } from '../../Models/Space/Position'

const pathsToCheck: IPoint[] = [
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: -1 },
  { x: 0, y: 1 },
]

export class TreeField extends FieldMap<number> {
  public static treeFieldFromInput(input: string[]): TreeField {
    let field = FieldMap.fromInput<number>(input, (char) => Number.parseInt(char))
    let treeField = new TreeField(field.boundaries, field.map)
    return treeField
  }

  public checkTreeVisible(point: IPoint) {
    const treeHight = this.getItem(point)
    for (let path of pathsToCheck) {
      const position = new Position(point.x, point.y, this.boundaries.end, this.boundaries.start)
      while (true) {
        position.movePositionBy(path)
        if (this.getItem(position) >= treeHight) break
        if (position.isAtBounds()) return true
      }
    }
    return false
  }

  public getViewDistance(point: IPoint) {
    const treeHight = this.getItem(point)
    let viewDistance = 1
    for (let path of pathsToCheck) {
      const position = new Position(point.x, point.y, this.boundaries.end, this.boundaries.start)
      if (position.isAtBounds()) continue
      while (true) {
        position.movePositionBy(path)
        if (this.getItem(position) >= treeHight || position.isAtBounds()) {
          viewDistance *= position.getDistanceTo(point)
          break
        }
      }
    }
    return viewDistance
  }
}
