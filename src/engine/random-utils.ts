import { RandomGenerator } from "./random-generator";
import { Vector } from "./vector";

export class RandomUtils {
  private seed: number;
  private generator: RandomGenerator;
  private savedState: number;

  constructor() {
    this.seed = Math.abs(parseInt(window.location.hash.substring(1)))
    if (isNaN(this.seed)) {
      this.seed = this.randomSeed()
    }
    this.seed = this.seed
    this.generator = new RandomGenerator(this.seed)
    this.savedState = this.seed
  }

  private randomSeed(): number {
    return Math.floor(Math.random() * 1000)
  }

  setRandomSeed() {
    this.seed = this.randomSeed()
    this.generator.setState(this.seed)
    this.savedState = this.seed
  }

  getSeed() {
    return this.seed
  }

  setState(state: number) {
    this.generator.setState(state)
  }

  getState() {
    return this.generator.getState()
  }

  // go back to the last saved state
  restore() {
    this.seed = this.savedState
    this.generator.setState(this.seed)
  }


  // -----------------------------------------------------------------------------
  // Methods that produce random values using the internal generator 
  // -----------------------------------------------------------------------------

  float(min: number = 0, max: number = 1) {
    return this.generator.next() * (max - min) + min
  }

  int(min: number = 0, max: number = 1) {
    return Math.floor(this.float(min, max))
  }

  vector(min: number = 0, max: number = 1) {
    return new Vector(this.float(min, max), this.float(min, max))
  }

  color() {
    return `#${this.int(100, 255).toString(16)}${this.int(100, 255).toString(16)}${this.int(100, 255).toString(16)}`
  }
}

export const randomUtils = new RandomUtils()
