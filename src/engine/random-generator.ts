// https://en.wikipedia.org/wiki/Linear_congruential_generator
// glibc
const M = 2 ** 31
const A = 1103515245
const C = 12345

export class RandomGenerator {
  private X_n: number;

  constructor(seed: number = 0) {
    this.X_n = seed
  }

  getState() {
    return this.X_n
  }

  setState(state: number) {
    this.X_n = state
  }

  // random float between [0, 1)
  next(): number {
    this.X_n = (A * this.X_n + C) % M
    return this.X_n / M
  }
}
