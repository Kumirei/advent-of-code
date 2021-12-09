import fs from 'fs'
import path from 'path'

const file: string = fs.readFileSync(path.resolve(__dirname, '../data.txt'), 'utf-8')
const lines = file.split('\n')

// Calculate
const basinSizes = []
for (let y = 0; y < lines.length; y++) {
    const line = lines[y]
    for (let x = 0; x < line.length; x++) {
        const n = line[x]
        const surr = [lines?.[y - 1]?.[x], lines?.[y + 1]?.[x], line?.[x - 1], line?.[x + 1]]
        if (!surr.find((val) => val && val <= n)) basinSizes.push(exploreBasin(x, y))
    }
}
type basin = { [key: string]: { [key: string]: boolean } }
function exploreBasin(x: number, y: number, basin: basin = {}): number {
    if (!lines?.[y]?.[x] || lines?.[y]?.[x] == '9' || basin?.[y]?.[x]) return 0

    // Add current cell
    if (!basin[y]) basin[y] = {}
    basin[y][x] = true

    // Explore
    let surr = [
        [x, y - 1],
        [x, y + 1],
        [x - 1, y],
        [x + 1, y],
    ]
    const result = surr.reduce((sum, coord) => sum + exploreBasin(coord[0], coord[1], basin), 1)

    return result
}

// Output
const product = basinSizes
    .sort((a, b) => (a > b ? -1 : 1))
    .slice(0, 3)
    .reduce((prod, val) => prod * val, 1)

console.log(`Product: ${product}`)
