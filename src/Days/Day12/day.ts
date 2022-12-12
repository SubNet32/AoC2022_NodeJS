import { FieldMap } from '../../Models/Space/FieldMap'
import PathFinder, { CreatePathFieldMapFromInput } from '../../Models/Space/PathFinder'
import { DayResult } from '../../types'
import SpaceUtils from '../../Utils/SpaceUtils'

export default function Day(): DayResult {
  function getHeightValue(char: string) {
    const charCode = char.charCodeAt(0)
    if (charCode >= 97) return charCode - 97
    if (charCode === 83) return 0
    if (charCode === 69) return 25
  }

  async function solve1(input: string[]) {
    const field = CreatePathFieldMapFromInput(input, (char) => char)
    const start = Array.from(field.map.values()).find((v) => v.value === 'S')
    start.cost = 0
    start.isStart = true

    PathFinder(
      field,
      start,
      (current, target) => {
        if (getHeightValue(target.value) > getHeightValue(current.value) + 1) return null
        return current.cost + 1
      },
      (current) => current.value === 'E'
    )
    const end = Array.from(field.map.values()).find((v) => v.value === 'E')
    let pathToEndNode = end.getPath()
    pathToEndNode.forEach((p) => SpaceUtils.printPoint(p))
    return pathToEndNode.length - 1
  }

  async function solve2(input: string[]) {
    const field = CreatePathFieldMapFromInput(input, (char) => char)
    const start = Array.from(field.map.values()).find((v) => v.value === 'E')
    start.isStart = true
    start.cost = 0

    let endNode = PathFinder(
      field,
      start,
      (current, target) => {
        if (getHeightValue(target.value) >= getHeightValue(current.value) - 1) return current.cost + 1
        return null
      },
      (current) => getHeightValue(current.value) === 0
    )
    let pathToEndNode = endNode.getPath()
    pathToEndNode.forEach((p) => SpaceUtils.printPoint(p))
    return pathToEndNode.length - 1
  }

  return { solve1, solve2 }
}
