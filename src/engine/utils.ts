export const random = (min: number = 0, max: number = 1) => Math.random() * (max - min) + min

export const randomInt = (min: number = 0, max: number = 1) => Math.floor(random(min, max))

export const constrain = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max)

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

const opacity = (50).toString(16)

export const randomColor = () => `#${randomInt(100, 255).toString(16)}${randomInt(100, 255).toString(16)}${randomInt(100, 255).toString(16)}${opacity}`

