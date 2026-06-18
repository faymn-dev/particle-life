import { Component, type ComponentArgs } from "./component"
import { INTERACTIONS_MATRIX, MAX_DISTANCE_MATRIX, MIN_DISTANCE_MATRIX, NUM_PARTICLE_TYPE, PARTICLE_COLORS, PARTICLE_RADIUS, SPAWN_ZONE_SIZE } from "./config"
import { lerp, randomInt, randomVector } from "./utils"
import { Vector } from "./vector"

interface ParticleArgs extends ComponentArgs {
  pos: Vector
  vel?: Vector
  radius: number;
  id: number;
}

let particles: Particle[] = []

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

  update() {
    if (particles.length === 0) {
      particles = this.engine.find("particle") as Particle[]
    }

    this.acc.mult(0)

    for (const particle of particles) {
      if (particle === this) {
        continue
      }

      const direction = particle.pos.clone().sub(this.pos)
      const dist = direction.mag()

      const strength = INTERACTIONS_MATRIX[this.id][particle.id]
      const min = MIN_DISTANCE_MATRIX[this.id][particle.id]
      const max = MAX_DISTANCE_MATRIX[this.id][particle.id]

      if (dist > max || Math.abs(dist) <= 0.00001) {
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
    if (this.engine.mouseDown) {
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


    // if (this.pos.x - this.radius > this.engine.width ||
    //   this.pos.x + this.radius < 0 ||
    //   this.pos.y - this.radius > this.engine.height ||
    //   this.pos.y + this.radius < 0
    // ) {
    //   this.engine.remove(this)
    //   // this.randomize()
    //   // TODO repel away from each wall
    // }
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
    const ctx = this.engine.ctx

    this.opacity = lerp(this.opacity, this.targetOpacity, 0.1)

    ctx.globalAlpha = this.opacity
    ctx.fillStyle = PARTICLE_COLORS[this.id]
    ctx.beginPath()
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI)
    ctx.fill()
  }
}
