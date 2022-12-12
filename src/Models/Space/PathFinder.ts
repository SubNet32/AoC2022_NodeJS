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

export default function PathFinder<T>(field: FieldMap<T>, start: IPoint, getCostToMoveTo?: (current: PathNode<T>, target: PathNode<T>) => number, stopEarlyIfNode?: (current: PathNode<T>) => boolean) {
  function InitNode(position: IPoint): PathNode<T> {
    const isStart = SpaceUtils.comparePoints(position, start)
    return new PathNode<T>(position, field.getItem(position), isStart)
  }

  const allNodes = Array.from(field.map.keys()).map<PathNode<T>>((key) => InitNode(SpaceUtils.stringToPoint(key)))
  const startNode = allNodes.find((n) => n.isStart)
  let currentNode = startNode
  const visitedNodes: PathNode<T>[] = []
  const possibleNextNodes = new Set<PathNode<T>>()

  function getAdjacentNodes(parentNode: PathNode<T>) {
    let adjNodes = allNodes.filter((n) => !visitedNodes.includes(n) && SpaceUtils.pointsAreAdjacent(n.position, parentNode.position))
    return adjNodes.filter((n) => !getCostToMoveTo || !!getCostToMoveTo(parentNode, n))
  }

  function getNextNode() {
    let unvisitedNodes = Array.from(possibleNextNodes)
    unvisitedNodes.sort((a, b) => a.cost - b.cost)
    return unvisitedNodes[0]
  }

  while (visitedNodes.length < allNodes.length) {
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
    if (stopEarlyIfNode && stopEarlyIfNode(currentNode)) {
      break
    }
    if (!currentNode) {
      break
    }
  }

  return allNodes
}
