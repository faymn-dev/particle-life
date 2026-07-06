import { isApproxEqual } from "./utils";
import { Vector } from "./vector";

export class Mouse extends Vector {
  down = false
  dragging = false

  private __prevPos = new Vector()

  get delta() {
    return this.__prevPos.clone().sub(this)
  }

  update() {
    this.dragging = false
    if (this.down) {
      this.dragging = !(isApproxEqual(0, this.delta.mag()))
    }

    this.__prevPos = new Vector(this.x, this.y)
  }

  mount() {
    addEventListener("mousemove", (e) => {
      this.x = e.clientX
      this.y = e.clientY
      if (this.__prevPos.x === 0 && this.__prevPos.y === 0) {
        this.__prevPos.x = this.x
        this.__prevPos.y = this.y
      }
    })

    addEventListener("mouseup", () => {
      this.down = false
    })

    addEventListener("mousedown", () => {
      this.down = true
    })
  }
}
