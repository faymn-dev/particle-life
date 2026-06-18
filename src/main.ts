import { Engine } from "./engine"
import { Particle } from "./engine/particle"
import { NUM_PARTICLES } from "./engine/config"
import "./style.css"

const engine = new Engine({
  container: document.getElementById("app")!,
  accelerateBy: 2
})

for (let i = 0; i < NUM_PARTICLES; i++) {
  engine.append(new Particle(Particle.createRandomArgs(engine.center)))
}

engine.start()

