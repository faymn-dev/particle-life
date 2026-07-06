import { Component, type ComponentArgs } from "../component";
import type { Vector } from "../vector";

interface WallArgs extends ComponentArgs {
  pos: Vector;
  width: number;
  height: number;
}

export class Wall extends Component {
  pos: Vector;
  width: number;
  height: number;

  constructor(args: WallArgs) {
    super({
      ...args,
      tags: ["wall"]
    })

    this.pos = args.pos
    this.width = args.width
    this.height = args.height
  }

  render() {
    const ctx = this.engine.ctx
    ctx.fillStyle = "white"
    ctx.translate(this.pos.x, this.pos.y)
    ctx.translate(-this.width / 2, -this.height / 2)
    ctx.fillRect(0, 0, this.width, this.height)
  }
}
