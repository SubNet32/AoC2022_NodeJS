import { IPoint } from '../Models/Space/Position'

const SpaceUtils = {
  pointToString(point: IPoint) {
    return `${point.x}|${point.y}`
  },
  stringToPoint(str: string): IPoint | null {
    if (!str) return null
    const [x, y] = str.split('|').map((q) => Number.parseInt(q))
    return { x, y }
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
}

export default SpaceUtils
