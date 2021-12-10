import fs from 'fs'
import path from 'path'

const file: string = fs.readFileSync(path.resolve(__dirname, '../data.txt'), 'utf-8')
const lines = file.split('\n')

// Find illegal characters
const bracketMap: { [key: string]: string } = { ')': '(', '}': '{', ']': '[', '>': '<' }
let chunks: string[] = []
let illegalChars = []
for (let line of lines) {
    for (let c of line) {
        if ('([{<'.includes(c)) chunks.push(c)
        else if (bracketMap[c] == chunks.at(-1)) chunks.pop()
        else {
            illegalChars.push(c)
            break
        }
    }
}

// Calculate points
const scoringTable: { [key: string]: number } = { ')': 3, '}': 1197, ']': 57, '>': 25137 }
const score = illegalChars.reduce((sum, char) => sum + scoringTable[char], 0)
console.log('Score:', score)
