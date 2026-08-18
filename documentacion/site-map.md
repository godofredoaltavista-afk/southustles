# Mapa completo del sitio South Hustles

> Ver también [`interaction-patterns.md`](./interaction-patterns.md) (hovers,
> flips, mecanismos ya construidos), [`workflow-flow.md`](./workflow-flow.md)
> (metodología de análisis + flujo de iteración),
> [`surgical-backlog.md`](./surgical-backlog.md) (workstreams activos +
> backlog vivo — el documento que se edita cada sesión) y
> [`notas-creativas-handoff.md`](./notas-creativas-handoff.md) (handoff
> completo de la sección `#notas` — el motor Excalidraw embebido dentro de
> `#journal`, su propio documento porque es la pieza más grande e iterada
> del repo).

Repo real: `southustles/` (el único con `.git`, remote
`https://github.com/godofredoaltavista-afk/southustles`, deploy en
`southustles.com` vía S3+CloudFront+Terraform, PR-only a `main`). Frontend
completo en `app/index.html` (un solo HTML, sin build step, vanilla JS con
`<script type="module">`, Three.js vía import maps/CDN).

CSS modular en `app/css/` (orden de `<link>` importa por cascada — `tokens.css`
primero, `sh3.css` al final). JS por feature en `app/js/`, importado desde 3
orquestadores: `sh-main.js`, `sh2-main.js`, `sh3-main.js`.

---

## Secciones, en orden real de aparición en `index.html`

| # | `id` | Qué es | Notas de estado / interacción |
|---|---|---|---|
| — | `#loader` | Pantalla de carga con shader Three.js (`sh3-loader.js`) | Preload de módulo disparado desde `<head>` para que el blob esté listo antes de que el loader aparezca |
| — | nav / `#menu-overlay` | Header fijo + menú full-screen (Home/About/University + Works/Menu/+/theme) | **Único menú a conservar** — ver `surgical-backlog.md` Workstream A |
| — | `#quick-panel` | Drawer lateral (botón `+`): índice rápido, "latest projects", slot `hands-mountain-glb`, text-size stepper | **A ocultar sin borrar** — ver Workstream A |
| `#hero` | Hero | Canvas GLB de fondo (`hero-glb.js`) + headline "Creative Systems for a Conscious Era" | GLB compartido con case study vía `glb-cache.js` (un solo fetch/parse) |
| `#live-system` | Live System | 2 cards + constelación SVG de nodos conectados | — |
| `#statement-1` | Big Statement | Thesis principal — movida arriba a pedido explícito de Franco (comentario en el propio código) | — |
| `#perspective` | Perspective (Star Wars) | GIF `hands-eyes.gif` + texto grande | Movida antes de Ecosystem a pedido de Franco |
| `#ecosystem` | Ecosystem Cards | 3 cards: South Hustles / Cusa System / Visualizing Wisdom | Candidata a banner cuadrado arriba de cada título (backlog) |
| `#stickers` | Sticker Room | Physics toy, 12 stickers PNG arrastrables | Patrón reusable — ver backlog #4 |
| `#about` | About/Story | Editorial de 2 columnas | — |
| `#studio-manifesto` | Studio Manifesto | Lede + 3 columnas + timeline 2012→NOW + nota margen | — |
| `#work` | Projects/Work | Lista de 7 proyectos + 3 `.holo-card` | **Foco de Workstreams B y C, backlog #1 y #2** |
| `#ig-feed` | From The Feed | 3 banners estilo IG (1 wide + 2 compactos) | Ya tiene fallback `onerror` si falta el asset — buen patrón para banners nuevos |
| `#reel` | Reel horizontal | Scroll-jacked strip de 6 paneles | — |
| `#case-study` | Case Study (Data Symphony) | Template completo: hero, 3 bloques narrativos, banner parallax, stats, otros proyectos | Marcado como TEMPLATE en el propio código — fuente del patrón a portar a las project pages (Workstream C) |
| `#statement-2` | Big Statement 2 + Pixelated | Segunda thesis + bloque "Pixelated everything" | — |
| `#magnetic` | Magnetic field | Three.js canvas de partículas reactivas al cursor | Slot `hands-mountain-glb` de fondo |
| `#university` | University | 4 tiles de color (red/amber/green/blue) | — |
| `#gravity` | Gravity | Three.js canvas, frames de proyecto flotando | — |
| `#canopy` | Canopy | Three.js hojas proceduales | **Placeholder explícito**: "PROYECTO REUNALT 4", comentario propio dice reemplazar cuando se confirme el proyecto real — backlog #5 |
| `#canopy-reveal` | Canopy Reveal | 3 "beats" de journey narrativo | También placeholder |
| `#journal` | Journal | 6 cards con notas expandibles + "DNA strip" que acumula highlights + sub-sección `#notas` ("Notas Creativas") | Copy ya real y terminado. `#notas` es un bocetador Excalidraw embebido completo — ver [`notas-creativas-handoff.md`](./notas-creativas-handoff.md), no releer `sh4-notas.js` desde cero |
| `#systems` | Systems/Stack | Glass-grid de 6 cards (Creative Direction, TouchDesigner, Web Dev, Creative Coding, Branding, Advertising) | — |
| `#contact` | Contact form | Budget pills + vector chips + form | — |
| `#footer` | Footer | Mega-footer: newsletter, trust stats, social links | Links a `#` sin destino real (Terms, LinkedIn) — punto de entrada para backlog #6b |

---

## Assets

- **Locales**: `app/assets/` — SVG de cards/projects/icons, GIF de
  "perspective", stickers PNG, `hero.glb`, favicon.
- **Pesados externos**: patrón Cloudflare R2 ya andando —
  `hands.on.mountain.glb` servido desde
  `https://pub-6aa6b6baa3b043bf9598c7429620b422.r2.dev/`, cacheado en
  `glb-cache.js`, reusado por hero y case study. Replicar este patrón cuando
  lleguen banners/GIF pesados de Canva — no commitear binarios al repo.
- **Slots ya reservados para asset-swap** (`data-cf-asset="..."`, hoy
  resolviendo a placeholders): `hands-mountain-glb`,
  `project-gif-<slug>`, `case-banner-<slug>`. Falta el JS que efectivamente
  lea `data-cf-asset` y haga el swap — hoy es solo el marcador en el markup.
