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

function nodeGetter(cost: (x: number, y: number) => number, heuristic: (x: number, y: number) => number) {
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

const startTime = Date.now()
const scale = 5
let isValid = (x: number, y: number) => x >= 0 && x < dim.x * scale && y >= 0 && y < dim.y * scale
let cost = (x: number, y: number) =>
    ((Number(square[y % dim.y][x % dim.x]) + Math.floor(y / dim.y) + Math.floor(x / dim.x) - 1) % 9) + 1
let heuristic = (x: number, y: number) => dim.x * scale - 1 - x + dim.y * scale - 1 - y
let getNode = nodeGetter(cost, heuristic)

let searcher = new AStar(isValid, cost, heuristic, getNode)
let start = getNode(0, 0)
let end = getNode(dim.x * scale - 1, dim.y * scale - 1)
searcher.search(start, end)
let ans = end.f - start.g
console.log('Answer:', ans)
console.log('Time:', Date.now() - startTime + 'ms')
