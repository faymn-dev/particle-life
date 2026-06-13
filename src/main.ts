import { Engine } from "./engine"
import { Particle } from "./engine/particle"
import { random } from "./engine/utils"
import { Vector } from "./engine/vector"
import * as config from "./engine/config"
import "./style.css"

const engine = new Engine({
  container: document.getElementById("app")!
})

for (let i = 0; i < 3000; i++) {
  engine.append(new Particle({
    pos: new Vector(random(0, engine.width - config.PARTICLE_RADIUS), random(0, engine.height - config.PARTICLE_RADIUS)),
    vel: new Vector(random(-1, 1), random(-1, 1)),
    color: "red",
    radius: config.PARTICLE_RADIUS
  }))
}

engine.start()

