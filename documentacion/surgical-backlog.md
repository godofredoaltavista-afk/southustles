# Backlog quirúrgico — workstreams activos + backlog vivo

> Este es el único de los cuatro documentos de `documentacion/` pensado para
> editarse cada sesión. Ver [`site-map.md`](./site-map.md) para el mapa de
> secciones, [`interaction-patterns.md`](./interaction-patterns.md) para los
> mecanismos ya construidos, y [`workflow-flow.md`](./workflow-flow.md) para
> la metodología de análisis y el flujo de iteración (FLOW) acordado con
> Franco. Última actualización: 2026-08-10.

---

## Workstreams activos (ya verificados, listos para ejecutar)

### A. Ocultar el Quick Panel, dejar el menú full-screen como único

- **Botón disparador**: `app/index.html:104`
  ```html
  <button type="button" class="pill-btn pill-btn--plus" data-panel-open aria-label="Open quick panel" aria-expanded="false">
    <span class="plus-glyph">+</span>
  </button>
  ```
  Único elemento a ocultar del nav — no el `#quick-panel` en sí.
- **El panel completo** (`app/index.html:159-226`): `.quick-panel__backdrop` +
  `<aside id="quick-panel">` — queda intacto en el DOM, oculto vía CSS.
- **JS que lo maneja**: `initQuickPanel` en `app/js/sh2-fx.js`, orquestado
  desde `sh2-main.js` — no requiere cambios.
- **Menú a pulir**: `#menu-overlay` (`app/index.html:136-153`) — 8 links +
  footer con mail/ubicación/copyright. Detalle de pulido (spacing, tipografía,
  orden de links) a definir cuando Franco traiga referencias concretas.
- **Estado**: no ejecutado todavía.

### B. Preview banners reales en `#work`

- **HTML de la lista**: `app/index.html:515-580` (`.projects-list` →
  `.projects-preview` vacío + 7× `.project-row[data-preview="X.GIF"]`).
- **Mecanismo de seguimiento del mouse ya existente**:
  `app/js/sh-main.js:138-178` (`initProjects()`) — spring/lerp sobre
  `left`/`top`, patrón a reusar para la nueva capa de banners.
- **Capa three.js existente** (a NO tocar, queda por delante):
  `app/js/preview-3d.js` — `BUILDERS` object por `data-preview` key, geometría
  procedural wireframe en `<canvas class="preview-3d">`.
- **CSS relevante**: `app/css/south-hustles.css:598-698`. Nueva capa de
  banners con `z-index` menor a `.projects-preview` (1) pero mayor al fondo de
  `.project-row`, para quedar detrás del three.js, no encima.
- **Assets**: hoy son placeholders (`assets/projects/*.svg`). Cuando lleguen
  los GIF/video de Canva, seguir el patrón R2 ya validado en el sitio.
- **Estado**: no ejecutado todavía.

### C. Project page — banner real + scroll editorial disruptivo

- **Archivo**: `app/js/sh3-pages.js` — template compartido por las 6 project
  pages (`PROJECTS` array línea 13-20; `projectInner()` línea 67-83).
- **Banner a reemplazar**: `.pp-banner` (línea 73-76), hoy `<img src="${p.art}">`
  SVG placeholder + figcaption que anuncia que es provisorio. Slot
  `data-cf-asset="project-gif-${p.slug}"` ya marcado.
- **Dónde va el scroll editorial nuevo**: entre `.pp-epigraph` (línea 77) y
  `.pp-blocks` (línea 78-82). Reusar el patrón de `#case-study`
  (`app/index.html:709-794`, `.case__fig` con `data-plx`,
  `.case__block--right`) en vez de crear uno nuevo. Sumar stickers
  arrastrables (patrón de `#stickers`) para el tratamiento "disruptivo".
- Pieza más grande de las tres: decidir si las project pages pasan a usar el
  markup de `.case` directamente, o si se porta solo el patrón visual.
- **Estado**: no ejecutado todavía.

---

## Backlog vivo — se va sumando a medida que lleguen assets/instrucciones

### 1. Menú flip (`#work` holo-cards) — preview real del asset al girar la carta
Hoy `sh2-flip.js` abre un panel falso "SH-OS" al hacer click en una
`.holo-card`. Reemplazar ese contenido falso por el preview real del asset
(GIF/PNG/three.js) de esa sección, cargado al costado del card flippeado.
Distinto del Workstream B (que es sobre la lista de proyectos, no las
holo-cards).

### 2. Proyectos nuevos a sumar — copy real de clientes reales
Hoy `PROJECTS` en `sh3-pages.js:13-20` tiene 6 entradas con clientes
ficticios (Marcel, Sarah, Ava...). Franco tiene un historial real de clientes
y proyectos (campañas tier-1 en Argentina, dirección de arte, marcas de
dropshipping pautadas en el exterior, ~20-30 videos editados en Premiere
entre bodas y bandas) — el copy de esta sección debe eventualmente reflejar
eso, no portfolio inventado. Requiere que Franco compile/recopile la lista de
clientes y proyectos activos que quiere mostrar — no es algo que se pueda
inventar por el agente. Cuando llegue esa lista, sumar cada proyecto real
requiere tocar en paralelo:
- `app/js/sh3-pages.js` — nueva entrada en `PROJECTS`.
- `app/index.html:515-580` — nueva `.project-row[data-preview="X.GIF"]`.
- `app/js/preview-3d.js:20-138` — nuevo builder en `BUILDERS`, o reusar uno
  existente.
- Opcional: nueva `.holo-card` en `holo-teaser-row`
  (`app/index.html:583-608`).

**Tono de copy**: registro de agencia — directo, seguro de su propio nivel
("lo que sabemos hacer, por encima del promedio"), sin caer en el genérico de
portfolio-template. Ejemplo de la voz ya validada en el sitio: el propio
`studio-manifesto` (`app/index.html:463-467`) — "born between the sierra and
the sea, built for everywhere" — ese registro, no el de placeholder.

### 3. Banners personalizables resize (Canva Pro)
Dos formatos base:
- **Horizontal ancho**: tipo footer/header con degradé de un color, banner
  arriba, tal como las referencias que Franco mencionó tener.
- **Full-page / vertical "giro"**: formato alto, para sección tipo cover o
  transición entre bloques.
Sin dimensiones exactas todavía — a definir en px cuando Franco traiga el
primer export de Canva. Destino técnico: patrón R2/Cloudflare, no commitear
binarios pesados al repo.

### 4. Stickers chicos
Patrón ya construido en `#stickers`. Candidato a extender a: el scroll
editorial de las project pages (Workstream C) y potencialmente el footer.

### 5. Copy pass — auditoría de repetición
Placeholders identificados, listos para reemplazo:
- `.case__others` y bloques del case-study — copy marcado "real copy
  pending" en el propio archivo.
- `PROJECTS` en `sh3-pages.js` — clientes ficticios, ver backlog #2.
- `#canopy` — placeholder explícito "PROYECTO REUNALT 4".
Franco además pidió específicamente auditar texto repetido entre secciones
(ej. menciones de "designer" repetidas) — pendiente de pasada dedicada,
sección por sección, comparando contra `site-map.md` para no revisar dos
veces lo mismo.

### 6. Conexiones
Dos lecturas válidas, aclarar cuál (o ambas) cuando se llegue:
- **(a) Conectores visuales entre secciones**: banners/backgrounds de
  transición entre una sección y la siguiente.
- **(b) Cross-links al ecosistema de Franco**: Ant on Mars, Apacheta backend,
  GitHub, LinkedIn. El footer (`app/index.html:1259-1301`) tiene links a `#`
  sin destino real — punto de entrada natural.

### 7. Reorder "mejores secciones arriba"
Alcance sin definir todavía: ¿solo dentro de `#work` (reordenar los 7
`project-row`), o todo el sitio (impacta anclas/IDs/nav)? Se resuelve cuando
Franco señale cuáles considera las secciones más fuertes.

### 8. SVG personalizados de cards / íconos
Hoy `app/assets/icons/*.svg` y `app/assets/cards/*.svg` son genéricos.
Candidatos a reemplazo cuando Franco traiga versiones personalizadas desde
Canva/Figma.

---

## Cómo se ejecuta esto (multi-agente)

Ejecución por defecto: **un agente por workstream, en paralelo**, ya que
A/B/C tocan archivos mayormente distintos. Excepción a vigilar: varios ítems
del backlog (2, 5) tocan el mismo `sh3-pages.js` que el Workstream C — esos
se secuencian entre sí para evitar conflictos de edición simultánea.

---

## Verificación

- Servir `app/` local y comparar contra `southustles.com` en vivo, sección
  por sección, después de cada workstream.
- Quick Panel: confirmar que el botón `+` ya no aparece en el nav, pero que
  `#quick-panel` sigue en el DOM (devtools).
- `#work`: hover sobre cada `.project-row`, confirmar que el three.js sigue
  funcionando Y que la nueva capa de banners aparece detrás, sigue el mouse
  con el mismo lerp, y no rompe z-index de holo-cards/discover-btn.
- Project page: abrir cada `#/project:<slug>` (6 hoy, más los que se sumen),
  confirmar banner nuevo y scroll accesible (texto real, no solo imágenes).
- Al sumar un proyecto nuevo: confirmar que aparece consistente en los 3-4
  puntos de contacto (PROJECTS array, project-row, preview-3d builder,
  holo-card opcional).
- Antes de cualquier PR: `git status` + `git diff` completo, confirmar que
  ninguna clase CSS o bloque JS de una sección existente fue borrado sin que
  Franco lo haya pedido explícitamente.
