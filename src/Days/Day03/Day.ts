import { DayResult } from '../../types'

export default function Day(): DayResult {
  async function solve1(input: string[]) {
    let sum = 0
    for (let line of input) {
      const map = new Backpack()
      for (let i = 0; i < line.length / 2; i++) {
        const char1 = line[i]
        if (map.feedCharToSpace1(char1)) {
          sum += getCharValue(char1)
          break
        }
        const char2 = line[i + line.length / 2]
        if (map.feedCharToSpace2(char2)) {
          sum += getCharValue(char2)
          break
        }
      }
    }
    return sum
  }
  async function solve2(input: string[]) {
    let sum = 0
    let group: Group = null
    for (let line of input) {
      if (!group || group.backpacks.length >= 3) {
        group = new Group()
      }
      const backpack = new Backpack()
      for (let i = 0; i < line.length / 2; i++) {
        backpack.feedCharToSpace1(line[i])
        backpack.feedCharToSpace2(line[i + line.length / 2])
      }
      if (group.addBackpack(backpack)) {
        sum += getCharValue(group.findBadge())
      }
    }

    return sum
  }

  return { solve1, solve2 }
}

function getCharValue(char: string) {
  let asciiValue = char.charCodeAt(0)
  if (asciiValue > 90) return asciiValue - 96
  return asciiValue - 38
}

class Backpack {
  public space1 = new Map<string, number>()
  public space2 = new Map<string, number>()

  public feedCharToSpace1(char: string) {
    this.space1.set(char, 1)
    return this.space2.has(char)
  }

  public feedCharToSpace2(char: string) {
    this.space2.set(char, 1)
    return this.space1.has(char)
  }

  public getAllKeys() {
    return Array.from(new Map([...this.space1, ...this.space2]).keys())
  }

  public hasKey(key: string) {
    return this.space1.has(key) || this.space2.has(key)
  }
}

class Group {
  public backpacks: Backpack[] = []

  public addBackpack(backpack: Backpack) {
    this.backpacks.push(backpack)
    return this.backpacks.length === 3
  }

  public findBadge() {
    return this.backpacks[0].getAllKeys().find((key) => this.backpacks[1].hasKey(key) && this.backpacks[2].hasKey(key))
  }
}
