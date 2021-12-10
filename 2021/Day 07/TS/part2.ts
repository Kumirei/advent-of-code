import fs from 'fs'
import path from 'path'

const file: string = fs.readFileSync(path.resolve(__dirname, '../test-data.txt'), 'utf8')
const positions = file.split(',').map((str) => parseInt(str))

// Find average, then try both values near it
const target1 = Math.floor(positions.reduce((sum, val) => sum + val, 0) / positions.length)
const targets = [target1, target1 + 1]
let fuel = targets
    .map((target) =>
        // Get fuel consumption for each possible value
        positions.reduce((sum, pos) => sum + (Math.abs(pos - target) * (Math.abs(pos - target) + 1)) / 2, 0),
    )
    // Get lowest fuel consumption of the two
    .reduce((min, val) => (val < min ? val : min))

console.log('Fuel consumption:', fuel)
