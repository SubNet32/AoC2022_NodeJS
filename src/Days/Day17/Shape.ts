import { FieldMap } from '../../Models/Space/FieldMap'
import { IPoint, IRectangle } from '../../Models/Space/Position'
import Vector2 from '../../Models/Space/Vector2'
import SpaceUtils from '../../Utils/SpaceUtils'

export class Shape {
  public points: IPoint[] = []
  public position: Vector2

  constructor(points: IPoint[], center: IPoint) {
    this.points = points
    this.position = new Vector2(center.x, center.y)
  }

  public static FromInput(input: string[], offset?: IPoint) {
    let center: Vector2 | null = null
    let points: IPoint[] = []
    input.reverse()
    for (let y = 0; y < input.length; y++) {
      let line = input[y]
      for (let x = 0; x < line.length; x++) {
        if (line[x] !== '.' && line[x] !== 'c') points.push({ x, y })
        if (line[x] === 'C' || line[x] === 'c') center = new Vector2(x, y)
      }
    }
    points.forEach((p) => {
      p.x -= center.x
      p.y -= center.y
    })
    return new Shape(points, center.add(offset ?? { x: 0, y: 0 }))
  }

  public static FromShape(shape: Shape, offset: IPoint) {
    return new Shape([...shape.points], Vector2.Add(shape.position, offset))
  }

  public canMove(field: FieldMap<any>, movement: IPoint) {
    for (let point of this.points) {
      let pointPos = Vector2.Add(Vector2.Add(point, this.position), movement)
      if (!field.isInBounds(pointPos)) return false
      if (field.hasItem(pointPos)) return false
    }
    return true
  }

  public move(movement: IPoint) {
    this.position.add(movement)
    return this
  }

  public printShapeToField(field: FieldMap<string>, printChar?: string) {
    for (let point of this.points) {
      let pointPos = Vector2.Add(point, this.position)
      field.addItem(pointPos, printChar ?? '#')
    }
  }

  public removeShapeFromField(field: FieldMap<string>) {
    for (let point of this.points) {
      let pointPos = Vector2.Add(point, this.position)
      field.deleteItem(pointPos)
    }
  }

  public getLimits() {
    return SpaceUtils.getLimitsOfPoints(this.points.map((p) => Vector2.Add(p, this.position)))
  }
}
