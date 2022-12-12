import SpaceUtils from '../../Utils/SpaceUtils'
import { FieldMap } from './FieldMap'
import { IPoint } from './Position'

export class PathNode<T> {
  public position: IPoint
  public value: T
  public cost: number | undefined
  public prevNode?: PathNode<T> | null = null
  public isStart: boolean

  constructor(position: IPoint, value: T, isStart?: boolean) {
    this.position = position
    this.value = value
    this.cost = isStart ? 0 : undefined
    this.isStart = isStart
  }

  public getPath(): IPoint[] {
    if (!this.prevNode) return [this.position]
    return [...this.prevNode.getPath(), this.position]
  }
}

export function CreatePathFieldMapFromInput<T>(input: string[], valueProvide: (char: string) => T) {
  return FieldMap.fromInput(input, (char, x, y) => new PathNode<T>({ x, y }, valueProvide(char)))
}

export default function PathFinder<T>(
  field: FieldMap<PathNode<T>>,
  startNode: PathNode<T>,
  getCostToMoveTo?: (current: PathNode<T>, target: PathNode<T>) => number,
  stopEarlyIfNode?: (current: PathNode<T>) => boolean
) {
  const possibleDirections: IPoint[] = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ]
  const nodeCount = field.map.size
  let currentNode = startNode
  const visitedNodes: PathNode<T>[] = []
  const possibleNextNodes = new Set<PathNode<T>>()

  function getAdjacentNodes(parentNode: PathNode<T>) {
    let adjNodes: PathNode<T>[] = []
    possibleDirections.forEach((dir) => {
      let node = field.getItem(SpaceUtils.addToPoint(parentNode.position, dir))
      if (node && (!getCostToMoveTo || !!getCostToMoveTo(parentNode, node))) {
        adjNodes.push(node)
      }
    })
    return adjNodes
  }

  function getNextNode() {
    let unvisitedNodes = Array.from(possibleNextNodes)
    if (!unvisitedNodes.length) return undefined
    unvisitedNodes.sort((a, b) => a.cost - b.cost)
    return unvisitedNodes[0]
  }

  while (visitedNodes.length < nodeCount) {
    let adjNodes = getAdjacentNodes(currentNode)
    adjNodes.forEach((n) => {
      let newCost = getCostToMoveTo ? getCostToMoveTo(currentNode, n) : currentNode.cost + 1
      if (!n.cost || newCost < n.cost) {
        n.cost = newCost
        n.prevNode = currentNode
      }
      possibleNextNodes.add(n)
    })
    visitedNodes.push(currentNode)
    possibleNextNodes.delete(currentNode)
    currentNode = getNextNode()
    if (!currentNode) {
      break
    }
    if (stopEarlyIfNode && stopEarlyIfNode(currentNode)) {
      break
    }
  }

  return field
}
