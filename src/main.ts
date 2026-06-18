import { Engine } from "./engine"
import { Particle } from "./engine/particle"
import { random, randomInt } from "./engine/utils"
import { Vector } from "./engine/vector"
import { NUM_PARTICLES, NUM_PARTICLE_TYPE, PARTICLE_RADIUS } from "./engine/config"
import "./style.css"

const engine = new Engine({
  container: document.getElementById("app")!,
  accelerateBy: 2
})

for (let i = 0; i < NUM_PARTICLES; i++) {
  engine.append(new Particle({
    pos: new Vector(random(0, engine.width - PARTICLE_RADIUS), random(0, engine.height - PARTICLE_RADIUS)),
    vel: new Vector(random(-1, 1), random(-1, 1)),
    radius: PARTICLE_RADIUS,
    id: randomInt(0, NUM_PARTICLE_TYPE)
  }))
}

engine.start()

