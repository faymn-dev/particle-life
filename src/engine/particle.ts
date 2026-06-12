import { Component, type ComponentArgs } from "./component"
import { Vector } from "./vector"

interface ParticleArgs extends ComponentArgs {
  pos: Vector
  color: string
}

export class Particle extends Component {
  pos = new Vector()
  vel = new Vector()
  acc = new Vector()
  color: string

  constructor(args: ParticleArgs) {
    super(args)
    this.pos = args.pos
    this.color = args.color
  }

  update() {

  }

  render() {

  }
}
