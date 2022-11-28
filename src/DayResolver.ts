import { exit } from 'process'
import { DayFile, DayResult } from './types'

async function getDay(day: number): Promise<DayResult | undefined> {
  return (
    await import(`./Days/Day${day.toString().padStart(2, '0')}/Day`)
  ).default()
}

export async function DayResolver(
  dayFile: DayFile,
  input: string[],
  part: 0 | 1 | 2
) {
  const day = await getDay(dayFile.day)
  if (!day) throw day

  if (part === 0) {
    day
      .solve2(input)
      .then((result) => {
        if (!result) day.solve1(input).then(handleResult)
        else handleResult(result)
      })
      .catch(console.error)
  } else if (part === 2)
    day.solve2(input).then(handleResult).catch(console.error)
  else day.solve1(input).then(handleResult).catch(console.error)

  function handleResult(result: string) {
    exit()
  }
}
