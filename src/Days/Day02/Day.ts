import { DayResult } from '../../types'

enum Shape {
  rock = 1,
  paper = 2,
  scissors = 3,
}

export default function Day(): DayResult {
  async function solve1(input: string[]) {
    return input.reduce((sum, current) => {
      const shapes = getShapesFromInput(current)
      const score = determineWinnerScore(shapes.enemy, shapes.player) + shapes.player
      return sum + score
    }, 0)
  }

  async function solve2(input: string[]) {
    return input.reduce((sum, current) => {
      const shapes = getShapesFromInput2(current)
      const score = determineWinnerScore(shapes.enemy, shapes.player) + shapes.player
      return sum + score
    }, 0)
  }

  return { solve1, solve2 }
}

function evaluateShape(input: string) {
  if (input === 'A' || input === 'X') return Shape.rock
  if (input === 'B' || input === 'Y') return Shape.paper
  if (input === 'C' || input === 'Z') return Shape.scissors
}

function getShapesFromInput(input: string) {
  let terms = input.split(' ')
  return { enemy: evaluateShape(terms[0]), player: evaluateShape(terms[1]) }
}

function getShapesFromInput2(input: string) {
  let terms = input.split(' ')
  let enemy = evaluateShape(terms[0])
  return { enemy, player: getShapeByWinCondition(enemy, terms[1]) }
}

function getShapeByWinCondition(enemy: Shape, winCondition: string) {
  switch (winCondition) {
    case 'X':
      return enemy - 1 || 3 //lose
    case 'Y':
      return enemy //draw
    case 'Z':
      return enemy === 3 ? 1 : enemy + 1 //win
  }
}

function determineWinnerScore(enemy: Shape, player: Shape) {
  if (player - 1 === enemy || player + 2 === enemy) return 6
  if (enemy - 1 === player || enemy + 2 === player) return 0
  if (player === enemy) return 3
  throw `${player} vs ${enemy}`
  return 3
}
