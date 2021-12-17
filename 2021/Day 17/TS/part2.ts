import fs from 'fs'
import path from 'path'

const file: string = fs.readFileSync(path.resolve(__dirname, '../sample.txt'), 'utf-8')
const bounds = file.split(',').map((x) =>
    x
        .split('=')[1]
        .split('..')
        .map((n) => parseInt(n)),
)
const target = { x: { max: bounds[0][1], min: bounds[0][0] }, y: { max: bounds[1][1], min: bounds[1][0] } }

let start = performance.now()
// Get max y velocity
let i = 0
let height
while (true) {
    height = 0.5 * i * (i - 1)
    let highestStepPossible = 0.5 * (1 + Math.sqrt(8 * height + -8 * target.y.min + 1))
    if (highestStepPossible == i + 1) break
    i++
}
let maxy0 = 1 / 2 + Math.sqrt(1 / 4 + 2 * height) - 1

let count = 0
let found: Record<string, Record<string, boolean>> = {}
// Start searching for solutions in x
let startxvel = Math.ceil(0.5 * (1 + Math.sqrt(1 + 8 * target.x.min)) - 1)
for (let x0 = startxvel; x0 <= target.x.max; x0++) {
    let t = Math.ceil(0.5 * (1 + 2 * x0) - Math.sqrt((0.5 * (1 + 2 * x0)) ** 2 - 2 * target.x.min))
    let dx = x0 - t
    let x = x0 * t - 0.5 * t * (t - 1)
    while (dx >= 0 && x <= target.x.max) {
        // x within bounds, find solutions in y
        if (x <= target.x.max && x >= target.x.min) {
            for (let y0 = maxy0; y0 >= target.y.min; y0--) {
                let y = y0 * t - 0.5 * t * (t - 1)
                if (!(y <= target.y.max && y >= target.y.min) && dx == 0) {
                    // Search higher steps
                    let maxstep = 0.5 + y0 + Math.sqrt(0.25 * (1 + 2 * y0) ** 2 - 2 * target.y.min)
                    for (let t2 = t; t2 <= maxstep; t2++) {
                        y = y0 * t2 - 0.5 * t2 * (t2 - 1)
                        if (y <= target.y.max && y >= target.y.min) break
                    }
                }

                if (y <= target.y.max && y >= target.y.min && !found[y0]?.[x0]) {
                    count++
                    if (!found[y0]) found[y0] = {}
                    found[y0][x0] = true
                }
            }
        }
        x += dx
        dx -= 1
        t++
    }
}

console.log('Number of velocities:', count)
console.log('Solved in:', performance.now() - start + 'ms')
