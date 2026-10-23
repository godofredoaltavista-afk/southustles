# PORTED — pieza → origen → qué se cambió

Copias sin editar (con cabecera de procedencia) en `reference/francoprofile-vendor/<repo>/<ruta>` (código estudiado: nunca se deploya). Las adaptaciones viven en `js/**/fp-*.js` y `css/fp-*.css`.

| Pieza | Origen | Adaptado en | Cambios |
|---|---|---|---|
| Tokens gemelos + polos + inversión | S4 `css/tokens.css` | `css/fp-tokens.css` | prefijo `--fp-*`, acento terracota, escala z-index/`--k` de S6, tintas MOOD |
| No-flash + tema + wipe circular | S4 `index.html <head>`, `js/theme.js`, `css/motion.css §2` | `index.html`, `js/core/fp-theme.js`, `css/fp-chrome.css` | clave `fp.theme`, evento `fp-theme-changed`, tema por vista de S3 |
| Env guards | S4 `js/env.js` | `js/core/fp-env.js` | + `LS`, `onVisible`, modo calmo |
| Scroll lock con contador | S4 `js/scroll-lock.js` | `js/core/fp-scroll-lock.js` | casi literal |
| Bus único de scroll | S6 `lib/scroll.ts` | `js/core/fp-scroll-bus.js` | vanilla + velocidad de scroll + progreso interno |
| Loader 5 columnas + contador | S4 `css/motion.css §1`, `js/intro.js` | `js/ui/fp-chrome.js`, `css/fp-chrome.css` | progreso real con piso de 900 ms |
| Nav píldora + detach | S4 `.site-nav`, `initNavDetach` | `fp-chrome.*` | scroll-spy por grupos; se esconde al bajar |
| Menú full-screen + trampa de foco | S4 `initMenuOverlay` + S6 `MenuOverlay.tsx` | `fp-chrome.*` | círculo desde el botón, links numerados escalonados, capítulos + vistas |
| Theme-strip | S4 `sh2-theme.css`, `sh2-lines.js` | `fp-chrome.*` | un segmento por capítulo, mood en gradiente |
| Botones: barrido, direccional, imán | S4 `motion.css §3`, `sh2-fx.js` | `css/fp-base.css`, `js/ui/fp-ui.js` | mismos valores (radio 60, rigidez .12, tope 12 px, `translate`) |
| Tilt holográfico con spring | S4 `holo-tilt.js` | `js/ui/fp-ui.js tilt()` | variables `--fp-h*` |
| Medidor conic sin canvas | S6 `ui/ScoreGauge.tsx/.css` | `css/fp-base.css .fp-gauge`, `fp-ui.js gauge()` | + banda objetivo |
| Reveal con stagger que no se des-revela | S5 `components/ScrollTrigger.js` + S4 `reveal.js` | `fp-ui.js reveal()/counters()` | `data-fp-*` |
| LED 5×7 | S3 `ui/led.js` | `js/ui/fp-led.js` | + letras |
| Esqueleto / formatos de sesión | S3 `pose/skeleton-map.js`, `session/*` | `js/features/fp-motionlab.js`, `data/joints.json` | normalizador de 2 formatos + métricas + reproductor 2D |
| Workspace de ventanas, onboarding, Inicio/Estudio, particleWord | S3 `ui/{windows,onboarding,home,studio,intro}.js`, `css/v3.css` | `js/ui/fp-windows.js`, `js/features/{fp-app,fp-onboarding}.js`, `js/views/*`, `js/three/fp-particle-word.js` | ver informes de los agentes APP-1 / THREE |
| Campo magnético + SceneManager | S4 `sh2-three.js` | `js/three/fp-field.js` | cuerpo de partículas del boxer.json, modos G/Z/H/F |
| NavHUD + telemetría, cursor 3 capas | S5 `NavHUD.js`, `shared-layout.js` | `js/ui/{fp-hud-drive,fp-cursor}.js` | telemetría de Franco (CAP, SCR, SEM, SES, RACHA) |
| HUD de color 3 puntos | S4 `sh-main.js initColorHud`, `sh3-hud.js` | `js/ui/fp-color-hud.js` | `--fp-accent*`, `fp.hud.colors` |
| Lista de trabajos con preview CRT, case cards | S4 `initProjects`, `preview-3d.js`, `initHoloTeasers` | `js/sections/mood-{works,cases}.js` | contenido de Franco; asset en canvas 2D |
| Dither, cielo, texto de cine | S6 `ui/fx/dither.ts`, `screens/Cielo.tsx`, `styles/editorial.css` | `js/sections/mood-{dither,cielo}.js` | vanilla |
