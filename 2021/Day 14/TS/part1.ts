import fs from 'fs'
import path from 'path'

const file: string = fs.readFileSync(path.resolve(__dirname, '../data.txt'), 'utf-8')
const parts = file.split('\n\n').map((part) => part.split('\n').map((line) => line.split(' -> ')))
let [seq, insertions] = [parts[0][0][0].split(''), parts[1]]

// Iterate
for (let i = 0; i < 10; i++) {
    let newSeq: string[] = [seq[0]]
    for (let x = 1; x < seq.length; x++) {
        for (let [pair, val] of insertions) {
            if (seq[x - 1] == pair[0] && seq[x] == pair[1]) {
                newSeq.push(val)
                break
            }
        }
        newSeq.push(seq[x])
    }
    seq = newSeq
}

// Count letters
const letterCounts: { [key: string]: number } = {}
for (let letter of seq) {
    if (!letterCounts[letter]) letterCounts[letter] = 0
    letterCounts[letter]++
}
// Find min/max
let min = Object.values(letterCounts)[0],
    max = 0
for (let count of Object.values(letterCounts)) {
    if (count < min) min = count
    if (count > max) max = count
}
// Answer
console.log('Answer:', max - min)
