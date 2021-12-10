import * as fs from 'fs'
import path from 'path'

// Read data
const file: string = fs.readFileSync(path.resolve(__dirname, '../data.txt'), 'utf8')
const lines: number[][][] = file
    .split('\n')
    .map((str) => str.split(' -> ').map((str) => str.split(',').map((str) => parseInt(str))))
    .filter((line) => line[0][0] == line[1][0] || line[0][1] == line[1][1]) // filter out diagonals

// Put line points into a record of coordinate
let traces: Record<number, Record<number, number>> = {}
for (let [start, end] of lines) {
    // Get start position and direction of travel
    let [x, y] = start
    let [dx, dy] = [Math.sign(end[0] - x), Math.sign(end[1] - y)]

    // Map points to record
    while (!(x == end[0] + dx && y == end[1] + dy)) {
        if (!traces[y]) traces[y] = {}
        if (!traces[y][x]) traces[y][x] = 0
        traces[y][x]++

        // If end is reached for either coordinate, in/de-crementing
        if (x == end[0]) dx = 0
        if (y == end[1]) dy = 0
        x += dx
        y += dy
    }
}

// Count values of 2 or greater in record
let count: number = 0
for (let line of Object.values(traces)) {
    for (let cell of Object.values(line)) {
        if (cell > 1) count++
    }
}

console.log('Total intersections:', count)
