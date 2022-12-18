import { SpaceMap } from '../../Models/Space/3D/SpaceMap'
import { IPoint3D } from '../../Models/Space/3D/types3D'
import Vector3 from '../../Models/Space/3D/Vector3'
import { DayResult } from '../../types'

export default function Day(): DayResult {
  const checkDirections = [Vector3.Left, Vector3.Right, Vector3.Forward, Vector3.Backward, Vector3.Up, Vector3.Down]

  function getSpaceMap(input: string[]) {
    let spaceMap = new SpaceMap<number>()
    input.forEach((line) => {
      spaceMap.addItem(Vector3.FromInput(line), 1)
    })
    return spaceMap
  }

  function getAdjacentPositionsWithValue(position: IPoint3D, spaceMap: SpaceMap<number>, value?: number, inverse?: boolean) {
    let adjacentPositions: Vector3[] = []
    checkDirections.forEach((direction) => {
      let checkPos = Vector3.Add(position, direction)
      let checkPosValue = spaceMap.getItem(checkPos)
      if (inverse) {
        if (!checkPosValue) adjacentPositions.push(checkPos)
      } else if ((!!value && checkPosValue === value) || (!value && !!checkPosValue)) {
        adjacentPositions.push(checkPos)
      }
    })
    return adjacentPositions
  }

  function getSurfacePositions(position: IPoint3D, spaceMap: SpaceMap<number>) {
    let surfacePositions: Vector3[] = []
    checkDirections.forEach((direction) => {
      let checkPos = Vector3.FromPoint(position)
      while (true) {
        checkPos.add(direction)
        if (spaceMap.getItem(checkPos)) {
          break
        }
        if (!spaceMap.isPointInsideBoundaries(checkPos)) {
          surfacePositions.push(Vector3.Add(position, direction))
          break
        }
      }
    })
    return surfacePositions
  }

  function fillSpace(fromPosition: Vector3, spaceMap: SpaceMap<number>) {
    spaceMap.addItem(fromPosition, 2)
    let positionsToCheck = getAdjacentPositionsWithValue(fromPosition, spaceMap, undefined, true).filter((pos) => spaceMap.isPointInsideBoundaries(pos))
    while (positionsToCheck.length > 0) {
      let newPositions: Vector3[] = []
      for (let pos of positionsToCheck) {
        spaceMap.addItem(pos, 2)
        let adjPositions = getAdjacentPositionsWithValue(pos, spaceMap, undefined, true).filter((pos) => spaceMap.isPointInsideBoundaries(pos))
        newPositions.push(...adjPositions.filter((adjP) => !newPositions.find((nP) => nP.isSamePosition(adjP))))
      }
      positionsToCheck = newPositions
    }
  }

  async function solve1(input: string[]) {
    let spaceMap = getSpaceMap(input)
    let positions = spaceMap.getAllPositionsWithValue()
    let sum = 0
    for (let position of positions) {
      let adjacentPositions = getAdjacentPositionsWithValue(position, spaceMap)
      sum += 6 - adjacentPositions.length
    }
    return sum
  }
  async function solve2(input: string[]) {
    let spaceMap = getSpaceMap(input)
    spaceMap.calcBoundaries()
    spaceMap.expandBoundariesBy(1)
    fillSpace(Vector3.FromPoint(spaceMap.boundaries.start), spaceMap)
    let positions = spaceMap.getAllPositionsWithValue(1)
    let sum = 0
    for (let position of positions) {
      let surfacePositions = getAdjacentPositionsWithValue(position, spaceMap, 2)
      sum += surfacePositions.length
    }
    return sum
  }

  return { solve1, solve2 }
}
