import { Engine } from "./engine"
import { Particle } from "./engine/components/particle"
import { Wall } from "./engine/components/wall"
import { NUM_PARTICLES, WALL_WIDTH, WALL_HEIGHT, WALL_THICKNESS, randomizeConfig } from "./engine/config"
import { randomUtils } from "./engine/random-utils"
import { Vector } from "./engine/vector"
import "./style.css"

// run simulation
const engine = new Engine({
  container: document.getElementById("app")!,
})

addComponents()
engine.start()

function addComponents() {
  randomUtils.restoreState()
  for (let i = 0; i < NUM_PARTICLES; i++) {
    engine.append(new Particle(Particle.createRandomArgs()))
  }
  engine.append(new Wall({ pos: new Vector(0, -WALL_HEIGHT), width: WALL_WIDTH * 2, height: WALL_THICKNESS }))
  engine.append(new Wall({ pos: new Vector(0, WALL_HEIGHT), width: WALL_WIDTH * 2, height: WALL_THICKNESS }))
  engine.append(new Wall({ pos: new Vector(-WALL_WIDTH, 0), width: WALL_THICKNESS, height: WALL_HEIGHT * 2 }))
  engine.append(new Wall({ pos: new Vector(WALL_WIDTH, 0), width: WALL_THICKNESS, height: WALL_HEIGHT * 2 }))
}

// options
const optionSeed = document.getElementById("seed")!
const optionRestart = document.getElementById("restart")!
const optionRandom = document.getElementById("random")!

optionSeed.addEventListener("click", () => {
  navigator.clipboard.writeText(window.location.href);
})

optionRestart.addEventListener("click", () => {
  engine.nuke()
  addComponents()
})

optionRandom.addEventListener("click", () => {
  engine.nuke()
  randomUtils.setRandomSeed()
  randomizeConfig()
  updateSeed()
  addComponents()
})

updateSeed()

function updateSeed() {
  optionSeed.textContent = randomUtils.getSeed().toString().padStart(4, "0")
  window.location.hash = randomUtils.getSeed().toString()
}
