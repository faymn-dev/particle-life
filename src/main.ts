import { Engine } from "./engine"
import { Particle } from "./engine/components/particle"
import { Wall } from "./engine/components/wall"
import { NUM_PARTICLES, WALL_WIDTH, WALL_HEIGHT, WALL_THICKNESS } from "./engine/config"
import { Vector } from "./engine/vector"
import "./style.css"

const engine = new Engine({
  container: document.getElementById("app")!,
})

for (let i = 0; i < NUM_PARTICLES; i++) {
  engine.append(new Particle(Particle.createRandomArgs()))
}

engine.append(new Wall({ pos: new Vector(0, -WALL_HEIGHT), width: WALL_WIDTH * 2, height: WALL_THICKNESS }))
engine.append(new Wall({ pos: new Vector(0, WALL_HEIGHT), width: WALL_WIDTH * 2, height: WALL_THICKNESS }))
engine.append(new Wall({ pos: new Vector(-WALL_WIDTH, 0), width: WALL_THICKNESS, height: WALL_HEIGHT * 2 }))
engine.append(new Wall({ pos: new Vector(WALL_WIDTH, 0), width: WALL_THICKNESS, height: WALL_HEIGHT * 2 }))

engine.start()

