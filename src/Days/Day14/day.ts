import { FieldMap } from '../../Models/Space/FieldMap'
import { IPoint } from '../../Models/Space/Position'
import { DayResult } from '../../types'
import SpaceUtils from '../../Utils/SpaceUtils'
import Sand from './Sand'

export default function Day(): DayResult {
  function getField(input: string[]) {
    let field = new FieldMap<string>()
    for (let line of input) {
      let points = line.split(' -> ').map((q) => {
        let [x, y] = q.split(',').map((p) => Number.parseInt(p))
        return { x, y } as IPoint
      })
      for (let i = 0; i < points.length - 1; i++) {
        field.addLine(points[i], points[i + 1], '#')
      }
    }
    return field
  }

  async function solve1(input: string[]) {
    let field = getField(input)
    const sandDropPos: IPoint = { x: 500, y: 0 }
    const maxY = field.getMaximum()
    let sum = 0

    while (true) {
      const sand = new Sand(field, sandDropPos, maxY.y)
      if (!sand.evaluate()) break
      sum++
    }

    return sum
  }
  async function solve2(input: string[]) {
    let field = getField(input)
    const sandDropPos: IPoint = { x: 500, y: 0 }
    let maxY = field.getMaximum()
    field.addLine({ x: -1000, y: maxY.y + 2 }, { x: 1000, y: maxY.y + 2 }, '#')
    let sum = 0

    while (true) {
      const sand = new Sand(field, sandDropPos, maxY.y + 2)
      if (!sand.evaluate()) throw `Error: This should not happen`
      sum++
      if (SpaceUtils.comparePoints(sand.position, sandDropPos)) break
    }

    return sum
  }

  return { solve1, solve2 }
}
