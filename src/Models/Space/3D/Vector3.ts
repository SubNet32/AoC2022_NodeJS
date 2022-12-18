import { IPoint3D } from './types3D'

export default class Vector3 implements IPoint3D {
  public x: number //left & right
  public y: number //forward & backward
  public z: number //up & down

  constructor(x: number, y: number, z: number) {
    this.x = x
    this.y = y
    this.z = z
  }

  public static FromPoint = (point: IPoint3D) => new Vector3(point.x, point.y, point.z)
  public static FromInput(input: string) {
    const [x, y, z] = input.split(',').map((i) => Number.parseInt(i))
    return new Vector3(x, y, z)
  }
  public static Right = new Vector3(1, 0, 0)
  public static Left = new Vector3(-1, 0, 0)
  public static Forward = new Vector3(0, 1, 0)
  public static Backward = new Vector3(0, -1, 0)
  public static Up = new Vector3(0, 0, 1)
  public static Down = new Vector3(0, 0, -1)

  public add(vector: IPoint3D) {
    this.x += vector.x
    this.y += vector.y
    this.z += vector.z
    return this
  }

  public static Add(vectorA: IPoint3D, vectorB: IPoint3D) {
    return new Vector3(vectorA.x + vectorB.x, vectorA.y + vectorB.y, vectorA.z + vectorB.z)
  }

  public subtract(vector: IPoint3D) {
    this.x -= vector.x
    this.y -= vector.y
    this.z -= vector.z
    return this
  }

  public normalize() {
    this.x = Math.sign(this.x)
    this.y = Math.sign(this.y)
    this.z = Math.sign(this.z)
    return this
  }

  public length() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2))
  }

  public lineDistanceTo(vector: IPoint3D) {
    return Math.abs(this.x - vector.x) + Math.abs(this.y - vector.y) + Math.abs(this.z - vector.z)
  }

  public isSamePosition(point: IPoint3D) {
    return this.x === point.x && this.y === point.y && this.z === point.z
  }
}
