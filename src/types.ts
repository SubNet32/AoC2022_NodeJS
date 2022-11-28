export type DayFile = {
  file: string
  day: number
  isTest: boolean
}

export type DayResult = {
  solve1: (input: string[]) => Promise<string>
  solve2: (input: string[]) => Promise<string>
}
