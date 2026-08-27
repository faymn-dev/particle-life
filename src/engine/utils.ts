import { GRID_COLS, GRID_ROWS } from "./config"
export const isApproxEqual = (n: number, target: number, epsilon = 0.01) => Math.abs(target - n) <= epsilon

export const constrain = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max)

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t


export const randomId = () =>
  Math.random().toString(36).substring(2);

export const initGrid = () =>
  Array.from({ length: GRID_COLS * GRID_ROWS }, () => [])

