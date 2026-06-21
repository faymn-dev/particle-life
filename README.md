# Particle Life 

Simple interactions between particles (repulsion and attraction) and lead to interesting emergent behaviors resembling life.  

Here, my implementation is relatively simple and is not accelerated by a GPU. Only about 2,000 particles can be processed without causing intense lag.

![Preview of a collection of around 2,000 particles organizing](./assets/preview.png)

You can pan around with WASD and zoom with scrolling. Clicking will explode particles.

## Development

```bash
npm install # install dependencies
npm run dev # run development server
```

Interactions are randomized, but can be modified in `/src/engine/config.ts` 
