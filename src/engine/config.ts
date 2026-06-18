import { random, randomColor } from "./utils"

export const NUM_PARTICLES = 1000
export const PARTICLE_RADIUS = 8
export const NUM_PARTICLE_TYPE = 7

// randomize these dynamically  
export const PARTICLE_COLORS = createColors(NUM_PARTICLE_TYPE)
export const INTERACTIONS_MATRIX = createMatrix(NUM_PARTICLE_TYPE, -1, 1)
export const MIN_DISTANCE_MATRIX = createMatrix(NUM_PARTICLE_TYPE, 12, 24)
export const MAX_DISTANCE_MATRIX = createMatrix(NUM_PARTICLE_TYPE, 32, 64)

function createColors(count: number) {
  return new Array(count).fill(0).map(() => randomColor())
}

function createMatrix(size: number, min: number, max: number): number[][] {
  const matrix = []
  for (let i = 0; i < size; i++) {
    const row: number[] = []
    for (let j = 0; j < size; j++) {
      row.push(random(min, max))
    }
    matrix.push(row)
  }
  return matrix
}



