import { IPoint, Position } from '../../Models/Space/Position'

export class RopeNode extends Position {
  public follow(head: IPoint) {
    let path: IPoint[] = [this.toPoint()]
    let iterations = 0
    while (!this.isTouching(head)) {
      let pathVector = this.getDistanceVector(head).normalize()
      this.movePositionBy(pathVector)
      path.push(this.toPoint())
      iterations++
      if (iterations > 1000) throw 'too many iterations'
    }
    return path
  }
}
