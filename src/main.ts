import { Engine } from "./engine"
import "./style.css"

const engine = new Engine({
  container: document.getElementById("app")!
})

engine.start()

