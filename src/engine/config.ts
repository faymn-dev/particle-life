import { randomUtils } from "./random-utils"

// performance all comes down to particle density - a lower density = easier to compute, because we use a grid-like structure to get neighboring cells
// thus, we can increase performance by
// - increasing the wall width (more space for particles to spawn)
// - lowering the scale (decreases the maximum interaction distance)
// by balancing these parameters, we can simulate thousands of particles (usually at the cost of visuals)
//
// generally speaking, more particles, particle types, "scale" (anything that = more density) means better results

export const NUM_PARTICLES = 18_000
export const PARTICLE_RADIUS = 4
export const NUM_PARTICLE_TYPE = 8

export const WALL_WIDTH = 3000
export const WALL_HEIGHT = Math.ceil(WALL_WIDTH * 9 / 16) // refers to half of the height
export const WALL_THICKNESS = 10

export const CAMERA_PAN_SPEED = 10
export const CAMERA_ZOOM_SPEED = 1.1

const SCALE = 1.75

export const CELL_SIZE = 64 * SCALE
export const GRID_COLS = Math.ceil(WALL_WIDTH * 2 / CELL_SIZE)
export const GRID_ROWS = Math.ceil(WALL_HEIGHT * 2 / CELL_SIZE)

// randomize these dynamically  
export let PARTICLE_COLORS: string[]
export let INTERACTIONS_MATRIX: number[][]
export let MIN_DISTANCE_MATRIX: number[][]
export let MAX_DISTANCE_MATRIX: number[][]

randomizeConfig()

export function randomizeConfig() {
  PARTICLE_COLORS = createColors(NUM_PARTICLE_TYPE)
  INTERACTIONS_MATRIX = createMatrix(NUM_PARTICLE_TYPE, -1, 1)
  MIN_DISTANCE_MATRIX = createMatrix(NUM_PARTICLE_TYPE, 12 * SCALE, 24 * SCALE)
  MAX_DISTANCE_MATRIX = createMatrix(NUM_PARTICLE_TYPE, 32 * SCALE, 64 * SCALE)
}

function createColors(count: number) {
  return new Array(count).fill(0).map(() => randomUtils.color())
}

function createMatrix(size: number, min: number, max: number): number[][] {
  const matrix = []
  for (let i = 0; i < size; i++) {
    const row: number[] = []
    for (let j = 0; j < size; j++) {
      row.push(randomUtils.float(min, max))
    }
    matrix.push(row)
  }
  return matrix
}


