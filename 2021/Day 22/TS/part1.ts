import fs from 'fs'
import path from 'path'

const file: string = fs.readFileSync(path.resolve(__dirname, '../data.txt'), 'utf-8')
const lines = file.split('\n')

type Instruction = {
    on: boolean
    x: { start: number; end: number }
    y: { start: number; end: number }
    z: { start: number; end: number }
}
type Reactor = Set<string>

const instructions: Instruction[] = lines
    .map((str) => [str[1] == 'n' ? true : false, ...(str.match(/-?\d+/g)?.map((num) => parseInt(num)) || [])])
    .map(
        (l) =>
            ({
                on: l[0],
                x: { start: l[1], end: l[2] },
                y: { start: l[3], end: l[4] },
                z: { start: l[5], end: l[6] },
            } as Instruction),
    )

const reactor: Reactor = new Set()
for (let instruction of instructions) {
    fixBounds(instruction, -50, 50)
    for (let x = instruction.x.start; x <= instruction.x.end; x++) {
        for (let y = instruction.y.start; y <= instruction.y.end; y++) {
            for (let z = instruction.z.start; z <= instruction.z.end; z++) {
                if (instruction.on) reactor.add(`${x},${y},${z}`)
                else reactor.delete(`${x},${y},${z}`)
            }
        }
    }
}

function fixBounds(instruction: Instruction, min: number, max: number) {
    instruction.x.start = instruction.x.start < min ? min : instruction.x.start
    instruction.x.end = instruction.x.end > max ? max : instruction.x.end
    instruction.y.start = instruction.y.start < min ? min : instruction.y.start
    instruction.y.end = instruction.y.end > max ? max : instruction.y.end
    instruction.z.start = instruction.z.start < min ? min : instruction.z.start
    instruction.z.end = instruction.z.end > max ? max : instruction.z.end
}

console.log('Lights on:', reactor.size)
