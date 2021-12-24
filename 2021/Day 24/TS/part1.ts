import fs, { stat } from 'fs'
import path from 'path'

const file: string = fs.readFileSync(path.resolve(__dirname, '../data.txt'), 'utf-8')

const constants = [...file.matchAll(/div z (\d+)\nadd x (-?\d+)|add y w\nadd y (-?\d+)/gim)]
    .map((a) => a.slice(1).filter((a) => a))
    .flat()
    .map((a) => parseInt(a))

console.log('Biggest possible serial:', getSerial(constants, true))
console.log('Smallest possible serial:', getSerial(constants, false))

function getSerial(constants: number[], maximize: boolean): string {
    const serial = new Array(14).fill(0)
    const stack: number[][] = []
    for (let i = 0; i < 14; i++) {
        const index = i * 3
        if (constants[index] == 1) stack.push([i, constants[index + 2]])
        else {
            const popped = stack.pop()
            if (!popped) continue
            const [pushIndex, a] = popped
            const c = constants[index + 1] + a
            serial[i] = maximize ? (c >= 0 ? 9 : 9 + c) : c >= 0 ? c + 1 : 1
            serial[pushIndex] = serial[i] - c
        }
    }
    return serial.join('')
}
