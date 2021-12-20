import fs from 'fs'
import path from 'path'

const file: string = fs.readFileSync(path.resolve(__dirname, '../data.txt'), 'utf-8')
const parts = file.split('\n\n').map((str) => str.split('\n'))
const algo = parts[0][0]

type Image = {
    pixels: Record<string, Record<string, boolean>>
    max: { x: number; y: number }
    min: { x: number; y: number }
    size: number
    inf: string
}

// initialize image
let image: Image = {
    pixels: {},
    max: { x: parts[1].length - 1, y: parts[1].length - 1 },
    min: { x: 0, y: 0 },
    size: 0,
    inf: '.',
}
for (let i = 0; i < parts[1].length; i++) {
    for (let j = 0; j < parts[1][i].length; j++) {
        if (parts[1][i][j] == '.') continue
        if (!image.pixels[i]) image.pixels[i] = {}
        image.pixels[i][j] = true
        image.size++
    }
}

image = enhancer(image, algo, 50)
console.log('Number of lit pixels:', image.size)

// Prints the image
function printImage(image: Image) {
    for (let y = image.min.y; y <= image.max.y; y++) {
        for (let x = image.min.x; x <= image.max.x; x++) {
            process.stdout.write(image.pixels[y]?.[x] ? '#' : '.')
        }
        console.log()
    }
    console.log()
}

// Enhances the image a number of times
function enhancer(image: Image, algorithm: string, count: number): Image {
    for (let i = 0; i < count; i++) image = enhance(image, algorithm)
    return image
}

// Enhance image
function enhance(image: Image, algorithm: string): Image {
    const enhanced: Image = {
        pixels: {},
        max: { x: image.max.x + 1, y: image.max.y + 1 },
        min: { x: image.min.x - 1, y: image.min.y - 1 },
        size: 0,
        inf: image.inf == '.' ? algorithm[0] : algorithm[algorithm.length - 1],
    }
    for (let y = enhanced.min.y; y <= enhanced.max.y; y++) {
        for (let x = enhanced.min.x; x <= enhanced.max.x; x++) {
            if (newValue(image, algorithm, x, y)) {
                if (!enhanced.pixels[y]) enhanced.pixels[y] = {}
                enhanced.pixels[y][x] = true
                enhanced.size++
            }
        }
    }
    return enhanced
}

// Gets the new value by calculating the algorithm index
function newValue(image: Image, algorithm: string, x: number, y: number): boolean {
    const deltas = [
        [-1, -1],
        [0, -1],
        [1, -1],
        [-1, 0],
        [0, 0],
        [1, 0],
        [-1, 1],
        [0, 1],
        [1, 1],
    ]
    let index = 0
    for (let i = 0; i < deltas.length; i++) {
        const [dx, dy] = deltas[i]
        const [px, py] = [x + dx, y + dy]
        if (image.pixels[py] && image.pixels[py][px]) index += 2 ** (deltas.length - i - 1)
        if (image.inf == '#' && (px > image.max.x || px < image.min.x || py > image.max.y || py < image.min.y))
            index += 2 ** (deltas.length - i - 1)
    }

    return algorithm[index] == '#'
}
