import fs from 'fs'
import path from 'path'

const file: string = fs.readFileSync(path.resolve(__dirname, '../data.txt'), 'utf-8')
const octopi: number[][] = file.split('\n').map((line) => line.split('').map((char) => parseInt(char)))

const delta = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
]

let flashes = 0
let steps = 0
while (flashes != octopi.length * octopi[0].length) {
    incrementAll(octopi)
    flashes = flash(octopi)
    steps++
}

// for (let line of octopi) console.log(JSON.stringify(line).replace(/,/g, ' '))
console.log('Steps:', steps)

// Increment all
function incrementAll(octopi: number[][]) {
    for (let line of octopi) {
        for (let x = 0; x < line.length; x++) line[x]++
    }
}

// Flash
function flash(octopi: number[][], max = 9): number {
    let flashes = 0
    // Initialize queue
    for (let y = 0; y < octopi.length; y++) {
        for (let x = 0; x < octopi[y].length; x++) {
            if (octopi[y][x] > max) flashes += flashOctopus(octopi, x, y, max)
        }
    }
    return flashes
}

// Flash a single octopus
function flashOctopus(octopi: number[][], x: number, y: number, max: number): number {
    let flashes = 1
    octopi[y][x] = 0 // Flash self
    // Flash neighbours
    for (let [dx, dy] of delta) {
        if (!octopi[y + dy] || !octopi[y + dy][x + dx]) continue // Neighbour doesn't exists
        if (octopi[y + dy][x + dx] == 0) continue // Neighbour already flashed
        octopi[y + dy][x + dx]++ // Increment neighbour
        if (octopi[y + dy][x + dx] > max) flashes += flashOctopus(octopi, x + dx, y + dy, max)
    }
    return flashes
}
