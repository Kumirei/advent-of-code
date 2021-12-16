import fs from 'fs'
import path from 'path'

const file: string = fs.readFileSync(path.resolve(__dirname, '../data.txt'), 'utf-8')
const lines = file.split('\n')

let line = lines[0]
line = hexToBin(line)
const [val, i, vsum] = getPacket(line)
console.log('Sum of version:', vsum)
console.log('Value of packet:', val)

function getPacket(bin: string, i: number = 0, vsum: number = 0): number[] {
    let v = parseInt(bin.slice(i, (i += 3)), 2)
    let t = parseInt(bin.slice(i, (i += 3)), 2)

    if (t == 4) {
        let n: string = bin.slice(i + 1, (i += 5))
        while (bin[i - 5] != '0') n += bin.slice(i + 1, (i += 5))
        return [parseInt(n, 2), i, vsum + v]
    } else {
        // operator
        const packets: number[] = []
        i++
        if (bin[i - 1] == '0') {
            // next 15 bits represent total length of sub-packets
            const len = parseInt(bin.slice(i, (i += 15)), 2)
            const stop = i + len
            while (i < stop && stop - i > 10) {
                const [packet, i2, vsum2] = getPacket(bin, i, vsum)
                packets.push(packet)
                i = i2
                vsum = vsum2
            }
            i = stop
        } else {
            // next 11 bits represent number of sub-packets
            const len = parseInt(bin.slice(i, (i += 11)), 2)
            for (let j = 0; j < len; j++) {
                const [packet, i2, vsum2] = getPacket(bin, i, vsum)
                packets.push(packet)
                i = i2
                vsum = vsum2
            }
        }
    }
    return [0, i, vsum + v]
}

function hexToBin(hex: string): string {
    const bin: number[] = []
    // Convert character by character
    for (let c of line) {
        const n = parseInt(c, 16)
        bin.push(...[+(n % 16 >= 8), +(n % 8 >= 4), +(n % 4 >= 2), +(n % 2 >= 1)])
    }
    return bin.join('')
}
