import * as fs from 'fs'
import path from 'path'

// Declare types
type board = number[][]

// Read data
const file: string = fs.readFileSync(path.resolve(__dirname, '../data.txt'), 'utf8')
const numbers: number[] =
    file
        .match(/^[\d,]+/)?.[0]
        .split(',')
        .map((str) => parseInt(str)) || []
const boards: board[] = file
    .split('\n\n')
    .slice(1)
    .map((board) => board.split('\n').map((line) => line.split(/\s+/).map((str) => Number(str))))

// Start calling numbers
callingLoop: for (let i = 1; i < numbers.length; i++) {
    const called = numbers.slice(0, i)
    for (let board of boards) {
        if (isSolved(called, board)) {
            solutionFound(called, board)
            break callingLoop
        }
    }
}

function solutionFound(called: number[], solution: board) {
    console.log('Score:', calculateScore(called, solution))
}

function calculateScore(called: number[], board: board): number {
    let score = 0
    for (let line of board) {
        for (let n of line) {
            if (!called.includes(n)) score += n
        }
    }
    return score * (called.at(-1) ?? 0)
}

function isSolved(called: number[], board: board): boolean {
    for (let i = 0; i < board.length; i++) {
        const horizontalSolve = checkSolution(called, board[i])
        const verticalSolve = checkSolution(
            called,
            board.map((line) => line[i]),
        )
        if (horizontalSolve || verticalSolve) return true
    }
    return false
}

function checkSolution(called: number[], boardNumbers: number[]): boolean {
    return boardNumbers.reduce((solution: boolean, number) => solution && called.includes(number), true)
}
