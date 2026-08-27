import { randomUtils } from "./random-utils"

export const NUM_PARTICLES = 7800
export const PARTICLE_RADIUS = 5
export const NUM_PARTICLE_TYPE = 8

export const WALL_WIDTH = 700 // refers to half of the width
export const WALL_HEIGHT = 700 // refers to half of the height
export const WALL_THICKNESS = 10

export const CAMERA_PAN_SPEED = 10
export const CAMERA_ZOOM_SPEED = 1.1

export const CELL_SIZE = 64
export const GRID_COLS = Math.ceil(WALL_WIDTH * 2 / CELL_SIZE)
export const GRID_ROWS = Math.ceil(WALL_HEIGHT * 2 / CELL_SIZE)

// randomize these dynamically  
export let SPAWN_ZONE_SIZE: number;
export let PARTICLE_COLORS: string[]
export let INTERACTIONS_MATRIX: number[][]
export let MIN_DISTANCE_MATRIX: number[][]
export let MAX_DISTANCE_MATRIX: number[][]

randomizeConfig()

export function randomizeConfig() {
  SPAWN_ZONE_SIZE = randomUtils.float(360, 600)
  PARTICLE_COLORS = createColors(NUM_PARTICLE_TYPE)
  INTERACTIONS_MATRIX = createMatrix(NUM_PARTICLE_TYPE, -1, 1)
  MIN_DISTANCE_MATRIX = createMatrix(NUM_PARTICLE_TYPE, 12, 24)
  MAX_DISTANCE_MATRIX = createMatrix(NUM_PARTICLE_TYPE, 32, 64)
  randomUtils.saveState()
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


