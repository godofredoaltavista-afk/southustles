# PERF — presupuesto (03 §11.2) y cómo se respeta

| Recurso | Tope | Implementación |
|---|---|---|
| Renderers Three.js | 1 | `js/three/fp-field.js` sobre `#fp-gl`; el resto usa canvas 2D / SVG / CSS |
| Partículas | 6000 / 1800 mobile | campo de South Hustles |
| DPR | ≤ 1.5 pantalla completa | `fp-field.js` |
| GPU fuera de pantalla | 0 % | el loop se detiene si no hay capítulo `data-fp-gl` visible ni app abierta |
| Listeners de scroll | 1 | `js/core/fp-scroll-bus.js` (`onScrollFrame`) |
| Blur de vidrio | ≤ 12 px | ventanas y nav |
| JS inicial | chico | capítulos, vistas y Three.js por `import()`; `init()` de cada capítulo recién al acercarse |

Mediciones: pendientes (correr Performance de Chrome en desktop y en un celular de gama media; anotar acá).
