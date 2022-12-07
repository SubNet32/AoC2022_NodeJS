export class Data {
  public name: string
  public size: number = 0
  public isFile: boolean = false
  public isDir: boolean = false
  public parent: Data | null = null
  public data: Data[] | null = null

  constructor(parent: Data | null, input: string) {
    this.parent = parent
    const [t1, t2] = input.split(' ')
    this.name = t2
    if (t1 === 'dir') {
      this.isDir = true
      this.size = 0
      this.data = []
    } else {
      this.isFile = true
      this.size = Number.parseInt(t1)
    }
  }

  public add(input: string) {
    if (this.isFile) return
    let child = new Data(this, input)
    this.data.push(child)
  }

  public calcSize() {
    if (!this.size) this.size = this.data.reduce((sum, currentData) => sum + currentData.calcSize(), 0)
    return this.size
  }

  public getRoot(): Data {
    if (!this.parent) return this
    return this.parent.getRoot()
  }

  public runCmd(cmdInput: string): Data {
    if (!cmdInput.startsWith('$')) {
      this.add(cmdInput)
      return this
    }
    let [dummy, cmd, arg] = cmdInput.split(' ')
    if (cmd === 'ls') return this
    if (cmd === 'cd') {
      if (arg === '..') return this.parent ?? this
      if (arg === '/') return this.getRoot()
      let foundDir = this.data.find((d) => d.name === arg)
      if (foundDir) return foundDir
    }
    throw 'Failed to execute cmd ' + cmdInput
  }

  public print(depth: number = 0) {
    let printStr = `${'  '.repeat(depth + 1)}- ${this.name}`
    if (this.isFile) printStr += ` (file, ${this.size})`
    console.log(printStr)
    if (!this.isDir || !this.data?.length) return
    this.data.sort((a, b) => (a.isDir > b.isDir ? -1 : 1)).forEach((d) => d.print(depth + 1))
  }

  public getDirList(): Data[] {
    if (this.isFile) return []
    let list: Data[] = []
    if (!this.parent) list.push(this)
    for (let d of this.data.filter((df) => !!df.isDir)) {
      list.push(d)
      list.push(...d.getDirList())
    }
    return list
  }
}
