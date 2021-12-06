import * as fs from 'fs'
import path from 'path'

// Read data
const file: string = fs.readFileSync(path.resolve(__dirname, '../data.txt'), 'utf8')
const bits: string[] = file.split('\n')
const length: number = bits[0].length

// Calculate answer
let oxygenFilter = (line: string, pos: number, mcb: number) => Number(line[pos]) == mcb
let scrubberFilter = (line: string, pos: number, mcb: number) => Number(line[pos]) != mcb
const oxygen: number = findRating(bits, oxygenFilter)
const scrubber: number = findRating(bits, scrubberFilter)

// Output answer
console.log('Oxygen:', oxygen)
console.log('Scrubber:', scrubber)
console.log('Answer:', oxygen * scrubber)

// --------------------------------------------

function mostCommonBit(bits: string[], pos: number): number {
    const counts: number[] = [0, 0]
    for (let line of bits) counts[Number(line[pos])]++
    return counts[0] > counts[1] ? 0 : 1
}

function findRating(bits: string[], filter: (line: string, pos: number, mcb: number) => boolean): number {
    let remaining = bits
    for (let i = 0; i < bits[0].length; i++) {
        remaining = remaining.filter((line) => filter(line, i, mostCommonBit(remaining, i)))

        if (remaining.length == 1) break
    }
    let rating = 0
    for (let i = 0; i < bits[0].length; i++)
        rating += Number(remaining[0][i]) * Number(Number(remaining[0][i]) * 2) ** (bits[0].length - i - 1)
    return rating
}
