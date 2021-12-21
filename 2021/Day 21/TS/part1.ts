import fs from 'fs'
import path from 'path'

const file: string = fs.readFileSync(path.resolve(__dirname, '../data.txt'), 'utf-8')
const start = file.split('\n').map((str) => parseInt(str.split(': ')[1]))

type Player = {
    score: number
    position: number
}

const p1: Player = { score: 0, position: start[0] }
const p2: Player = { score: 0, position: start[1] }
const dice = getDice(1, 100)
const nextPlayer = getNextPlayer([p1, p2])
let player = nextPlayer()
let plays = 0
while (Math.max(p1.score, p2.score) < 1000) {
    player.position = ((player.position + rollN(dice, 3) - 1) % 10) + 1
    player.score += player.position
    player = nextPlayer()
    plays++
}
console.log('Rolls:', plays * 3)
console.log('Result:', Math.min(p1.score, p2.score) * plays * 3)

function getNextPlayer(players: Player[]): () => Player {
    let player = 0
    return () => {
        return players[player++ % players.length]
    }
}

function rollN(dice: () => number, rolls: number): number {
    let sum = 0
    for (let i = 0; i < rolls; i++) sum += dice()
    return sum
}

function getDice(min: number, max: number, start: number = min) {
    let val = start - 1
    return () => {
        val++
        if (val > max) val = min
        return val
    }
}
