import fs from 'fs'
import path from 'path'

const file: string = fs.readFileSync(path.resolve(__dirname, '../data.txt'), 'utf-8')
const start = file.split('\n').map((str) => parseInt(str.split(': ')[1]))

// Cache all 27 possible rolls
const rolls: number[] = []
for (let i = 1; i < 4; i++) for (let j = 1; j < 4; j++) for (let k = 1; k < 4; k++) rolls.push(i + j + k)

// Play the game while caching the answer for when we see the same state again
const cache: Record<string, number[]> = {}
function playRound(p1pos: number, p1score: number, p2pos: number, p2score: number): number[] {
    // Check if answer is already in cache
    const key = `${p1pos},${p1score},${p2pos},${p2score}`
    if (cache[key]) return cache[key]

    // Calculate answer
    if (p1score >= 21) cache[key] = [1, 0]
    else if (p2score >= 21) cache[key] = [0, 1]
    else {
        const wins = [0, 0]
        for (let roll of rolls) {
            const pos = ((p1pos + roll - 1) % 10) + 1
            const score = p1score + pos
            const newWins = playRound(p2pos, p2score, pos, score)
            wins[0] += newWins[1]
            wins[1] += newWins[0]
        }
        cache[key] = wins
    }
    return cache[key]
}

console.log('Max wins:', Math.max(...playRound(start[0], 0, start[1], 0)))
