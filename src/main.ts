import * as fileSystem from 'fs'
import path from 'path'
import * as readline from 'readline'
import { DayResolver } from './DayResolver'
import { DayFile } from './types'
import Utils from './Utils/Utils'

const fastMode = true
const filesPath = './Files/'
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

console.log('AoC2022 - By Philipp Priller')
const files = Utils.mapFiles(fileSystem.readdirSync(filesPath))
const maxDay = Utils.getMaxDay(files)
if (fastMode) loadDay(maxDay)
else rl.question(`Input Day (${maxDay.day}): `, handleDayInput)
function handleDayInput(input: string) {
  if (!input || input === '\r\n') return loadDay(maxDay)
  const parsedInput = Number.parseInt(input).toString()
  const matchingDays = files.filter(
    (f) =>
      f.file.includes(parsedInput.toString()) &&
      Utils.XOR(input.toLowerCase().includes('t'), !f.isTest)
  )
  if (matchingDays.length < 1) return console.error(`Invalid Input '${input}'`)
  loadDay(matchingDays[0])
}

function loadDay(day: DayFile) {
  const content = fileSystem
    .readFileSync(path.join(filesPath, day.file), {
      encoding: 'utf-8',
    })
    .split('\r\n')

  if (fastMode) DayResolver(day, content, 0)
  else {
    rl.question(`Part: `, (input) => {
      DayResolver(day, content, input?.includes('2') ? 2 : 1)
    })
  }
}
