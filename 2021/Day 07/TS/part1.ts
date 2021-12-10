import fs from 'fs'
import path from 'path'

const file: string = fs.readFileSync(path.resolve(__dirname, '../data.txt'), 'utf8')
const positions = file.split(',').map((str) => parseInt(str))

let fuel = 999999999
let i: number
for (i = 0; true; i++) {
    let newFuel = positions.reduce((sum, pos) => sum + Math.abs(pos - i), 0)
    if (newFuel > fuel) break
    fuel = newFuel
}

console.log('Fuel consumption:', fuel)
