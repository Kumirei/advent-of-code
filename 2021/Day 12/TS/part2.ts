import fs from 'fs'
import path from 'path'

const file: string = fs.readFileSync(path.resolve(__dirname, '../data.txt'), 'utf-8')
const lines: string[][] = file.split('\n').map((line) => line.split('-'))

// Create a map of vertex connections
const connections: { [key: string]: Set<string> } = {}
for (let line of lines) {
    if (!connections[line[0]]) connections[line[0]] = new Set()
    if (!connections[line[1]]) connections[line[1]] = new Set()
    if (line[1] !== 'start' && line[0] !== 'end') connections[line[0]].add(line[1])
    if (line[0] !== 'start' && line[1] !== 'end') connections[line[1]].add(line[0])
}

// Traverse through map
findPaths('start', 'end')
// console.log(connections)

// Find all possible paths through the graph
function findPaths(start: string, end: string) {
    // Initialize visited nodes
    const visited: { [key: string]: number } = {}
    for (let node of Object.keys(connections)) visited[node] = 0
    // Search for paths
    const path = [start]
    const paths: string[][] = []
    traverse(start, end, visited, path, paths)
    // Output
    console.log('Possible paths:', paths.length)
}

// Traverse the graph BFS recursively
function traverse(
    start: string,
    end: string,
    visited: { [key: string]: number },
    path: string[],
    paths: string[][],
    visitedTwice: boolean = false,
) {
    if (start == end) return paths.push(path.slice())

    // Mark current node visited so no path returns
    visited[start]++
    if (maxVisits(start, visitedTwice) == 2 && visited[start] == 2) visitedTwice = true

    // Go deeper
    for (let next of connections[start]) {
        if (!canVisit(next, visited, visitedTwice)) continue
        // Traverse next node then remove it from path
        path.push(next)
        traverse(next, end, visited, path, paths, visitedTwice)
        path.splice(path.indexOf(next), 1)
    }

    // Unmark current node so that more paths can be found
    visited[start]--
}

// Decides whether a node can be visited again
function canVisit(node: string, visited: { [key: string]: number }, visitedTwice: boolean): boolean {
    let max = maxVisits(node, visitedTwice)
    if (max == -1) return true
    if (visited[node] >= max) return false
    return true
}

// Returns the number of visit a node is allowed
function maxVisits(node: string, visitedTwice: boolean): number {
    if (node == node.toUpperCase()) return -1
    return visitedTwice ? 1 : 2
}
