export const random = (min: number = 0, max: number = 1) => Math.random() * (max - min) + min

export const randomInt = (min: number = 0, max: number = 1) => Math.floor(random(min, max))

export const randomColor = () => `#${randomInt(0, 255).toString(16)}${randomInt(0, 255).toString(16)}${randomInt(0, 255).toString(16)}`

