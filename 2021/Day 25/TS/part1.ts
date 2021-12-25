import fs, { readFileSync } from 'fs'
import path from 'path'

const file: string = fs.readFileSync(path.resolve(__dirname, '../data.txt'), 'utf-8')
const lines = file.split('\n')
const DIM: { [index: string]: number } = { x: lines[0].length, y: lines.length }

type Coord = {
    [index: string]: number
    x: number
    y: number
}

type Cucumber = {
    pos: Coord
    dir: string
}

// Init cucumbers
const cucumbers: Record<string, Cucumber> = {}
for (let [y, row] of Object.entries(lines)) {
    for (let [x, cell] of Object.entries(row)) {
        if (cell == 'v') cucumbers[x + ',' + y] = { pos: { x: parseInt(x), y: parseInt(y) }, dir: 'y' }
        else if (cell == '>') cucumbers[x + ',' + y] = { pos: { x: parseInt(x), y: parseInt(y) }, dir: 'x' }
    }
}

// Init movable cucumbers
let movableCucumbers: Record<string, Cucumber[]> = { x: [], y: [] }
for (let cucumber of Object.values(cucumbers)) {
    if (canMove(cucumbers, cucumber)) movableCucumbers[cucumber.dir].push(cucumber)
}

let i = 1
while (movableCucumbers.x.length > 0 || movableCucumbers.y.length > 0) {
    movableCucumbers = step(cucumbers, movableCucumbers)
    i++
}
console.log('Number of steps:', i)

function step(
    cucumbers: Record<string, Cucumber>,
    movableCucumbers: Record<string, Cucumber[]>,
): Record<string, Cucumber[]> {
    // Move cucumbers
    for (let cucumber of movableCucumbers.x) moveCucumber(cucumbers, cucumber)
    for (let cucumber of movableCucumbers.y) moveCucumber(cucumbers, cucumber)
    // Get new movable cucumbers
    const newMovable: Record<string, Cucumber[]> = { x: [], y: [] }
    for (let cucumber of Object.values(cucumbers))
        if (canMove(cucumbers, cucumber)) newMovable[cucumber.dir].push(cucumber)
    return newMovable
}

function moveCucumber(cucumbers: Record<string, Cucumber>, cucumber: Cucumber) {
    delete cucumbers[cucumber.pos.x + ',' + cucumber.pos.y]
    cucumber.pos[cucumber.dir] = (cucumber.pos[cucumber.dir] + 1) % DIM[cucumber.dir]
    cucumbers[cucumber.pos.x + ',' + cucumber.pos.y] = cucumber
    return cucumber
}

// Check if position in front is open
function canMove(cucumbers: Record<string, Cucumber>, cucumber: Cucumber): boolean {
    const { x, y } = cucumber.pos
    if (cucumber.dir == 'x' && !cucumbers[((x + 1) % DIM.x) + ',' + y]) return true
    if (cucumber.dir == 'y') {
        const yblock = cucumbers[x + ',' + ((y + 1) % DIM.y)]
        // Space below is open?
        if (!yblock) {
            // No one trying to move into it?
            const xblock = cucumbers[(x == 0 ? DIM.x - 1 : x - 1) + ',' + ((y + 1) % DIM.y)]
            if (!xblock || xblock.dir == 'y') return true
            return false
        }
        // Cucumber below can move away?
        if (yblock.dir == 'x' && canMove(cucumbers, yblock)) return true
    }
    return false
}
