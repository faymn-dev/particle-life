import type { Component } from "./component";
import { constrain, lerp } from "./utils";

export interface EngineArgs {
  container: HTMLElement;
  accelerateBy?: number;
}

export class Engine {
  container: HTMLElement
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D

  width: number = innerWidth;
  height: number = innerHeight;

  components: Component[] = []

  accelerateBy: number

  zoom: number = 1
  targetZoom: number = 1

  constructor(args: EngineArgs) {
    this.container = args.container
    this.accelerateBy = args.accelerateBy ?? 1

    this.canvas = this.container.querySelector("canvas") as HTMLCanvasElement
    this.ctx = this.canvas.getContext("2d")!
    this.mount()
  }

  private mount() {
    this.resize()
    addEventListener("resize", this.resize.bind(this))
    addEventListener("wheel", (e) => {
      this.targetZoom = constrain(this.container.currentCSSZoom - Math.sign(e.deltaY) / 10, 0.1, 2)
    })
  }

  private resize() {
    const rect = this.container.getBoundingClientRect()
    this.width = rect.width
    this.height = rect.height

    this.canvas.style.width = this.width + "px"
    this.canvas.style.height = this.height + "px"
    this.canvas.width = this.width
    this.canvas.height = this.height
  }

  append(component: Component) {
    component.engine = this
    this.components.push(component)
    component.mount()
  }

  remove(component: Component) {
    component.__queuedForDeletion = true
  }

  /**
   * Find a list of components by tag
   */
  find(tag: string): Component[] {
    return this.components.filter(c => c.tags.includes(tag))
  }

  start() {
    const animate = () => {
      requestAnimationFrame(animate)

      // remove components queued for deletion
      for (let i = this.components.length - 1; i >= 0; i--) {
        const child = this.components[i]
        if (child.__queuedForDeletion) {
          this.components.splice(i, 1)
          child.unmount()
        }
      }

      this.zoom = lerp(this.zoom, this.targetZoom, 0.2)
      this.container.style.zoom = `${this.zoom}`

      for (let i = 0; i < this.accelerateBy; i++) {
        for (const component of this.components) {
          component.update()
        }
      }

      const ctx = this.ctx

      ctx.clearRect(0, 0, this.width, this.height)
      for (const component of this.components) {
        ctx.save()
        component.render()
        ctx.restore()
      }
    }
    requestAnimationFrame(animate)
  }
}
