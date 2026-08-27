import type { Engine } from "."
import { randomId } from "./utils"

export interface ComponentArgs {
  tags?: string[]
  children?: Component[]
}

export class Component {
  // only guaranteed to exist in lifecycle methods, like mount, unmount, update and render
  engine!: Engine

  parent: Component | null = null
  components: Component[]

  __queuedForDeletion: boolean = false

  readonly id: string
  readonly tags: string[]

  constructor({ tags = [], children = [] }: ComponentArgs) {
    this.id = randomId()
    this.tags = tags
    this.components = children
  }

  append(component: Component) {
    component.parent = this
    this.engine.append(component)
    this.components.push(component)
  }

  remove(component: Component) {
    this.components = this.components.filter(child => child !== component)
    this.engine.remove(component)
  }

  /**
   * Add all existing child components that have not been added
   */
  mount() {
    for (const child of this.components) {
      // we only set parent in component.append
      // so this is a good heuristic to determine if we should add the child or not
      if (child.parent == null) {
        this.append(child)
      }
    }
  }

  /**
   * Remove all associated child components
   */
  unmount() {
    for (const child of this.components) {
      // we don't use component.remove because that filters the components list every time
      // better to just flag for deletion and then zero out the components array
      this.engine.remove(child)
    }
    this.components = []
  }

  update() { }
  render() { }
}
