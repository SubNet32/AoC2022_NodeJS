import { DayResult } from '../../types'
import { Data } from './Data'

export default function Day(): DayResult {
  const totalDiskSpace = 70000000
  const requiredDiskSpace = 30000000

  function getDirectories(input: string[]) {
    let cwd = new Data(null, 'dir /')
    input.forEach((line) => {
      cwd = cwd.runCmd(line)
    })
    let root = cwd.getRoot()
    root.print()
    let directories = root.getDirList()
    directories.forEach((d) => d.calcSize())
    console.log(
      'Directories',
      directories.map((d) => `${d.name} (${d.size})`)
    )
    return directories
  }

  async function solve1(input: string[]) {
    let directories = getDirectories(input).filter((d) => d.size <= 100000)
    return directories.reduce((sum, d) => sum + d.size, 0)
  }
  async function solve2(input: string[]) {
    let directories = getDirectories(input)
    const root = directories[0].getRoot()
    const freeDiskSpace = totalDiskSpace - root.size
    directories = directories.filter((d) => d.size + freeDiskSpace >= requiredDiskSpace)
    directories.sort((a, b) => a.size - b.size)
    console.log(
      'Possible Delete candidates',
      directories.map((d) => `${d.name} (${d.size})`)
    )

    return directories[0].size
  }

  return { solve1, solve2 }
}
