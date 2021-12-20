import fs, { copyFileSync } from 'fs'
import path from 'path'

const file: string = fs.readFileSync(path.resolve(__dirname, '../data.txt'), 'utf-8')
const scanners = file
    .split(/\n*---.+---\n/)
    .slice(1)
    .map((str) => str.split('\n').map((str) => str.split(',').map((num) => parseInt(num))))

// Initiate known beacons
const found: Record<number, Record<number, Record<number, boolean>>> = {}
const foundList: number[][] = []
for (let [x, y, z] of scanners[0]) {
    if (!found[x]) found[x] = {}
    if (!found[x][y]) found[x][y] = {}
    found[x][y][z] = true
    foundList.push([x, y, z])
}

// Locate the scanners
let queue = scanners.slice(1)
queue: while (queue.length > 0) {
    const scanner = queue.splice(0, 1)[0]

    // Rotate in all directions
    const rotations = getRotations(scanner)
    for (let rotation of rotations) {
        // Match with the found ones
        for (let beacon of rotation) {
            for (let [fx, fy, fz] of foundList) {
                // Get offset
                let [dx, dy, dz] = [fx - beacon[0], fy - beacon[1], fz - beacon[2]]

                // Check if translation matches other beacons
                let matches = 0
                for (let i = 0; i < rotation.length; i++) {
                    const [rx, ry, rz] = rotation[i]
                    const [tx, ty, tz] = [rx + dx, ry + dy, rz + dz]
                    if (found[tx]?.[ty]?.[tz]) matches++
                    if (matches >= 12) break // Already enough
                    if (12 - matches > rotation.length - 1 - i) break // Not enough
                }

                // If 12 or more matched, then save them
                if (matches >= 12) {
                    console.log(`Scanner ${scanners.indexOf(scanner)} found at`, dx, dy, dz)

                    for (let [rx, ry, rz] of rotation) {
                        const [tx, ty, tz] = [rx + dx, ry + dy, rz + dz]
                        if (!found[tx]) found[tx] = {}
                        if (!found[tx][ty]) found[tx][ty] = {}
                        if (!found[tx][ty][tz]) foundList.push([tx, ty, tz])
                        found[tx][ty][tz] = true
                    }
                    continue queue
                }
            }
        }
    }
    queue.push(scanner) // If we could not find scanner location, put it back in queue
}

console.log('Number of beacons found:', foundList.length)

// Get a list of all possible rotations
function getRotations(scanner: number[][]): number[][][] {
    const rotations: number[][][] = new Array(24).fill(null).map((_) => [])
    for (let [x, y, z] of scanner) {
        rotations[0].push([x, y, z])
        rotations[1].push([x, -y, -z])
        rotations[2].push([x, z, -y])
        rotations[3].push([x, -z, y])
        rotations[4].push([-x, y, -z])
        rotations[5].push([-x, -y, z])
        rotations[6].push([-x, z, y])
        rotations[7].push([-x, -z, -y])
        rotations[8].push([y, z, x])
        rotations[9].push([y, -z, -x])
        rotations[10].push([y, x, -z])
        rotations[11].push([y, -x, z])
        rotations[12].push([-y, z, -x])
        rotations[13].push([-y, -z, x])
        rotations[14].push([-y, x, z])
        rotations[15].push([-y, -x, -z])
        rotations[16].push([z, x, y])
        rotations[17].push([z, -x, -y])
        rotations[18].push([z, y, -x])
        rotations[19].push([z, -y, x])
        rotations[20].push([-z, x, -y])
        rotations[21].push([-z, -x, y])
        rotations[22].push([-z, y, x])
        rotations[23].push([-z, -y, -x])
    }
    return rotations
}
