export type PackageValue = {
  value: number | Package | undefined
}

export default class Package {
  public packages: PackageValue[] = []

  private static IsPackage(input: string) {
    if (!input) return false
    return input.startsWith('[') && input.endsWith(']')
  }

  private IsValuePackage(value: PackageValue) {
    return value && typeof value.value === 'number'
  }

  constructor(input: string) {
    if (input === '[[[]]]') {
      input = input
    }
    let modInput = input.substring(1, input.length - 1)
    while (modInput.length > 0) {
      if (modInput.startsWith('[')) {
        let endOfSubPackage = this.findEndOfPackage(modInput)
        this.addPackage(modInput.substring(0, endOfSubPackage + 1))
        modInput = modInput.substring(endOfSubPackage + 2)
      } else {
        let nextSemi = modInput.indexOf(',')
        if (nextSemi < 0) nextSemi = undefined
        this.addPackage(modInput.substring(0, nextSemi))
        modInput = modInput.substring(nextSemi + 1)
        if (!nextSemi) return
      }
    }
  }

  public static CreatePackageFromValue(value: number) {
    return new Package(`[${value.toString()}]`)
  }

  private findEndOfPackage(input: string) {
    let chars = Array.from(input)
    let index = 1
    while (true) {
      if (chars[index] === ']') return index
      if (chars[index] === '[') {
        let endOfSubPackage = index + this.findEndOfPackage(input.substring(index))
        index = endOfSubPackage
      }
      index++
      if (index >= chars.length) throw `findEndOfPackage Error: End not found ${input}`
    }
  }

  private addPackage(value: string) {
    if (Package.IsPackage(value)) this.packages.push({ value: new Package(value) })
    else if (value) this.packages.push({ value: Number.parseInt(value) })
  }

  public getPrintString() {
    let str = '['
    this.packages.forEach((subPackage, index) => {
      if (typeof subPackage.value === 'object') str += subPackage.value.getPrintString()
      else str += subPackage.value
      if (index < this.packages.length - 1) str += ','
    })
    return (str += ']')
  }

  public compare(otherPackage: Package) {
    let index = 0
    while (true) {
      console.log(`Compairing ${this.getPrintString()} with ${otherPackage.getPrintString()}`)
      if (index >= this.packages.length && index >= otherPackage.packages.length) {
        console.log('Both sides are out of packages')
        return 0
      }
      if (index >= this.packages.length) {
        console.log('Left side run out of packages -> ok')
        return 1
      }
      if (index >= otherPackage.packages.length) {
        console.log('Right side run out of packages -> not ok')
        return -1
      }
      let pA = this.packages[index]
      let pB = otherPackage.packages[index]
      if (typeof pA.value === 'number' && typeof pB.value === 'number') {
        let result = -1
        if (pA.value < pB.value) result = 1
        if (pA.value === pB.value) result = 0
        console.log(`Comparing values ${pA.value} with ${pB.value} => ${result}`)
        if (result === -1) return -1
        if (result === 1) return 1
      } else {
        let nA = typeof pA.value === 'number' ? Package.CreatePackageFromValue(pA.value) : pA.value
        let nB = typeof pB.value === 'number' ? Package.CreatePackageFromValue(pB.value) : pB.value
        let cmpValue = nA.compare(nB)
        if (cmpValue === 1) return 1
        if (cmpValue === -1) return -1
      }
      index++
    }
  }

  p
}
