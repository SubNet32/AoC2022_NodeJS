import { FieldMap } from '../../Models/Space/FieldMap'
import { IPoint } from '../../Models/Space/Position'
import { DayResult } from '../../types'
import SpaceUtils from '../../Utils/SpaceUtils'
import Utils from '../../Utils/Utils'
import { Shape } from './Shape'

export default function Day(): DayResult {
  function getModifier(input: string[]) {
    return Array.from(input.join('')).map<IPoint>((c) => ({ x: c === '>' ? 1 : -1, y: 0 }))
  }

  function getShapes() {
    let shapes: Shape[] = []
    shapes.push(Shape.FromInput(['C###'])) //horizontal line
    shapes.push(Shape.FromInput(['.#.', '###', 'c#.'])) //cross
    shapes.push(Shape.FromInput(['..#', '..#', 'C##'])) //inverse L
    shapes.push(Shape.FromInput(['#', '#', '#', 'C'])) //vertical line
    shapes.push(Shape.FromInput(['##', 'C#'])) //cube
    return shapes
  }

  function checkAndMoveShape(shape: Shape, field: FieldMap<string>, movement: IPoint) {
    if (shape.canMove(field, movement)) {
      shape.move(movement)
      //printField(shape, field, movement)
      return true
    }
    //printField(shape, field, movement)
    return false
  }

  function printField(shape: Shape, field: FieldMap<string>, movement: IPoint) {
    shape.printShapeToField(field, '@')
    console.log(`Printing Field. Moving ${SpaceUtils.movementToPrintString(movement)} \n`)
    field.printField((char) => char || '.', true)
    shape.removeShapeFromField(field)
  }

  async function solve1(input: string[]) {
    let modifier = getModifier(input)
    let shapes = getShapes()
    let field = new FieldMap<string>({ start: { x: 0, y: 0 }, end: { x: 6, y: 1e100 } })
    Shape.FromInput(['C######']).printShapeToField(field)
    let towerHight = 0
    let index = 0
    while (index < 2022) {
      let shape = Shape.FromShape(Utils.rotateArray(shapes), { x: 2, y: towerHight + 4 })
      //printField(shape, field, { x: 0, y: 0 })
      while (true) {
        let horizontalMovement = Utils.rotateArray(modifier)
        checkAndMoveShape(shape, field, horizontalMovement)
        if (!checkAndMoveShape(shape, field, { x: 0, y: -1 })) {
          shape.printShapeToField(field, '#')
          //field.printField((char) => char || '.', true)
          towerHight = Math.max(towerHight, shape.getLimits().end.y)
          break
        }
      }
      index++
    }
    //field.printField((char) => char || '.', true)
    return towerHight
  }
  async function solve2(input: string[]) {
    let modifier = getModifier(input)
    let shapes = getShapes()
    let field = new FieldMap<string>({ start: { x: 0, y: 0 }, end: { x: 6, y: 1e100 } })
    Shape.FromInput(['C######']).printShapeToField(field)
    let towerHight = 0
    let index = 0
    let skippedTowerHight = 0
    let rotCounter = 0
    let fistRotHight = 0
    let firstRotIndex = 0
    const numberOfBlocks = 1000000000000
    while (index < numberOfBlocks) {
      let shape = Shape.FromShape(Utils.rotateArray(shapes), { x: 2, y: towerHight + 4 })
      //printField(shape, field, { x: 0, y: 0 })
      while (true) {
        let horizontalMovement = Utils.rotateArray(modifier)
        rotCounter++
        if (rotCounter >= modifier.length) {
          rotCounter = 0
          if (!fistRotHight) {
            fistRotHight = towerHight
            firstRotIndex = index
          } else {
            let indexDiff = index - firstRotIndex
            let hightDiff = towerHight - fistRotHight
            let multiplier = Math.floor((numberOfBlocks - index) / indexDiff)
            index += multiplier * indexDiff
            skippedTowerHight = multiplier * hightDiff
          }
        }
        checkAndMoveShape(shape, field, horizontalMovement)
        if (!checkAndMoveShape(shape, field, { x: 0, y: -1 })) {
          shape.printShapeToField(field, '#')
          //field.printField((char) => char || '.', true)
          towerHight = Math.max(towerHight, shape.getLimits().end.y)
          break
        }
      }
      index++
    }
    //field.printField((char) => char || '.', true)
    return towerHight + skippedTowerHight
  }

  return { solve1, solve2 }
}
