import fs from 'fs'
import path from 'path'

const file: string = fs.readFileSync(path.resolve(__dirname, '../data.txt'), 'utf-8')
const lines = file.split('\n')

type Range = {
    min: number
    max: number
}

type Cuboid = {
    x: Range
    y: Range
    z: Range
}

type Step = {
    on: boolean
    box: Cuboid
}

// Get steps
const steps: Step[] = []
for (let line of lines) {
    let matches = line.matchAll(/(on|off).+=(-?\d+)..(-?\d+).+=(-?\d+)..(-?\d+).+=(-?\d+)..(-?\d+)/g)
    for (let match of matches) {
        const x: Range = { min: parseInt(match[2]), max: parseInt(match[3]) }
        const y: Range = { min: parseInt(match[4]), max: parseInt(match[5]) }
        const z: Range = { min: parseInt(match[6]), max: parseInt(match[7]) }
        steps.push({ on: match[1] == 'on', box: { x, y, z } } as Step)
    }
}

const result: Step[] = []
for (let step of steps) {
    const newSteps: Step[] = []
    if (step.on) newSteps.push(step)
    for (let step2 of result) {
        const intersection = getIntersection(step, step2)
        if (intersection.on !== undefined) newSteps.push(intersection)
    }
    result.push(...newSteps)
}

const lit = result.reduce((a, b) => a + getVolume(b.box) * (b.on ? 1 : -1), 0)
console.log('Lights lit:', lit)

function getVolume(box: Cuboid): number {
    return (box.x.max - box.x.min + 1) * (box.y.max - box.y.min + 1) * (box.z.max - box.z.min + 1)
}

function getIntersection(step1: Step, step2: Step): Step {
    // No overlap
    if (step1.box.x.min > step2.box.x.max || step1.box.x.max < step2.box.x.min) return {} as Step
    if (step1.box.y.min > step2.box.y.max || step1.box.y.max < step2.box.y.min) return {} as Step
    if (step1.box.z.min > step2.box.z.max || step1.box.z.max < step2.box.z.min) return {} as Step
    // Overlap
    return {
        on: !step2.on,
        box: {
            x: { min: Math.max(step1.box.x.min, step2.box.x.min), max: Math.min(step1.box.x.max, step2.box.x.max) },
            y: { min: Math.max(step1.box.y.min, step2.box.y.min), max: Math.min(step1.box.y.max, step2.box.y.max) },
            z: { min: Math.max(step1.box.z.min, step2.box.z.min), max: Math.min(step1.box.z.max, step2.box.z.max) },
        },
    }
}
