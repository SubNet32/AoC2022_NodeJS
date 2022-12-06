export class FiFo<T> {
  public items: T[] = []
  public size: number

  constructor(size: number) {
    this.size = size
  }

  public add(item: T) {
    this.items = [item, ...this.items]
    if (this.items.length > this.size) return this.items.pop()
    return this.getLast()
  }

  public getLast() {
    return this.items.slice(-1)
  }

  public isFull() {
    return this.items.length === this.size
  }
}
