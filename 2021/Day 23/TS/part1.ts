import fs from 'fs'
import path from 'path'

const EMPTY = 0
type Pod = 0 | 1 | 2 | 3 | 4
type Room = Pod[]
type State = {
    hall: Pod[] // hallway positions
    rooms: Room[] // Room positions
}

const CHARS: Record<string, number> = { A: 1, B: 2, C: 3, D: 4, '': 0 }
const COST = { 0: 0, 1: 1, 2: 10, 3: 100, 4: 1000 }

main()

function main() {
    const start = Date.now()
    let state: State = getInput()
    const lowestCost = search({}, state, Number.MAX_SAFE_INTEGER, 0)
    console.log('Lowest cost:', lowestCost)
    console.log('Executed in:', Date.now() - start, 'ms')
}

// Search recursively for the least cost path
function search(cache: Record<string, number>, state: State, lowestCost: number, cost: number): number {
    // Already above lowest cost
    if (cost >= lowestCost) return lowestCost
    // Check win condition
    if (isWin(state)) return cost
    // Cache result
    const key = state.hall + '/' + state.rooms
    if (cache[key] && cache[key] <= cost) return lowestCost
    cache[key] = cost
    // Move pods out of rooms
    for (let [roomIndex, room] of Object.entries(state.rooms)) {
        const roomNumber = parseInt(roomIndex) + 1
        if (roomReady(room, roomNumber as Pod)) continue // No pod to move out
        const podPos = room.findIndex((pod) => pod !== EMPTY)
        const pod = room[podPos]
        // Find possible moves
        let [minPos, maxPos] = [roomNumber + 1, roomNumber]
        while (minPos > 0 && state.hall[minPos - 1] == EMPTY) minPos--
        while (maxPos < state.hall.length - 1 && state.hall[maxPos + 1] == EMPTY) maxPos++
        // Explore possible moves
        for (let pos = minPos; pos <= maxPos; pos++) {
            // Get number of steps moved
            let moves = 2 * (Math.abs(pos - roomNumber) + (pos <= roomNumber ? 1 : 0)) + podPos
            if (pos == 0 || pos == state.hall.length - 1) moves--
            // Make copy and move pod from room to hallway
            const newState = copyState(state)
            newState.hall[pos] = pod
            newState.rooms[roomNumber - 1][podPos] = 0
            // Explore
            const newCost = search(cache, newState, lowestCost, cost + moves * COST[pod])
            if (lowestCost > newCost) lowestCost = newCost
        }
    }
    // Move pods into rooms
    for (let pos = 0; pos < state.hall.length; pos++) {
        const pod = state.hall[pos]
        if (pod == EMPTY) continue // No pod to move
        if (!roomReady(state.rooms[pod - 1], pod)) continue // Room is not ready
        const blocked = !state.hall.every(
            (val, i) => !(val !== EMPTY && ((i > pos && i <= pod) || (i < pos && i > pod))),
        )
        if (blocked) continue // Path to room is blocked
        let posInRoom = state.rooms[pod - 1].findIndex((pod) => pod !== EMPTY) - 1
        if (posInRoom == -2) posInRoom = state.rooms[0].length - 1
        // Get number of steps moved
        let moves = 2 * (Math.abs(pos - pod) + (pos <= pod ? 1 : 0)) + posInRoom
        if (pos == 0 || pos == state.hall.length - 1) moves--
        // Make copy and move pod from hallway to room
        const newState = copyState(state)
        newState.hall[pos] = 0
        newState.rooms[pod - 1][posInRoom] = pod
        // Explore
        const newCost = search(cache, newState, lowestCost, cost + moves * COST[pod])
        if (lowestCost > newCost) lowestCost = newCost
    }
    return lowestCost
}

function printState(state: State) {
    const h = state.hall.map((a) => a || '.')
    const [r1, r2, r3, r4] = state.rooms
    console.log('#############')
    console.log(`#${h[0]}${h[1]}.${h[2]}.${h[3]}.${h[4]}.${h[5]}${h[6]}#`)
    console.log(`###${r1[0] || '.'}#${r2[0] || '.'}#${r3[0] || '.'}#${r4[0] || '.'}###`)
    console.log(`  #${r1[1] || '.'}#${r2[1] || '.'}#${r3[1] || '.'}#${r4[1] || '.'}#  `)
    console.log(`  #########  \n`)
}

function copyState(state: State): State {
    return { hall: state.hall.slice(), rooms: [...state.rooms.map((room) => room.slice())] }
}

function isWin(state: State) {
    return state.rooms.every((room, i) => room.every((pod) => pod == i + 1))
}

// Check if room is ready to move into
function roomReady(room: Room, type: Pod) {
    return room.every((pod) => pod == type || pod == 0)
}

function getInput(): State {
    const file: string = fs.readFileSync(path.resolve(__dirname, '../data.txt'), 'utf-8')
    const startPos = file
        .split('\n')
        .map((line) => line.match(/(\w)/g))
        .filter((a) => a)
    const roomsStart = new Array(startPos[0]?.length)
        .fill(null)
        .map((_, i) => new Array(startPos.length).fill(null).map((_, j) => CHARS[startPos[j]?.[i] || '']) as Room)
    return { hall: [0, 0, 0, 0, 0, 0, 0], rooms: roomsStart }
}
