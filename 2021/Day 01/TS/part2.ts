import * as fs from 'fs'
import path from 'path'

// Read data
const file: string = fs.readFileSync(path.resolve(__dirname, '../data.txt'), 'utf8')
const numbers: number[] = file.split('\n').map((str) => Number(str))

// Count times the number increased
let countLarger = 0
for (let i = 3; i < numbers.length; i++) {
    if (numbers[i] > numbers[i - 3]) countLarger++
}

// Output answer
console.log('Count larger:', countLarger)
