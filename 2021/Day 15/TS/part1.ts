import fs from 'fs'
import path from 'path'

const file: string = fs.readFileSync(path.resolve(__dirname, '../data.txt'), 'utf-8')
const square: string[] = file.split('\n')
const dim = { x: square[0].length, y: square.length }

interface Node {
    x: number
    y: number
    g: number
    h: number
    f: number
    closed: boolean
    visited: boolean
}

class MinHeap {
    arr: Node[] = []
    size: number = 0
    indexer: (n: Node) => number

    constructor(indexFunc: (n: Node) => number) {
        this.indexer = indexFunc
    }

    getVal(i: number): number {
        return this.indexer(this.arr[i])
    }

    parent(i: number): number {
        return Math.floor((i - 1) / 2)
    }
    left(i: number): number {
        return 2 * i + 1
    }
    right(i: number): number {
        return 2 * i + 2
    }
    getMin(): Node {
        return this.arr[0]
    }

    swap(i: number, j: number) {
        let temp = this.arr[i]
        this.arr[i] = this.arr[j]
        this.arr[j] = temp
    }

    insert(node: Node) {
        let i = this.size
        this.size++
        this.arr[i] = node
        while (i != 0 && this.getVal(this.parent(i)) > this.getVal(i)) {
            this.swap(i, this.parent(i))
            i = this.parent(i)
        }
    }

    popMin(): Node | undefined {
        if (this.size <= 0) return
        let min = this.arr[0]
        this.size--
        if (this.size == 0) {
            this.arr = []
            return min
        }
        this.arr[0] = this.arr[this.size]
        this.minHeapify(0)
        return min
    }

    minHeapify(i: number) {
        let left = this.left(i)
        let right = this.right(i)
        let min = i
        if (left < this.size && this.getVal(left) < this.getVal(i)) min = left
        if (right < this.size && this.getVal(right) < this.getVal(min)) min = right
        if (min != i) {
            this.swap(i, min)
            this.minHeapify(min)
        }
    }

    // Assumes new value is lower
    updateNode(n: Node) {
        for (let i = 0; i < this.size; i++) {
            if (n !== this.arr[i]) continue
            while (i != 0 && this.getVal(this.parent(i)) > this.getVal(i)) {
                this.swap(i, this.parent(i))
                i = this.parent(i)
            }
            break
        }
    }
}

// function aStar(grid: string[], start: Node, end: Node) {
//     if (!isValid(start) || !isValid(end)) return // Make sure start and end ar in bounds
//     if (isEnd(start, end)) return start // Make sure we don't start on the end

//     // Initialize open and closed lists
// }

// function isEnd(node: Node, end: Node): boolean {
//     return node.x == end.x && node.y == end.y
// }

// function isValid(node: Node): boolean {
//     const x = node.x
//     const y = node.y
//     return x >= 0 && x < dim.x && y >= 0 && y < dim.y
// }

class AStar {
    open: MinHeap
    nodes: Record<number, Record<number, Node>>
    isValid: (x: number, y: number) => boolean
    cost: (x: number, y: number) => number
    heuristic: (x: number, y: number) => number
    getNode: (x: number, y: number) => Node

    constructor(
        isValid: (x: number, y: number) => boolean,
        cost: (x: number, y: number) => number,
        heuristic: (x: number, y: number) => number,
        getNode: (x: number, y: number) => Node,
    ) {
        this.open = new MinHeap((n: Node) => n.f)
        this.nodes = {}
        this.isValid = isValid
        this.cost = cost
        this.heuristic = heuristic
        this.getNode = getNode
    }

    init() {
        this.open = new MinHeap((n: Node) => n.f)
        this.nodes = {}
    }

    search(start: Node, end: Node) {
        let open = this.open
        open.insert(start)
        while (open.size > 0) {
            // console.log(open.size)
            let node = open.popMin() // Get lowest f
            if (!node) {
                console.log("Destination can't be reached")
                return // Destination can't be reached
            }
            if (node.x == end.x && node.y == end.y) return node // Reached the end
            // Close node
            node.closed = true
            // Find neighbours
            const neighbours = this.getNeighbours(node)
            for (let neighbour of neighbours) {
                if (neighbour.closed) continue // Already closed
                let cost = this.cost(neighbour.x, neighbour.y)
                if (neighbour.visited && neighbour.g < node.g + cost) continue // There is a shorter path

                neighbour.g = node.g + cost
                neighbour.f = neighbour.g + neighbour.h
                // Put into heap
                // if (!neighbour.visited) console.log(neighbours)

                if (!neighbour.visited) open.insert(neighbour)
                else open.updateNode(neighbour) // It's already in the tree, but we changed its f
                neighbour.visited = true
            }
        }
    }

    getNeighbours(n: Node): Node[] {
        const neighbours: Node[] = []
        for (let [dx, dy] of [
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1],
        ]) {
            if (this.isValid(n.x + dx, n.y + dy)) neighbours.push(this.getNode(n.x + dx, n.y + dy))
        }
        return neighbours
    }
}

function nodeGetter(
    grid: string[],
    cost: (x: number, y: number) => number,
    heuristic: (x: number, y: number) => number,
) {
    let nodes: Record<number, Record<number, Node>> = {}
    return (x: number, y: number) => {
        let node = nodes[y]?.[x]
        if (!node) {
            node = {
                x: x,
                y: y,
                g: cost(x, y),
                h: heuristic(x, y),
                f: cost(x, y) + heuristic(x, y),
                closed: false,
                visited: false,
            } as Node
            if (!nodes[y]) nodes[y] = {}
            nodes[y][x] = node
        }
        return node
    }
}

let isValid = (x: number, y: number) => x >= 0 && x < dim.x && y >= 0 && y < dim.y
let cost = (x: number, y: number) => Number(square[y][x])
let heuristic = (x: number, y: number) => dim.x - 1 - x + dim.y - 1 - y
let getNode = nodeGetter(square, cost, heuristic)

let searcher = new AStar(isValid, cost, heuristic, getNode)
let endNode = searcher.search(getNode(0, 0), getNode(dim.x - 1, dim.y - 1))
let ans = (endNode?.f ?? 1) - 1
console.log(ans)
