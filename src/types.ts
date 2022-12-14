export type DayFile = {
  file: string
  day: number
  isTest: boolean
}

export interface DayResult {
  solve1: (input: string[]) => Promise<any>
  solve2: (input: string[]) => Promise<any>
}

export type StartupArguments = {
  day?: number
  part?: number
  test: boolean
}
