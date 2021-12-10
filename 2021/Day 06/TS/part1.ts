import * as fs from 'fs'
import path from 'path'

// Read data
const file: string = fs.readFileSync(path.resolve(__dirname, '../data.txt'), 'utf8')
const startTimes: number[] = file.split(',').map((str) => parseInt(str))

// Fish ages
const ages: number[] = new Array(9).fill(0)
for (let time of startTimes) ages[time]++

// Run for a number of days
for (let i = 0; i < 80; i++) {
    ages[8] = ages.shift() || 0
    ages[6] += ages[8]
}

// Count number of fish
const fish = ages.reduce((sum, val) => sum + val)

console.log(fish)
