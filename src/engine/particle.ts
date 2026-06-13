import { Component, type ComponentArgs } from "./component"
import { INTERACTIONS_MATRIX, MAX_DISTANCE_MATRIX, MIN_DISTANCE_MATRIX, NUM_PARTICLE_TYPE, PARTICLE_COLORS } from "./config"
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

    for (const particle of particles) {
      if (particle === this) {
        continue
      }

      const strength = INTERACTIONS_MATRIX[this.id][particle.id] / 100
      const min = MIN_DISTANCE_MATRIX[this.id][particle.id]
      const max = MAX_DISTANCE_MATRIX[this.id][particle.id]

      const direction = particle.pos.clone().sub(this.pos)
      const dist = direction.mag()
      if (dist >= min && dist <= max) {
        this.acc.add(direction.normalize().mult(strength))
      }
    }

    this.vel.add(this.acc)
    this.pos.add(this.vel)
    this.vel.mult(0.99)
    this.acc.mult(0)

    if (this.pos.x - this.radius > this.engine.width) {
      this.pos.x = -this.radius
    }
    if (this.pos.x + this.radius < 0) {
      this.pos.x = this.engine.width + this.radius
    }
    if (this.pos.y - this.radius > this.engine.height) {
      this.pos.y = -this.radius
    }
    if (this.pos.y + this.radius < 0) {
      this.pos.y = this.engine.height + this.radius
    }
  }

  render() {
    const ctx = this.engine.ctx

    ctx.fillStyle = PARTICLE_COLORS[this.id]
    ctx.beginPath()
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI)
    ctx.fill()
  }
}
