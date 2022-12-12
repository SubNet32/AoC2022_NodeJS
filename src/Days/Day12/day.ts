import { FieldMap } from '../../Models/Space/FieldMap'
import PathFinder from '../../Models/Space/PathFinder'
import { DayResult } from '../../types'
import SpaceUtils from '../../Utils/SpaceUtils'

export default function Day(): DayResult {
  async function solve1(input: string[]) {
    const field = FieldMap.fromInput(input, (char) => {
      const charCode = char.charCodeAt(0)
      if (charCode >= 97) return charCode - 97
      if (charCode === 83) return -1
      if (charCode === 69) return -2
      throw `Invalid char ${char}`
    })
    const start = field.findItemWithValue(-1)
    field.addItem(start, 0)
    const end = field.findItemWithValue(-2)
    field.addItem(end, 25)

    let pathMap = PathFinder(
      field,
      start,
      (current, target) => {
        if (target.value > current.value + 1) return null
        return current.cost + 1
      },
      (current) => SpaceUtils.comparePoints(current.position, end)
    )
    let endNode = pathMap.find((p) => SpaceUtils.comparePoints(p.position, end))
    let pathToEndNode = endNode.getPath()
    pathToEndNode.forEach((p) => SpaceUtils.printPoint(p))
    return pathToEndNode.length - 1
  }

  async function solve2(input: string[]) {
    const field = FieldMap.fromInput(input, (char) => {
      const charCode = char.charCodeAt(0)
      if (charCode >= 97) return charCode - 97
      if (charCode === 83) return -1
      if (charCode === 69) return -2
      throw `Invalid char ${char}`
    })
    const start = field.findItemWithValue(-1)
    field.addItem(start, 0)
    const end = field.findItemWithValue(-2)
    field.addItem(end, 25)

    let pathMap = PathFinder(
      field,
      end,
      (current, target) => {
        if (target.value < current.value - 1) return null
        return current.cost + 1
      },
      (current) => current.value === 0
    )
    let nodesToCheck = pathMap.filter((m) => m.value === 0)
    let shortestPath: number | null = null
    nodesToCheck.forEach((n) => {
      let path = n.getPath().length - 1
      if (path === 0) return
      if (!shortestPath || path < shortestPath) shortestPath = path
    })
    return shortestPath
  }

  return { solve1, solve2 }
}
