import * as fs from 'fs'
import path from 'path'

// Read data
const file: string = fs.readFileSync(path.resolve(__dirname, '../data.txt'), 'utf8')
const bits: string[] = file.split('\n')
const length: number = bits[0].length

// Calculate answer
let gamma = 0
for (let i = 0; i < length; i++) {
    const mcb = mostCommonBit(bits, i)
    gamma += mcb * (mcb * 2) ** (length - i - 1) // convert binary to decimal
}
const epsilon: number = 2 ** length - 1 - gamma

// Output answer
console.log('Gamma:', gamma)
console.log('Epsilon:', epsilon)
console.log('Answer:', gamma * epsilon)

// --------------------------------------------

function mostCommonBit(bits: string[], pos: number): number {
    const counts: number[] = [0, 0]
    for (let line of bits) counts[Number(line[pos])]++
    return counts[0] > counts[1] ? 0 : 1
}
