import { Component, type ComponentArgs } from "../component"
import { INTERACTIONS_MATRIX, MAX_DISTANCE_MATRIX, MIN_DISTANCE_MATRIX, NUM_PARTICLE_TYPE, PARTICLE_COLORS, PARTICLE_RADIUS, SPAWN_ZONE_SIZE, WALL_HEIGHT, WALL_WIDTH } from "../config"
import { isApproxEqual, lerp, randomInt, randomVector } from "../utils"
import { Vector } from "../vector"
import type { Wall } from "./wall"

interface ParticleArgs extends ComponentArgs {
  pos: Vector
  vel?: Vector
  radius: number;
  id: number;
}

let particles: Particle[] = []
let walls: Wall[] = []

let grid: Record<string, Particle[]> | null = null;

export class Particle extends Component {
  pos: Vector
  vel: Vector
  acc = new Vector()
  radius: number
  id: number

  opacity = 0;
  targetOpacity = 0.3;

  constructor(args: ParticleArgs) {
    super({
      ...args,
      tags: ["particle"]
    })
    this.pos = args.pos
    this.vel = args.vel || new Vector()
    this.radius = args.radius
    this.id = args.id
    if (this.id < 0 || this.id >= NUM_PARTICLE_TYPE) {
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


  // TODO refactor this so these are engine methods or in some kind of ParticleManager class
  // this feels kind of bad
  static computeGrid() {
    grid = {}
    for (const particle of particles) {
      const id = particle.pos.toIdVector().toString()
      if (!(id in grid)) {
        grid[id] = []
      }
      grid[id].push(particle)
    }
  }


  private getNeighbors(): Particle[] {
    const results: Particle[] = []
    if (!grid) {
      return results
    }

    const id = this.pos.toIdVector()
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        const neighborId = id.clone().add(new Vector(x, y)).toString()
        results.push(...(grid[neighborId] || []))
      }
    }

    return results
  }

  update() {
    // get references to appropriate components
    if (particles.length === 0) {
      particles = this.engine.find("particle") as Particle[]
    }

    if (walls.length === 0) {
      walls = this.engine.find("wall") as Wall[]
    }

    if (grid === null) {
      Particle.computeGrid();
    }

    this.acc.mult(0)

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

    for (const particle of this.getNeighbors()) {
      if (particle === this) {
        continue
      }

      const direction = particle.pos.clone().sub(this.pos)
      const dist = direction.mag()

      const strength = INTERACTIONS_MATRIX[this.id][particle.id]
      const min = MIN_DISTANCE_MATRIX[this.id][particle.id]
      const max = MAX_DISTANCE_MATRIX[this.id][particle.id]

      if (dist > max || isApproxEqual(dist, 0, 0.00001)) {
        continue
      }

      direction.normalize()

      if (dist < min) {
        // apply repulsion the closer you get
        const force = (1 - min / dist)
        if (Math.abs(force) >= 10) {
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

    // add repulsion away from mouse on click
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
    this.vel.mult(0.5)
  }

  static createRandomArgs(): ParticleArgs {
    return {
      pos: randomVector(-SPAWN_ZONE_SIZE, SPAWN_ZONE_SIZE),
      vel: randomVector(-1, 1),
      id: randomInt(0, NUM_PARTICLE_TYPE),
      radius: PARTICLE_RADIUS
    }
  }

  randomize() {
    Object.assign(this, Particle.createRandomArgs())
    this.opacity = 0
  }

  render() {
    // render happens after update, so this resets the grid
    grid = null;

    const ctx = this.engine.ctx

    this.opacity = lerp(this.opacity, this.targetOpacity, 0.1)

    ctx.globalAlpha = this.opacity
    ctx.fillStyle = PARTICLE_COLORS[this.id]
    ctx.beginPath()
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI)
    ctx.fill()
  }
}
