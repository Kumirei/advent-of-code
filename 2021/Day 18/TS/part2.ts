import fs, { StatsBase } from 'fs'
import path from 'path'

const file: string = fs.readFileSync(path.resolve(__dirname, '../data.txt'), 'utf-8')
const lines = file.split('\n')

type SnailNumber = {
    int: boolean
    val?: number
    parent?: SnailNumber
    left?: SnailNumber
    right?: SnailNumber
}

const mag = getMaxMagnitude(lines)
console.log('Magnitude:', mag)

function getMaxMagnitude(lines: string[]): number {
    let max = 0
    // Just try all of them, lol
    for (let line1 of lines) {
        for (let line2 of lines) {
            let num = snailAdd(parseSnailNumber(line1), parseSnailNumber(line2))
            reduce(num)
            let mag = getMagnitude(num)
            if (mag > max) max = mag

            num = snailAdd(parseSnailNumber(line2), parseSnailNumber(line1))
            reduce(num)
            mag = getMagnitude(num)
            if (mag > max) max = mag
        }
    }
    return max
}

function getMagnitude(num: SnailNumber): number {
    if (num.int) return num.val as number
    let mag = 0
    if (num.left) mag += getMagnitude(num.left) * 3
    if (num.right) mag += getMagnitude(num.right) * 2
    return mag
}

function reduce(num: SnailNumber) {
    while (true) {
        if (explode(num)) continue
        if (split(num)) continue
        else break
    }
}

function split(num: SnailNumber): boolean {
    if (num.int && num.val && num.val >= 10) {
        const left: SnailNumber = { int: true, val: Math.floor(num.val / 2) }
        const right: SnailNumber = { int: true, val: Math.ceil(num.val / 2) }
        const newNum = { int: false, left, right, parent: num.parent }
        left.parent = newNum
        right.parent = newNum
        if (num.parent && num.parent.left == num) num.parent.left = newNum
        else if (num.parent) num.parent.right = newNum
        // console.log('SPL', stringifySnail(c))
        return true
    }
    if (num.left && split(num.left)) return true
    if (num.right && split(num.right)) return true
    return false
}

function explode(num: SnailNumber, depth: number = 0): boolean {
    if (depth >= 4 && num.left?.int && num.right?.int) {
        // Go left
        let prev = num
        let curr: SnailNumber | undefined = num.parent
        while (curr?.left == prev) {
            prev = curr
            curr = curr.parent
        }
        if (curr) {
            curr = curr.left
            while (!curr?.int) curr = curr?.right
            curr.val = (num?.left?.val ?? 0) + (curr?.val ?? 0)
        }
        // Go right
        prev = num
        curr = num.parent
        while (curr?.right == prev) {
            prev = curr
            curr = curr.parent
        }
        if (curr) {
            curr = curr.right
            while (!curr?.int) curr = curr?.left
            curr.val = (num?.right?.val ?? 0) + (curr?.val ?? 0)
        }
        // Set one to zero
        if (num.parent && num.parent.left == num) num.parent.left = { int: true, val: 0, parent: num.parent }
        if (num.parent && num.parent.right == num) num.parent.right = { int: true, val: 0, parent: num.parent }
        // console.log('EXP', stringifySnail(c))

        return true
    }
    if (num.left && explode(num.left, depth + 1)) return true
    if (num.right && explode(num.right, depth + 1)) return true
    return false
}

function stringifySnail(num: SnailNumber): string {
    if (num.int) return String(num.val)
    let str = '['
    if (num.left) str += stringifySnail(num.left) + ','
    if (num.right) str += stringifySnail(num.right) + ']'
    return str
}

function snailAdd(a: SnailNumber, b: SnailNumber): SnailNumber {
    const newNum: SnailNumber = { int: false, left: a, right: b }
    a.parent = newNum
    b.parent = newNum
    return newNum
}

function parseSnailNumber(str: string): SnailNumber {
    const snailJSON = JSON.parse(str)
    return parseSnailJSON(snailJSON)
}

type SnailInput = number | SnailInput[]
function parseSnailJSON(num: SnailInput): SnailNumber {
    if (typeof num == 'number') return { int: true, val: num } as SnailNumber
    const left = parseSnailJSON(num[0])
    const right = parseSnailJSON(num[1])
    let snailNumber: SnailNumber = {
        int: false,
        left,
        right,
    }
    left.parent = snailNumber
    right.parent = snailNumber
    return snailNumber
}
