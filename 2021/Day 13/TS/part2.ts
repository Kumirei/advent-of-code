import fs from 'fs'
import path from 'path'

const file: string = fs.readFileSync(path.resolve(__dirname, '../data.txt'), 'utf-8')
const parts = file.split('\n\n').map((part) => part.split('\n'))
const dots = parts[0].map((line) => line.split(',').map((num) => parseInt(num)))
const directions = parts[1].map((line) => line.split('fold along ')[1].split('='))

// Map the dots
const paper: { [key: string]: { [key: string]: boolean } } = {}
for (let [x, y] of dots) {
    if (!paper[y]) paper[y] = {}
    paper[y][x] = true
}

// Fold paper
for (let direction of directions) {
    const axis = direction[0]
    const index = Number(direction[1])
    if (axis == 'y') {
        for (let key of Object.keys(paper)) {
            const y = Number(key)
            if (y > index) {
                for (let x of Object.keys(paper[y])) {
                    if (!paper[2 * index - y]) paper[2 * index - y] = {}
                    paper[2 * index - y][x] = true // Mirror folded dots
                }
                delete paper[y] // Delete folded dots
            }
        }
        delete paper[index] // Delete fold line
    } else {
        for (let [ykey, xmap] of Object.entries(paper)) {
            const y = Number(ykey)
            for (let xkey of Object.keys(xmap)) {
                const x = Number(xkey)
                if (x >= index) {
                    xmap[2 * index - x] = true // Mirror folded dots
                    delete xmap[x] // Delete folded dot
                }
            }
        }
    }
}

// Print dots
console.log('Answer:\n')
const ymax = Number(Object.keys(paper).reduce((max, val) => (val > max ? val : max)))
const xmax = Object.values(paper)
    .map((line) => Object.keys(line).reduce((max, val) => (Number(val) > max ? Number(val) : max), 0))
    .reduce((max, val) => (val > max ? val : max))
for (let y = 0; y <= ymax; y++) {
    for (let x = 0; x <= xmax; x++) {
        process.stdout.write(paper?.[y]?.[x] ? '#' : ' ')
    }
    console.log()
}
