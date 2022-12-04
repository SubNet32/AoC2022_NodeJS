import { NumberRange } from '../../Models/Numerical/Range'
import { DayResult } from '../../types'

export default function Day(): DayResult {
  function inputToSections(input: string[]) {
    let sections: SectionPair[] = []
    input.forEach((line) => {
      let [r1, r2] = line.split(',').map((i) => NumberRange.fromString(i))
      sections.push([r1, r2])
    })
    return sections
  }

  async function solve1(input: string[]) {
    let sections = inputToSections(input)

    return sections.reduce((sum, section) => sum + Number(section[0].contains(section[1]) || section[1].contains(section[0])), 0)
  }
  async function solve2(input: string[]) {
    let sections = inputToSections(input)
    return sections.reduce((sum, section) => sum + Number(section[0].overlaps(section[1])), 0)
  }

  return { solve1, solve2 }
}

type SectionPair = [NumberRange, NumberRange]
