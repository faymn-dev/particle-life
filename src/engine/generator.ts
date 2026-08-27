// https://en.wikipedia.org/wiki/Linear_congruential_generator
// glibc
const M = 2 ** 31
const A = 1103515245
const C = 12345

export class Generator {
  private X_n: number;
  constructor(seed: number) {
    this.X_n = seed
  }

  // random float between [0, 1)
  next(): number {
    this.X_n = (A * this.X_n + C) % M
    return this.X_n / M
  }
}
