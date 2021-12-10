import fs from 'fs'
import path from 'path'

const file: string = fs.readFileSync(path.resolve(__dirname, '../data.txt'), 'utf-8')
const lines = file.split('\n')

// Calculate
const riskLevels: number[] = []
for (let y = 0; y < lines.length; y++) {
    const line = lines[y]
    for (let x = 0; x < line.length; x++) {
        const n = line[x]
        const surr = [lines?.[y - 1]?.[x], lines?.[y + 1]?.[x], line?.[x - 1], line?.[x + 1]]
        if (!surr.find((val) => val && val <= n)) riskLevels.push(parseInt(n) + 1)
    }
}

// Output

const riskLevel = riskLevels.reduce((sum, val) => sum + val, 0)
console.log(`Risk level: ${riskLevel}`)
