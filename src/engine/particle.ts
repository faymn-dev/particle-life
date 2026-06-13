import { Component, type ComponentArgs } from "./component"
import { Vector } from "./vector"

interface ParticleArgs extends ComponentArgs {
  pos: Vector
  vel?: Vector
  color: string
  radius: number;
}

export class Particle extends Component {
  pos: Vector
  vel: Vector
  acc = new Vector()
  color: string
  radius: number

  constructor(args: ParticleArgs) {
    super(args)
    this.pos = args.pos
    this.vel = args.vel || new Vector()
    this.color = args.color
    this.radius = args.radius
  }

  update() {
    this.vel.add(this.acc)
    this.pos.add(this.vel)
    this.vel.mult(0.99)

    this.acc.mult(0)
  }

  render() {
    const ctx = this.engine.ctx

    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI)
    ctx.fill()
  }
}
