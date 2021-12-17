import fs from 'fs'
import path from 'path'

const file: string = fs.readFileSync(path.resolve(__dirname, '../data.txt'), 'utf-8')
const bounds = file.split(',').map((x) =>
    x
        .split('=')[1]
        .split('..')
        .map((n) => parseInt(n)),
)
const target = { x: { max: bounds[0][1], min: bounds[0][0] }, y: { max: bounds[1][1], min: bounds[1][0] } }

let start = performance.now()
let i = 0
let height
while (true) {
    height = 0.5 * i * (i - 1)
    let mostStepsPossible = 0.5 * (1 + Math.sqrt(8 * height + -8 * target.y.min + 1))
    if (mostStepsPossible == i + 1) break
    i++
}

console.log('Highest possible shot:', height)
console.log('Solved in:', performance.now() - start + 'ms')
