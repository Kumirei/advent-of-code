import fs from 'fs'
import path from 'path'

const file: string = fs.readFileSync(path.resolve(__dirname, '../data.txt'), 'utf-8')
const parts = file.split('\n\n').map((part) => part.split('\n').map((line) => line.split(' -> ')))
const sequence = parts[0][0][0]
const ins = Object.fromEntries(parts[1])

type Polymer = Record<string, number>

solve(40)

// Solve for N pairs
function solve(n: number) {
    // Initialize pair counts
    let pairs: Polymer = initPairs(sequence)
    pairs = polymerizer(pairs, n) // Perform n steps
    const letters = countLetters(pairs)
    const diff = diffMaxMin(Object.values(letters))

    console.log('Answer:', diff)
}

// Functions
// Performs N polymerization steps
function polymerizer(polymer: Polymer, steps: number): Polymer {
    for (let i = 0; i < steps; i++) {
        polymer = polymerize(polymer)
    }
    return polymer
}

// Performs a polymerization step
// Every pair AB gets mapped to new pairs AX and XB
function polymerize(polymer: Polymer): Polymer {
    let newPolymer: Polymer = {}
    for (let [key, val] of Object.entries(polymer)) {
        let char = ins[key]
        let a = key[0] + char
        let b = char + key[1]
        newPolymer[a] = (newPolymer[a] ?? 0) + val
        newPolymer[b] = (newPolymer[b] ?? 0) + val
    }
    return newPolymer
}

// Counts the number of letters in the polymer
function countLetters(polymer: Polymer): Polymer {
    let counts: Polymer = {}
    for (let [key, count] of Object.entries(polymer)) {
        counts[key[0]] = (counts[key[0]] ?? 0) + count
    }
    counts[sequence[sequence.length - 1]]++
    return counts
}

// Gets the difference between the minimum and maximum value
function diffMaxMin(vals: number[]): number {
    const min = Math.min(...vals)
    const max = Math.max(...vals)
    return max - min
}

// Initialize the pair count map
function initPairs(sequence: string): Polymer {
    let pairs: Polymer = {}
    for (let i = 1; i < sequence.length; i++) {
        let pair = sequence[i - 1] + sequence[i]
        pairs[pair] = (pairs[pair] ?? 0) + 1
    }
    return pairs
}
