import fs from 'fs'
import path from 'path'

const file: string = fs.readFileSync(path.resolve(__dirname, '../data.txt'), 'utf8')
const nums = [2, 3, 4, 7]
const count: number = file
    .split('\n')
    .map((line) =>
        line
            .split(' | ')?.[1]
            .split(' ')
            .reduce((count, str) => count + Number(nums.includes(str.length)), 0),
    )
    .reduce((sum, val) => sum + val, 0)

console.log('Count:', count)
