import { exit } from 'process'
import { DayFile, DayResult } from './types'

async function importDay(day: number): Promise<DayResult | undefined> {
  const dayId = day.toString().padStart(2, '0')
  return (await import(`./Days/Day${dayId}/Day`)).default()
}

export async function DayResolver(
  dayFile: DayFile,
  input: string[],
  part: 0 | 1 | 2
) {
  const day = await importDay(dayFile.day)
  if (!day) throw 'invalid day'

  if (part === 0) {
    day
      .solve2(input)
      .then((result) => {
        if (!result) day.solve1(input).then((result) => handleResult(result, 1))
        else handleResult(result, 2)
      })
      .catch(console.error)
  } else if (part === 2)
    day
      .solve2(input)
      .then((result) => handleResult(result, 2))
      .catch(console.error)
  else
    day
      .solve1(input)
      .then((result) => handleResult(result, 1))
      .catch(console.error)

  function handleResult(result: any, part: number) {
    console.log(
      `Result Day${dayFile.day} P${part}${dayFile.isTest ? ' Test' : ''}:`,
      result.toString()
    )
    console.log('')
    exit()
  }
}
