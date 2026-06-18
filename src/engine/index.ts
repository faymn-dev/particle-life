import type { Component } from "./component";
import { constrain, lerp } from "./utils";
import { Vector } from "./vector";

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
  center: Vector = new Vector(0, 0);

  components: Component[] = []

  accelerateBy: number

  zoom: number = 0.5
  targetZoom: number = 0.5

  camera = new Vector(0, 0)
  targetCamera = new Vector(0, 0)

  mouse = new Vector(0, 0);
  mouseDown = false

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
      e.preventDefault()

      const zoomFactor = 1.1;
      if (e.deltaY < 0) {
        this.targetZoom = constrain(this.targetZoom * zoomFactor, 0.1, 2);
      } else {
        this.targetZoom = constrain(this.targetZoom / zoomFactor, 0.1, 2);
      }
    }, { passive: false })

    addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX
      this.mouse.y = e.clientY
    })

    addEventListener("mouseup", () => {
      this.mouseDown = false
    })

    addEventListener("mousedown", () => {
      this.mouseDown = true
    })
  }

  private resize() {
    const rect = this.container.getBoundingClientRect()
    this.width = rect.width
    this.height = rect.height
    this.center = new Vector(this.width / 2, this.height / 2)

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

  screenToWorld(screen: Vector) {
    return screen.clone().sub(this.center).div(this.zoom).add(this.camera)
  }

  start() {
    let prevMouse = this.mouse.clone()
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

      if (this.mouseDown) {
        this.targetCamera.add(prevMouse.clone().sub(this.mouse))
      }
      this.camera.moveTowards(this.targetCamera, 0.2)
      this.zoom = lerp(this.zoom, this.targetZoom, 0.2)

      for (let i = 0; i < this.accelerateBy; i++) {
        for (const component of this.components) {
          component.update()
        }
      }

      const ctx = this.ctx

      ctx.clearRect(0, 0, this.width, this.height)

      ctx.save()
      ctx.translate(this.center.x, this.center.y)
      ctx.scale(this.zoom, this.zoom)
      ctx.translate(-this.camera.x, -this.camera.y)

      for (const component of this.components) {
        ctx.save()
        component.render()
        ctx.restore()
      }
      ctx.restore()


      prevMouse = this.mouse.clone()
    }
    requestAnimationFrame(animate)
  }
}
