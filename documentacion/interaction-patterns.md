# Mecanismos de interacción ya construidos

> Ver también [`site-map.md`](./site-map.md) para dónde vive cada cosa en el
> flujo de la página, y [`surgical-backlog.md`](./surgical-backlog.md) para
> qué se planea hacer con cada uno de estos mecanismos.

Todo lo que ya existe y funciona en el sitio hoy — para no reconstruir nada
que ya está hecho.

## Card flip (`app/js/sh2-flip.js`)

Click en una `.holo-card` de `#work` → zoom + flip 3D a una cara trasera con
panel falso "SH-OS" (menubar tipo OS, terminal fake, telemetría con sparkline
aleatorio). Cierra con Esc, click en backdrop, o segundo click. Accesible
(teclado, `aria-expanded`).

Candidato a reemplazo: la cara trasera hoy es contenido inventado (fake
terminal/telemetry) — reemplazar por el preview real del asset (GIF/PNG/
three.js) de esa sección. Ver `surgical-backlog.md` #1.

## Hover-preview de lista de proyectos (`sh-main.js` + `preview-3d.js`)

`app/js/sh-main.js:138-178` (`initProjects()`): al pasar el mouse por un
`.project-row` en `#work`, un card (`.projects-preview`) sigue el cursor con
spring/lerp (`stiffness` 0.18, física simple: `cx += (tx - cx) * 0.18`).
Muestra un label de texto (`data-preview`, ej. `"AGENCY.GIF"`).

`app/js/preview-3d.js`: agrega DENTRO de `.projects-preview` un
`<canvas class="preview-3d">` con una escena Three.js procedural distinta por
proyecto — un objeto `BUILDERS` keyed por el mismo `data-preview`, cada uno
devuelve `{ group, update(t) }`. Ejemplos: torus knot wireframe para Agency,
point cloud ondulante para Data Symphony, icosaedro anidado para CodeCraft,
grid de cubos para Pixel Perfect, esfera con ruido para Neural Canvas, anillos
para Motion Atlas, planos superpuestos RGB para Chromatic. Un solo
`WebGLRenderer` compartido, una escena lazy-built por key (no se reconstruye
en cada hover).

No hay GIF/video real todavía — es geometría procedural pura. Foco de
`surgical-backlog.md` Workstream B: agregar una capa de banners reales
DETRÁS de esta capa three.js (no reemplazarla).

## Tilt holográfico (`app/js/holo-tilt.js`)

Tilt 3D spring-interpolated para las trading cards (`.holo-card`). El
transform va a un hijo `.hc-tilt` (no al root) para que el root conserve su
scatter/rotate estático, focus ring y sombra de piso. Variables de puntero
(`--hx/--hy/--mx/--my/--hyp`) también spring-eadas para que foil, glare y
parallax de capas usen el mismo resorte. `will-change` solo mientras está en
hover. Guard `.is-opening` para que la animación de apertura no compita con
el tilt.

## Sistema de páginas internas / "ventanas que se abren" (`app/js/sh3-pages.js`)

Overlays full-screen abiertos vía `[data-page-open]`, deep-linkeados con
`history.replaceState` a `#/works`, `#/about`, `#/project:<slug>`. Tres tipos:

- **WORKS**: grid de todas las product pages (`pw-grid`, un `.pw-card` por
  proyecto en el array `PROJECTS`).
- **ABOUT**: manifiesto + columnas de creencias + timeline.
- **PROJECT**: template por proyecto — hero, banner (`.pp-banner`, hoy
  placeholder SVG con caption "the real reel lands from Cloudflare"),
  epígrafe, bloques `01 — BRIEF / 02 — SYSTEM / 03 — OUTPUT`, botón volver a
  Works.

El array `PROJECTS` (línea 13-20 de `sh3-pages.js`) hoy tiene 6 entradas con
clientes ficticios (Marcel, Sarah, Ava...). Cerrar con Esc, click en
`data-page-close`, o el botón de cierre — usa `lockBodyScroll`/
`unlockBodyScroll` compartido con otros overlays del sitio (mismo módulo que
usa el card flip).

Estas son las "ventanas/apps" que Franco quiere seguir mejorando — ver
`surgical-backlog.md` Workstream C y backlog #2.

## Sticker room (`#stickers`)

12 PNG arrastrables (`assets/stickers/sticker-*.png`) con física de drag
propia. Patrón reusable en otras secciones — ver backlog #4 (extender a las
project pages y potencialmente al footer).

## Theme toggle

Light/dark vía `data-theme` en `<html>`. Script no-flash inline en `<head>`
(antes de cualquier CSS) que lee `localStorage` (`sh-theme` o el legacy
`leo-theme`), cae a `prefers-color-scheme` si no hay preferencia guardada, y
setea `data-theme` antes del primer paint — evita el flash de tema incorrecto.

## i18n (`app/js/i18n.js`)

Toggle de idioma ES/PT/EN vía bandera en el nav (`.lang-toggle-wrap`,
posicionado como sibling verdadero del header — no hijo — para evitar bugs de
containing block con `transform`/`translate`). Traducciones completas ya
implementadas (commit: "Language toggle: ES/PT/EN flag cycle + full
Portuguese translations").

## Patrón de asset pesado externo (Cloudflare R2)

`hands.on.mountain.glb` servido desde
`https://pub-6aa6b6baa3b043bf9598c7429620b422.r2.dev/`. En `<head>`:
`preconnect` al dominio R2 + `preload as="fetch"` del GLB, disparados antes de
que corra cualquier módulo JS. `app/js/glb-cache.js` cachea el fetch/parse una
sola vez y lo comparte entre el hero (`hero-glb.js`) y el traveler del case
study — un solo fetch, un solo parse, dos usos. Este es el patrón de
referencia para cualquier asset pesado nuevo (banners, GIF, video) que llegue
desde Canva.
