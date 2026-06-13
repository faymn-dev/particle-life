import { random, randomColor } from "./utils"

export const PARTICLE_RADIUS = 5
export const NUM_PARTICLE_TYPE = 8

// min and max for the minimum radius for interactions
export const MIN_MIN = 12
export const MIN_MAX = 24

// min and max for the maximum radius for interactions
export const MAX_MIN = 32
export const MAX_MAX = 64

// randomize these dynamically  

export const PARTICLE_COLORS = createColors(NUM_PARTICLE_TYPE)

// randomized from -1, 1
export const INTERACTIONS_MATRIX = 

// randomized from MIN_MIN, MIN_MAX 
export const MIN_DISTANCE_MATRIX = []

// randomized from MAX_MIN, MAX_MAX 
export const MAX_DISTANCE_MATRIX = []

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



