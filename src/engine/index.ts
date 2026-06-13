import type { Component } from "./component";

export interface EngineArgs {
  container: HTMLElement
  upscaleResolution?: number;
}

export class Engine {
  container: HTMLElement
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D

  width: number = innerWidth;
  height: number = innerHeight;
  upscaleResolution: number

  components: Component[] = []

  constructor(args: EngineArgs) {
    this.upscaleResolution = args.upscaleResolution || 1
    this.container = args.container
    this.canvas = this.container.querySelector("canvas") as HTMLCanvasElement
    this.ctx = this.canvas.getContext("2d")!
    this.mount()
  }

  private mount() {
    this.resize()
    addEventListener("resize", this.resize.bind(this))
  }

  private resize() {
    this.width = innerWidth
    this.height = innerHeight
    this.canvas.style.width = this.width + "px"
    this.canvas.style.height = this.height + "px"
    this.canvas.width = this.width * this.upscaleResolution
    this.canvas.height = this.height * this.upscaleResolution
  }

  append(component: Component) {
    component.engine = this
    this.components.push(component)
    component.mount()
  }

  remove(component: Component) {
    component.__queuedForDeletion = true
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

      for (const component of this.components) {
        component.update()
      }

      const ctx = this.ctx

      ctx.save()
      ctx.scale(this.upscaleResolution, this.upscaleResolution)
      ctx.clearRect(0, 0, this.width, this.height)
      for (const component of this.components) {
        ctx.save()
        component.render()
        ctx.restore()
      }
      ctx.restore()
    }
    requestAnimationFrame(animate)
  }
}
