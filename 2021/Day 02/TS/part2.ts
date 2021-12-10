import * as fs from 'fs'
import path from 'path'

// Read data
const file: string = fs.readFileSync(path.resolve(__dirname, '../data.txt'), 'utf8')
const directions: { direction: string; distance: number }[] = file
    .split('\n')
    .map((d) => d.split(' '))
    .map((d) => ({ direction: d[0], distance: Number(d[1]) }))

// Follow the directions
const position = { x: 0, y: 0, aim: 0 }
for (let { direction, distance } of directions) {
    if (direction == 'forward') {
        position.x += distance
        position.y += position.aim * distance
    } else position.aim += direction == 'up' ? -distance : distance
}

// Output answer
console.log('Position:', position)
console.log('Answer:', position.x * position.y)
