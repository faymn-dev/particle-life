import { Vector } from "./vector"

export const random = (min: number = 0, max: number = 1) => Math.random() * (max - min) + min

export const randomInt = (min: number = 0, max: number = 1) => Math.floor(random(min, max))

export const randomVector = (min: number = 0, max: number = 1) => new Vector(random(min, max), random(min, max))

export const isApproxEqual = (n: number, target: number, epsilon = 0.01) => Math.abs(target - n) <= epsilon

export const constrain = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max)

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export const randomColor = () => `#${randomInt(100, 255).toString(16)}${randomInt(100, 255).toString(16)}${randomInt(100, 255).toString(16)}`

