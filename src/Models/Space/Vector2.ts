import { IPoint } from './Position'

export default class Vector2 implements IPoint {
  public x: number
  public y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  public static FromPoint = (point: IPoint) => new Vector2(point.x, point.y)
  public static FromInput(input: string) {
    const [direction, amount] = input.split(' ')
    switch (direction) {
      case 'R':
        return Vector2.Right(Number(amount))
      case 'L':
        return Vector2.Left(Number(amount))
      case 'U':
        return Vector2.Up(Number(amount))
      case 'D':
        return Vector2.Down(Number(amount))
      default:
        throw `Vector2.FromInput: Invalid input ${input}`
    }
  }
  public static Left = (amount?: number) => new Vector2(-(amount ?? 1), 0)
  public static Right = (amount?: number) => new Vector2(amount ?? 1, 0)
  public static Up = (amount?: number) => new Vector2(0, amount ?? 1)
  public static Down = (amount?: number) => new Vector2(0, -(amount ?? 1))

  public add(vector: IPoint) {
    this.x += vector.x
    this.y += vector.y
    return this
  }

  public subtract(vector: IPoint) {
    this.x -= vector.x
    this.y -= vector.y
    return this
  }

  public normalize() {
    this.x = Math.sign(this.x)
    this.y = Math.sign(this.y)
    return this
  }

  public length() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
  }
}