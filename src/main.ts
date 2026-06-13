import { Engine } from "./engine"
import { Particle } from "./engine/particle"
import { random, randomInt } from "./engine/utils"
import { Vector } from "./engine/vector"
import * as config from "./engine/config"
import "./style.css"

const engine = new Engine({
  container: document.getElementById("app")!,
})

for (let i = 0; i < config.NUM_PARTICLES; i++) {
  engine.append(new Particle({
    pos: new Vector(random(0, engine.width - config.PARTICLE_RADIUS), random(0, engine.height - config.PARTICLE_RADIUS)),
    vel: new Vector(random(-1, 1), random(-1, 1)),
    radius: config.PARTICLE_RADIUS,
    id: randomInt(0, config.NUM_PARTICLE_TYPE)
  }))
}

engine.start()

