import { FieldMap } from '../../Models/Space/FieldMap'
import { Position } from '../../Models/Space/Position'
import Vector2 from '../../Models/Space/Vector2'
import { DayResult } from '../../types'
import SpaceUtils from '../../Utils/SpaceUtils'
import { Sensor } from './Sensor'

export default function Day(): DayResult {
  function evaluateInput(input: string[]) {
    let sensors: Sensor[] = []
    let lowestX = 0
    let highestX = 0
    for (let line of input) {
      let [sx, sy, bx, by] = line
        .replace('Sensor at x=', '')
        .replace(': closest beacon is at x=', ' ')
        .replace(/,/g, '')
        .replace(/y=/g, '')
        .split(' ')
        .map((q) => Number.parseInt(q))
      let sensor = new Sensor(sx, sy, bx, by)
      sensors.push(sensor)
      lowestX = Math.min(lowestX, sx - sensor.distanceToBeacon)
      highestX = Math.max(highestX, sx + sensor.distanceToBeacon)
    }
    return { sensors, lowestX, highestX }
  }

  async function solve1(input: string[]) {
    let { sensors, lowestX, highestX } = evaluateInput(input)
    let position = new Position(lowestX, 2000000)
    let moveVector = Vector2.Right()
    let sum = 0
    while (position.x <= highestX) {
      for (let sensor of sensors) {
        if (sensor.isInSensorRange(position)) {
          if (!sensor.beaconPosition.isSamePosition(position)) {
            sum++
            break
          }
        }
      }
      position.movePositionBy(moveVector)
    }

    return sum
  }
  async function solve2(input: string[]) {
    let { sensors } = evaluateInput(input)
    let position = new Position(0, 0)
    let maxX = 4000000
    let maxY = 4000000
    for (let y = 0; y <= maxY; y++) {
      position.y = y
      position.x = 0
      while (position.x <= maxX) {
        let inSensorRange = false
        for (let sensor of sensors) {
          if (sensor.isInSensorRange(position)) {
            position.x = sensor.getFirstXOutOfRangeOnY(position.y)
            inSensorRange = true
            break
          }
        }
        if (!inSensorRange) return position.x * 4000000 + position.y
      }
    }
  }

  return { solve1, solve2 }
}
