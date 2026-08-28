import { Component, type ComponentArgs } from "../component"
import { GRID_COLS, INTERACTIONS_MATRIX, MAX_DISTANCE_MATRIX, MIN_DISTANCE_MATRIX, NUM_PARTICLE_TYPE, PARTICLE_COLORS, PARTICLE_RADIUS, WALL_HEIGHT, WALL_THICKNESS, WALL_WIDTH } from "../config"
import { isApproxEqual, lerp } from "../utils"
import { Vector } from "../vector"
import type { Wall } from "./wall"
import { randomUtils } from "../random-utils"

interface ParticleArgs extends ComponentArgs {
  pos: Vector
  vel?: Vector
  radius: number;
  variant: number;
}

const DEFAULT_OPACITY = 0.1
const HIGHLIGHT_OPACITY = 0.6

export class Particle extends Component {
  pos: Vector
  vel: Vector
  acc = new Vector()
  radius: number
  variant: number

  opacity = DEFAULT_OPACITY
  targetOpacity = DEFAULT_OPACITY

  constructor(args: ParticleArgs) {
    super({
      ...args,
      tags: ["particle"]
    })
    this.pos = args.pos
    this.vel = args.vel || new Vector()
    this.radius = args.radius
    this.variant = args.variant
    if (this.variant < 0 || this.variant >= NUM_PARTICLE_TYPE) {
      throw new Error("invalid particle id")
    }
  }

  private distanceTo(wall: Wall): Vector {
    let isVertical = wall.height > wall.width
    if (isVertical) {
      return new Vector(wall.pos.x, this.pos.y).sub(this.pos)
    }
    return new Vector(this.pos.x, wall.pos.y).sub(this.pos)
  }

  private getNeighbors(): Particle[] {
    if (!this.engine.grid) {
      return []
    }

    const results: Particle[] = []
    const id = this.pos.getCellIndex()
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        const neighborId = id + x + (y * GRID_COLS)
        if (neighborId >= 0 && neighborId < this.engine.grid.length) {
          results.push(...this.engine.grid[neighborId])
        }
      }
    }

    return results
  }

  update() {
    this.acc.mult(0)


    const walls = this.engine.find<Wall>("wall")
    for (const wall of walls) {
      const direction = this.distanceTo(wall)
      const dist = direction.mag()
      const min = 20
      if (dist < min) {
        const force = (1 - min / dist)
        this.acc.add(direction.mult(force));
      }
    }

    if (this.pos.x >= WALL_WIDTH || this.pos.x <= -WALL_WIDTH || this.pos.y >= WALL_HEIGHT || this.pos.y <= -WALL_HEIGHT) {
      this.randomize()
      return
    }

    const neighbors = this.getNeighbors()

    this.targetOpacity = neighbors.length > 100 || this.vel.mag() > 0.8 ? HIGHLIGHT_OPACITY : DEFAULT_OPACITY
    for (const particle of neighbors) {
      if (particle === this) {
        continue
      }

      const direction = particle.pos.clone().sub(this.pos)
      const dist = direction.mag()

      const strength = INTERACTIONS_MATRIX[this.variant][particle.variant]
      const min = MIN_DISTANCE_MATRIX[this.variant][particle.variant]
      const max = MAX_DISTANCE_MATRIX[this.variant][particle.variant]

      if (dist > max || isApproxEqual(dist, 0, 0.00001)) {
        continue
      }

      direction.normalize()

      if (dist < min) {
        // apply repulsion the closer you get
        const force = (1 - min / dist)
        if (Math.abs(force) >= 10) { // spawn particle somewhere else because they were overlapping
          this.randomize()
          continue
        }
        this.acc.add(direction.mult(force));
      } else {
        const targetDist = (min + max) / 2;
        const variance = Math.pow((max - min) / 4, 2); // width of the bell
        const curve = Math.exp(-Math.pow(dist - targetDist, 2) / (2 * variance));
        const force = strength * curve;
        this.acc.add(direction.mult(force));
      }
    }

    // add repulsion away from mouse on space
    if (this.engine.keys.has(" ")) {
      const mouse = this.engine.screenToWorld(this.engine.mouse)
      const direction = this.pos.clone().sub(mouse)
      const dist = direction.mag()
      if (dist < 100) {
        this.acc.add(direction.normalize().mult(100))
      }
    }

    this.vel.add(this.acc.mult(0.6))
    this.pos.add(this.vel.mult(0.6))

    this.opacity = lerp(this.opacity, this.targetOpacity, 0.5 * this.engine.deltaTime)
  }

  static createRandomArgs(): ParticleArgs {
    return {
      pos: new Vector(
        randomUtils.int(-WALL_WIDTH + WALL_THICKNESS, WALL_WIDTH - WALL_THICKNESS),
        randomUtils.int(-WALL_HEIGHT + WALL_THICKNESS, WALL_HEIGHT - WALL_THICKNESS)
      ),
      vel: new Vector(0, 0),
      variant: randomUtils.int(0, NUM_PARTICLE_TYPE),
      radius: PARTICLE_RADIUS
    }
  }

  randomize() {
    Object.assign(this, Particle.createRandomArgs())
    this.opacity = 0
  }

  render() {
    const ctx = this.engine.ctx

    ctx.globalAlpha = this.opacity
    ctx.fillStyle = PARTICLE_COLORS[this.variant]
    ctx.beginPath()
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI)
    ctx.fill()
  }
}
