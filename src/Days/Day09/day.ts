import { IPoint, Position } from '../../Models/Space/Position'
import Vector2 from '../../Models/Space/Vector2'
import { DayResult } from '../../types'
import SpaceUtils from '../../Utils/SpaceUtils'
import { RopeNode } from './RopeTail'

export default function Day(): DayResult {
  async function solve1(input: string[]) {
    const head = new Position(0, 0)
    const tail = new RopeNode(0, 0)
    const visitedPositions = new Set<string>()
    for (let line of input) {
      head.movePositionBy(Vector2.FromInput(line))
      const positions = tail.follow(head)
      positions.forEach((p) => visitedPositions.add(SpaceUtils.pointToString(p)))
    }

    return visitedPositions.size
  }
  async function solve2(input: string[]) {
    const head = new Position(0, 0)
    const nodes = [...Array(9).keys()].map((q) => new RopeNode(0, 0))
    const visitedPositions = new Set<string>()
    for (let line of input) {
      const moveVector = Vector2.FromInput(line)
      const moveDistance = moveVector.length()
      moveVector.normalize()
      for (let i = 0; i < moveDistance; i++) {
        head.movePositionBy(moveVector)
        nodes.forEach((node, index) => {
          if (index === 0) {
            node.follow(head)
            return
          }
          const positions = node.follow(nodes[index - 1])
          if (index < nodes.length - 1) return
          positions.forEach((p) => visitedPositions.add(SpaceUtils.pointToString(p)))
        })
      }
    }
    visitedPositions.forEach((vp) => console.log('Point: ', vp))
    return visitedPositions.size
  }

  return { solve1, solve2 }
}
