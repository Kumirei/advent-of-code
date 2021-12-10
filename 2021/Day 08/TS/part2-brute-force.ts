import fs from 'fs'
import path from 'path'

const file: string = fs.readFileSync(path.resolve(__dirname, '../test-data.txt'), 'utf8')
const lines = file.split('\n').map((line) => line.split(' | ').map((part) => part.split(' ')))

const validNumbers = ['abcefg', 'cf', 'acdeg', 'acdfg', 'bcdf', 'abdfg', 'abdefg', 'acf', 'abcdefg', 'abcdfg']

let map: { [key: string]: string } = {}
const chars = 'abcdefg'

let results: number[] = []

for (let line of lines) {
    forPerms: for (let p of stringPermutations(chars)) {
        for (let i = 0; i < 7; i++) map[p[i]] = chars[i]
        for (let str of [...line[0], ...line[1]]) {
            if (!validateNumber(map, str)) continue forPerms
        }
        let decoded = []
        for (let str of [...line[0], ...line[1]]) {
            decoded.push(String(validNumbers.indexOf(decodeStr(map, str))))
        }
        results.push(parseInt(decoded.slice(-4).join('')))

        break
    }
}

console.log(
    'Results',
    results.reduce((sum, val) => sum + val, 0),
)

function decodeStr(map: { [key: string]: string }, str: string): string {
    return str
        .split('')
        .map((s) => map[s])
        .sort()
        .join('')
}

function validateNumber(map: { [key: string]: string }, number: string) {
    return validNumbers.includes(decodeStr(map, number))
}

function permutations(array: string[]): string[][] {
    let permutations: string[][] = []
    function getPermutations(array: string[], size: number) {
        if (size == 1) permutations.push(array.slice())
        for (let i = 0; i < size; i++) {
            getPermutations(array, size - 1)
            if (size % 2 == 1) swap(array, 0, size - 1)
            else swap(array, i, size - 1)
        }
    }
    getPermutations(array, array.length)
    return permutations
}

function stringPermutations(str: string) {
    return permutations(str.split('')).map((permutation) => permutation.join(''))
}

function swap(array: string[], n: number, m: number) {
    let t = array[n]
    array[n] = array[m]
    array[m] = t
}
