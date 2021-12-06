import * as fs from 'fs'
import path from 'path'

// Read data
const file = fs.readFileSync(path.resolve(__dirname, '../data.txt'), 'utf8')
const numbers = file.split('\n')

// Count times the number increased
let countLarger = 1
for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] > numbers[i - 1]) countLarger++
}

// Output answer
console.log('Count larger:', countLarger)
