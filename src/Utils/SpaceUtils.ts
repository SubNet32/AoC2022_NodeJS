import { ICube, IPoint3D } from '../Models/Space/3D/types3D'
import { IPoint, IRectangle } from '../Models/Space/Position'

const SpaceUtils = {
  pointToString(point: IPoint) {
    return `${point.x}|${point.y}`
  },
  point3DToString(point: IPoint3D) {
    return `${point.x}|${point.y}|${point.z}`
  },
  stringToPoint(str: string): IPoint | null {
    if (!str) return null
    const [x, y] = str.split('|').map((q) => Number.parseInt(q))
    return { x, y }
  },
  stringToPoint3D(str: string): IPoint3D | null {
    if (!str) return null
    const [x, y, z] = str.split('|').map((q) => Number.parseInt(q))
    return { x, y, z }
  },
  transform1DPoint(p: number, add: number, options?: { min: number; max: number; wrapAround?: boolean; limit?: boolean }) {
    let newP = p + add
    if (!options) return newP
    if (options.limit) {
      newP = Math.max(Math.min(newP, options.max), options.min)
    } else if (options.wrapAround) {
      const range = options.max - options.min + 1
      if (newP > options.max) newP -= range
      if (newP < options.min) newP += range
    }
    return newP
  },
  printPoint(point: IPoint, prefix?: string, suffix?: string) {
    console.log(`${prefix ?? 'Pos:'} [${point.x},${point.y}] ${suffix ?? ''}`)
  },
  comparePoints(a: IPoint, b: IPoint) {
    return a.x === b.x && a.y === b.y
  },
  pointsAreAdjacent(a: IPoint, b: IPoint) {
    return (a.x === b.x && (a.y === b.y + 1 || a.y === b.y - 1)) || (a.y === b.y && (a.x === b.x + 1 || a.x === b.x - 1))
  },
  addToPoint(point: IPoint, add: IPoint) {
    return { x: point.x + add.x, y: point.y + add.y }
  },
  getLimitsOfPoints(points: IPoint[]): IRectangle {
    let minX = Math.min(...points.map((p) => p.x))
    let minY = Math.min(...points.map((p) => p.y))
    let maxX = Math.max(...points.map((p) => p.x))
    let maxY = Math.max(...points.map((p) => p.y))
    return { start: { x: minX, y: minY }, end: { x: maxX, y: maxY } }
  },
  getLimitsOfPoints3D(points: IPoint3D[]): ICube {
    let minX = Math.min(...points.map((p) => p.x))
    let minY = Math.min(...points.map((p) => p.y))
    let minZ = Math.min(...points.map((p) => p.z))
    let maxX = Math.max(...points.map((p) => p.x))
    let maxY = Math.max(...points.map((p) => p.y))
    let maxZ = Math.max(...points.map((p) => p.z))
    return { start: { x: minX, y: minY, z: minZ }, end: { x: maxX, y: maxY, z: maxZ } }
  },
  movementToPrintString(movement: IPoint) {
    if (movement.y === 0) {
      if (movement.x > 0) return 'Right'
      if (movement.x < 0) return 'Left'
    }
    if (movement.y > 0) return 'Up'
    if (movement.y < 0) return 'Down'
    return 'None'
  },
}

export default SpaceUtils
