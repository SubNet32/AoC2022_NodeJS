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
      if (node && !visitedNodes.includes(node) && (!getCostToMoveTo || !!getCostToMoveTo(parentNode, node))) {
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
    let nextNode = getNextNode()
    possibleNextNodes.delete(nextNode)
    if (!nextNode) {
      break
    }
    if (stopEarlyIfNode && stopEarlyIfNode(nextNode)) {
      break
    }
    currentNode = nextNode
  }

  return currentNode
}

interface PathNode2<T> {
  node: T
  prevNode: PathNode2<T> | null
  cost: number
}

export function PathFinder2<T>(allNodes: T[], startNode: T, endNode: T, getAdjacentNodes: (current: T) => { node: T; cost: number }[]) {
  const nodeCount = allNodes.length
  const visitedNodes: T[] = []
  let nodesToCheck: PathNode2<T>[] = []
  let currentNode: PathNode2<T> = { node: startNode, prevNode: null, cost: 0 }

  while (visitedNodes.length < nodeCount) {
    if (currentNode.node === endNode) break
    let adjNodes = getAdjacentNodes(currentNode.node).filter((n) => !visitedNodes.includes(n.node))
    visitedNodes.push(currentNode.node)

    if (adjNodes?.length) {
      adjNodes.forEach((node) => {
        let foundNode = nodesToCheck.find((n) => n.node === node)
        if (!foundNode) {
          nodesToCheck.push({ ...node, prevNode: currentNode })
          return
        }
        if (foundNode.cost < node.cost) return
        foundNode.cost = node.cost
        foundNode.prevNode = currentNode
      })
    }
    nodesToCheck.sort((a, b) => a.cost - b.cost)
    currentNode = nodesToCheck.shift()
  }

  let path: T[] = []

  while (currentNode) {
    path.push(currentNode.node)
    currentNode = currentNode.prevNode
  }

  return path
}
