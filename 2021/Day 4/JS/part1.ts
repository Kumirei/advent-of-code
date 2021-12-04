import * as fs from 'fs'
import path from 'path'

// Declare types
type board = number[][]

// Read data
const numbersFile: string = fs.readFileSync(path.resolve(__dirname, '../data-numbers.txt'), 'utf8')
const numbers: number[] = numbersFile.split(',').map((str) => Number(str))
const boardsFile: string = fs.readFileSync(path.resolve(__dirname, '../data-boards.txt'), 'utf8')
const boards: board[] = boardsFile
    .split('\n\n')
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
