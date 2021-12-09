import fs from 'fs'
import path from 'path'

const file: string = fs.readFileSync(path.resolve(__dirname, '../data.txt'), 'utf8')
const lines = file.split('\n').map((line) => line.split(' | ').map((part) => part.split(' ')))
const chars = 'abcdefg'
const numbers = ['abcefg', 'cf', 'acdeg', 'acdfg', 'bcdf', 'abdfg', 'abdefg', 'acf', 'abcdefg', 'abcdfg']

// Solve line by line
const values: number[] = []
for (let [hint, problem] of lines) {
    // Count the number of times each segment appears in the list of numbers 0-9
    const charCounts: { [key: string]: number } = { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0 }
    for (let str of hint) {
        for (let char of str) charCounts[char]++
    }

    // Create a key containing the translation
    let key: { [key: string]: string } = {}
    // Deduce from counts and numbers which character corresponds to each segment
    key.b = Object.entries(charCounts).find((val) => val[1] == 6)?.[0] || '' // B is the only one with count 6
    key.e = Object.entries(charCounts).find((val) => val[1] == 4)?.[0] || '' // E is the only one with count 4
    key.f = Object.entries(charCounts).find((val) => val[1] == 9)?.[0] || '' // F is the only one with count 9
    key.c = hint.find((val) => val.length == 2)?.replace(key.f, '') || '' // 1 consists of C and F, we know F
    key.a = hint.find((val) => val.length == 3)?.replace(new RegExp(`[${key.c}${key.f}]`, 'g'), '') || '' // 7 consists of 1 and A, we know 1
    key.d = hint.find((val) => val.length == 4)?.replace(new RegExp(`[${key.b}${key.c}${key.f}]`, 'g'), '') || '' // 4 consists of 1 and B, we know B
    key.g = chars.split('').reduce((last, char) => (Object.values(key).includes(char) ? last : char)) // Last char available

    // Invert key for translation
    key = Object.fromEntries(Object.entries(key).map(([a, b]) => [b, a]))

    // Translate numbers
    const result = []
    for (let str of problem) {
        result.push(
            String(
                numbers.indexOf(
                    str
                        .split('')
                        .map((s) => key[s])
                        .sort()
                        .join(''),
                ),
            ),
        )
    }
    values.push(parseInt(result.join('')))
}

// Get solution
const sum: number = values.reduce((sum, val) => sum + val, 0)
console.log('Sum:', sum)
