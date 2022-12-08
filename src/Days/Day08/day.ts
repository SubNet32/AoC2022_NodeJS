import { Position } from '../../Models/Space/Position'
import { DayResult } from '../../types'
import { TreeField } from './TreeField'

export default function Day(): DayResult {
  async function solve1(input: string[]) {
    const treeField = new TreeField(input)
    let sum = 0
    for (let y = 1; y < treeField.field.boundaries.end.y; y++) {
      for (let x = 1; x < treeField.field.boundaries.end.x; x++) {
        const pos = new Position(x, y)
        const treeIsVisible = treeField.checkTreeVisible(pos)
        pos.print('tree', `${treeField.field.getItem(pos)} is ${treeIsVisible ? 'visible' : 'is not visible'}`)
        sum += Number(treeIsVisible)
      }
    }

    return sum + treeField.field.boundaries.end.x * 2 + treeField.field.boundaries.end.y * 2
  }
  async function solve2(input: string[]) {
    const treeField = new TreeField(input)
    let maxViewDist = 0
    for (let y = 0; y <= treeField.field.boundaries.end.y; y++) {
      for (let x = 0; x <= treeField.field.boundaries.end.x; x++) {
        let viewDist = treeField.getViewDistance({ x, y })
        if (viewDist > maxViewDist) {
          maxViewDist = viewDist
        }
      }
    }
    return maxViewDist
  }

  return { solve1, solve2 }
}
