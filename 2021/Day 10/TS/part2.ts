import fs from 'fs'
import path from 'path'

const file: string = fs.readFileSync(path.resolve(__dirname, '../data.txt'), 'utf-8')
const lines = file.split('\n')
const bracketMap: { [key: string]: string } = { ')': '(', '}': '{', ']': '[', '>': '<' }

// Find illegal lines
let opens: string[] = []
let legalLines: string[] = []
lineLoop: for (let y = 0; y < lines.length; y++) {
    const line = lines[y]
    for (let c of line) {
        if ('([{<'.includes(c)) opens.push(c)
        else if (bracketMap[c] == opens.at(-1)) opens.pop()
        else continue lineLoop
    }
    legalLines.push(line)
}

// Loop over legal lines to find closing sequences
const scoringTable: { [key: string]: number } = { '(': 1, '[': 2, '{': 3, '<': 4 }
const scores = []
for (let line of legalLines) {
    let opens: string[] = []
    for (let c of line) {
        if ('([{<'.includes(c)) opens.push(c)
        else if (bracketMap[c] == opens.at(-1)) opens.pop()
    }
    let score = 0
    while (opens.length > 0) score = score * 5 + scoringTable[opens.pop() || '']
    scores.push(score)
}

// Calculate points
scores.sort((a, b) => (a > b ? -1 : 1))
const score = scores[(scores.length - 1) / 2]
console.log(score)
