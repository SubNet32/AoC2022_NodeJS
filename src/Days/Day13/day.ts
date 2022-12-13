import { DayResult } from '../../types'
import Package from './Package'

type PackagePair = [Package, Package]

export default function Day(): DayResult {
  function getPackagePairs(input: string[]) {
    let packagePairs: PackagePair[] = []
    for (let i = 0; i < input.length; i += 3) {
      packagePairs.push([new Package(input[i]), new Package(input[i + 1])])
    }
    return packagePairs
  }

  function getPackages(input: string[]) {
    let packagePairs: Package[] = []
    for (let i = 0; i < input.length; i += 3) {
      packagePairs.push(new Package(input[i]), new Package(input[i + 1]))
    }
    return packagePairs
  }

  async function solve1(input: string[]) {
    let packagePairs = getPackagePairs(input)
    let sum = 0
    packagePairs.forEach((p, index) => {
      console.log('Package1: ', p[0].getPrintString())
      console.log('Package2: ', p[1].getPrintString())
      const result = p[0].compare(p[1])
      if (result > 0) {
        sum += index + 1
      }
      console.log('Comparison returned ', result)

      console.log('')
    })
    return sum
  }
  async function solve2(input: string[]) {
    let packages = getPackages(input)
    const decoderPackages = [new Package('[[2]]'), new Package('[[6]]')]
    packages.push(decoderPackages[0])
    packages.push(decoderPackages[1])
    packages.sort((a, b) => b.compare(a))
    packages.forEach((p) => console.log(p.getPrintString()))
    return (packages.indexOf(decoderPackages[0]) + 1) * (packages.indexOf(decoderPackages[1]) + 1)
  }

  return { solve1, solve2 }
}
