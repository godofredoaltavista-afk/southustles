# Notas Creativas — handoff completo (motor de dibujo Excalidraw embebido)

> Ver también [`site-map.md`](./site-map.md) (mapa general del sitio),
> [`workflow-flow.md`](./workflow-flow.md) (metodología + FLOW general del
> repo) y [`surgical-backlog.md`](./surgical-backlog.md) (backlog de otras
> secciones). Este documento es específico de **una sola feature** — la
> sección `#notas` ("Notas Creativas" / "clase") — porque es, con diferencia,
> la pieza más grande y más iterada del repo hasta ahora, y necesita su
> propio contexto para que una sesión nueva no tenga que releer 2100 líneas
> de JS a ciegas. Último estado documentado: 2026-08-17, sesión maratónica de
> una tarde completa ("dale, ponete a todo orto").

**Estado del repo en este momento**: todo lo de este documento está
**sin commitear**. `git status` en `southustles/` muestra `app/index.html`
modificado y `app/css/sh4-notas.css`, `app/js/sh4-notas.js`,
`app/js/sh4-main.js`, `app/media/`, `app/vendor/notas/` como untracked. No
commitear ni pedir PR hasta que Franco lo pruebe en vivo y dé el
"super confirmado" — mismo criterio que el resto del repo
(ver `workflow-flow.md`, sección FLOW).

---

## 1. Qué es esto, en una frase

Un bocetador/pizarra online — "mi propio Figma", en palabras de Franco —
embebido en la sección `#notas` del sitio. No es un dibujo suelto: el
concepto de producto es **la "clase"** — una sesión con cronómetro y
contador de centímetros de pincel, que al cerrarse muestra un resumen y
queda guardada como una tarjeta con miniatura en una grilla, como un mini
Notion/Figma/Slack de bocetos.

El motor de dibujo es **Excalidraw real**, no una imitación — la prueba
está en `package.json`: usa `@atyrode/excalidraw`, un fork mantenido
específicamente para [pad.ws](https://pad.ws) (whiteboard-as-IDE de código
abierto, referenciado por Franco como punto de partida). De pad.ws se tomó
**solo el motor**, no la infraestructura — pad.ws necesita Postgres, Redis,
Keycloak y Coder (para terminales/VS Code en la nube) porque es un IDE
completo; acá no hace falta nada de eso, así que se construyó un embed
propio, liviano, con toda la interfaz rehecha en el lenguaje visual de
South Hustles.

---

## 2. Arquitectura — dos repos, una feature

Hay **dos carpetas distintas** involucradas, con una relación de build:

### A. `pad/viewer/` — la fuente del motor (React + Vite)

`D:\ANTS on MARS\South Hustles\pad\viewer\`

- Proyecto Vite + React 19 standalone, **no es parte del repo de git de
  southustles**. Vive fuera, es solo la fuente de build del motor.
- Pieza clave: [`src/notas-embed.tsx`](../../pad/viewer/src/notas-embed.tsx)
  — un wrapper *deliberadamente fino* alrededor de `<Excalidraw>`. Expone
  `mountNotas(container, opts)` que monta el canvas real de Excalidraw
  dentro de cualquier `<div>`, más las funciones públicas del motor que la
  UI vanilla necesita:
  `FONT_FAMILY, ROUNDNESS, exportToBlob, convertToExcalidrawElements,
  viewportCoordsToSceneCoords`.
- Build: `npm run build:notas` (usa
  [`vite.notas.config.mts`](../../pad/viewer/vite.notas.config.mts), que
  compila TODO —React, Excalidraw, todo— en **un solo archivo ESM sin
  code-splitting**, porque el sitio destino no tiene `node_modules` ni build
  step propio).
- **Output**: `southustles/app/vendor/notas/notas.js` (~10MB, ~2.7MB
  gzipeado) + `notas.css` (~250KB).
- ⚠️ **Gotcha real, mordió varias veces esta sesión**: el build usa
  `emptyOutDir: true`, así que cada `npm run build:notas` **borra la
  carpeta `fonts/`** que las tipografías de Excalidraw necesitan en
  runtime. Después de CADA build hay que correr:
  ```bash
  cp -r pad/viewer/node_modules/@atyrode/excalidraw/dist/prod/fonts \
        southustles/app/vendor/notas/
  ```
  Si te olvidás esto, el motor carga pero el texto se ve con la fuente de
  fallback del sistema en vez de Excalifont/Virgil/etc.

### B. `southustles/app/` — el sitio real, donde vive todo lo visible

- [`app/index.html`](../app/index.html) — sección `#notas` (buscar
  `data-notas`), dentro del `#journal` (la sección de "field notes" ya
  existente, DNA strip, etc.). Dos botones estáticos:
  `data-notas-new` ("Entrar a la clase") y `data-notas-import`
  ("Importar clase"), más `data-notas-list` (la grilla de tarjetas) y
  `data-notas-empty` (estado vacío).
- [`app/css/sh4-notas.css`](../app/css/sh4-notas.css) — **1501 líneas**,
  todo el look del estudio: fondo, dock, panel, tarjetas, cuentagotas,
  pinceles, capas, reporte de cierre.
- [`app/js/sh4-notas.js`](../app/js/sh4-notas.js) — **2130 líneas**, toda la
  lógica. Un solo archivo grande a propósito (la alternativa —
  fragmentarlo en 8 módulos como el resto del sitio hace con `sh2-*.js`—
  se consideró pero no se hizo por la velocidad de iteración de esta
  sesión; es candidato a refactor futuro, ver sección 8).
- [`app/js/sh4-main.js`](../app/js/sh4-main.js) — orquestador mínimo (19
  líneas), sigue el mismo patrón que `sh-main.js`/`sh2-main.js`/
  `sh3-main.js`: `initNotas()` en `DOMContentLoaded`. Importado al final de
  `index.html`, **después** de `sh3-main.js`.
- `app/media/notas-bg-a.mp4` / `notas-bg-b.mp4` — los dos videos de fondo
  que Franco dejó en `pad/anim-06_v1.mp4` / `anim-07_v1.mp4`, copiados acá.
- `app/vendor/notas/` — el motor compilado (ver arriba). **No se edita a
  mano nunca** — cualquier cambio de comportamiento del motor en sí (no de
  la interfaz alrededor) requiere tocar `notas-embed.tsx` y rebuildear.

### Cómo se sirve en local

El sitio entero es estático (`python -m http.server` desde `app/`, sin
build step — ver `app/serve.sh`). El motor de notas es la única pieza con
un paso de compilación previo, y ese paso ya está hecho (el `.js`
compilado está en el repo, sin trackear todavía). Para levantar todo:

```bash
cd southustles/app
python -m http.server 8090   # cualquier puerto libre
```

Abrir `http://localhost:PUERTO/#notas`.

**Si el motor cambia** (tocás `notas-embed.tsx`):
```bash
cd pad/viewer
npm run build:notas
cp -r node_modules/@atyrode/excalidraw/dist/prod/fonts app/../southustles/app/vendor/notas/
# (ajustar el path relativo real, ver arriba)
```

---

## 3. Decisiones de arquitectura — el "por qué", no solo el "qué"

Estas son las reglas que esta sesión aprendió **rompiendo cosas primero**.
Ignorarlas rompe el dibujo otra vez.

### 3.1 El motor queda 100% stock — nunca se parchea el paquete

Filosofía explícita de Franco desde el principio: *"solo vamos a cambiar la
interfaz"*. Todo lo visible que no es el lienzo de Excalidraw en sí —
dock, panel, tarjetas, cuentagotas — es HTML/CSS/JS vanilla nuestro,
inyectado y cableado desde **afuera** vía la API imperativa de Excalidraw
(`ExcalidrawImperativeAPI`: `updateScene`, `setActiveTool`,
`getSceneElements`, `getAppState`, `addFiles`, `getFiles`,
`scrollToContent`).

### 3.2 REGLA DE ORO: nunca re-parentar un nodo que React controla

Esto rompió el dibujo **dos veces** en la misma sesión, de dos formas
distintas:

1. **Primer intento**: mover el panel de propiedades nativo de Excalidraw
   (`.App-menu__left`) DENTRO de nuestro panel con `appendChild` directo.
   React re-renderiza ese nodo en cada cambio de selección; cuando lo
   hace, intenta insertar hijos nuevos en el padre VIEJO (el nuestro, no
   el suyo) y tira `NotFoundError` en `insertBefore` — **eso tumba todo el
   árbol de React, canvas incluido**. Sin canvas, no hay dibujo.
2. **Fix real**: nunca mover el `.App-menu__left` en sí. En cambio,
   **appendear nuestras secciones como último hijo** de ese Island — un
   hijo adicional al final no le importa a React, solo sus propios hijos
   le importan. Ver `graftIntoIsland()` en `sh4-notas.js`.
3. **Segunda trampa, más sutil**: React **evict­úa** (saca del DOM) ese
   nodo appendeado en cada re-render del Island. Buscarlo de nuevo con
   `querySelector` después de eso devuelve `null` para siempre (el nodo
   sigue vivo, con sus listeners intactos, pero desconectado del
   documento). La solución es guardar una **referencia dura** al nodo
   (`panelNode`, seteada una sola vez al crearlo) y volver a appendear ESE
   MISMO objeto — nunca volver a buscarlo por selector.

Mismo patrón para el overlay de pinceles de textura: el `<canvas>` de
`data-texture-overlay` es **hermano** de `[data-notas-canvas]` en el HTML
estático, nunca hijo — si fuera hijo, sería territorio de React y
correríamos el mismo riesgo.

### 3.3 El panel arrastrable es el panel nativo de Excalidraw "vestido"

Pass 3 del panel, después de que Franco pidiera explícitamente "no perder
el panel de Excalidraw que teníamos antes, ese panel SUPER ENTENDIBLE
completo": el panel de propiedades nativo (Stroke, Background, Fill,
Stroke width, Opacity, Layers) queda **intacto y funcional**, restyleado
con CSS (`!important` sobre `.Island`, `.App-menu__left`, etc. — ver
sección "OUR CONTROLS INSIDE EXCALIDRAW'S PANEL" en el CSS). Nuestras
secciones propias (Trazo y color con las barras HSL, Texto con las 9
fuentes, Radius, Capas) se injertan como continuación del mismo panel, no
como un panel aparte. El panel entero se arrastra por un grip inyectado
como primer hijo del Island (`makeIslandDraggable`) — mueve solo
`style.left/top` inline, nunca toca estructura del DOM, así que React no
se entera.

### 3.4 El bug de z-index que explicó "no se ve nada"

El más caro de diagnosticar de toda la sesión. `.n-panel` tenía
`position: fixed` pero **nunca un `z-index` explícito** en su estado
"flotante" (antes de injertarse — que es como arranca *toda* nota nueva,
porque Excalidraw no renderiza `.App-menu__left` hasta que hay una
herramienta de dibujo activa o algo seleccionado). Sin z-index, un
elemento posicionado cae en nivel de apilamiento "0" — y
`.excalidraw__canvas.interactive` (z-index:3, fondo transparente) le
ganaba siempre. El panel se veía perfecto (el canvas es transparente) pero
**absorbía cada clic**. Síntoma reportado: "ni aerosol, ni cuentagotas, ni
texto justificado, ni el preview del pincel" — los cuatro eran, en
realidad, el mismo bug (todo lo que dependía de un clic no llegaba nunca a
su botón).

Se encontró **con evidencia real**, no adivinando: se instaló Playwright
(`npm install --no-save playwright` + `npx playwright install chromium`
desde `pad/viewer/`, ver sección 7) y el propio mensaje de error de
Playwright lo delató: *"`<canvas class="excalidraw__canvas interactive">`
... intercepts pointer events"*. Fix: una línea, `z-index: 9` en la regla
base de `.n-panel` (no hace falta condicionarlo al estado injertado —
cuando el panel pasa a `position: static` por el injerto, z-index no tiene
efecto igual, así que ponerlo siempre es inofensivo).

**Lección para el futuro**: cualquier elemento nuevo con `position: fixed`
en este archivo CSS **tiene que** llevar `z-index` explícito en la misma
regla. Se auditó todo el archivo después del fix (buscar bloques con
`position: fixed` sin `z-index` en el mismo bloque) — no queda ninguno
más, pero repetir esa auditoría si se agrega un elemento `position:fixed`
nuevo.

### 3.5 Imágenes: IndexedDB, no localStorage

`localStorage` tiene un tope duro de ~5-10MB compartido por todo el
origen. Una sola foto pegada en base64 lo llenaba entero — el bug que
motivó el fix. Las imágenes pegadas ahora van a **IndexedDB**
(`sh-notas-files`, object store `files`, sin índices, clave = fileId),
diseñado para blobs. `localStorage` (clave `sh-notas-v1`) solo guarda la
metadata liviana de cada clase: `{ elements, fileIds: string[] }`, nunca
los dataURLs completos.

- El **export a JSON** (botón "JSON") es la excepción a propósito: es un
  snapshot portable de un solo uso, así que SÍ embebe las imágenes
  completas (`api.getFiles()` en vivo), para que abra correctamente en
  otra máquina sin entrada de IndexedDB.
- El **import de JSON** hidrata IndexedDB con lo que traiga el archivo y
  arma la nota en el formato liviano.
- Borrar una clase también limpia sus blobs de IndexedDB
  (`idbDeleteFiles`).
- Hay compatibilidad hacia atrás: si una nota vieja tiene
  `scene.files` (forma inline, de antes del fix), se usa tal cual sin
  migrar a la fuerza.

### 3.6 Pinceles de textura: el motor NO tiene aerosol nativo

Verificado por búsqueda directa en el bundle completo (`grep` case
insensitive de `spray|airbrush|highlighter` sobre `dist/types/` y
`dist/prod/*.js`): **cero coincidencias**. No es que no se cableó, es que
no existe nada que cablear. Herramientas reales del motor: `selection,
lasso, rectangle, diamond, ellipse, arrow, line, freedraw, text, image,
eraser, hand, frame, magicframe, embeddable, laser` (16 tipos).

Se construyeron 7 pinceles propios (aerosol, dither/halftone con matriz
Bayer real, tinta con sangrado, grano/noise, VHS con separación de canal
RGB real, ASCII, estampa personalizada SVG/PNG) con esta arquitectura:

1. Un `<canvas data-texture-overlay>` **hermano** del mount de React (ver
   3.2), normalmente `pointer-events:none`, se activa solo mientras un
   pincel de textura está armado.
2. Mientras el puntero está abajo, se dibuja en **espacio de pantalla**
   (screen pixels), simple y nítido a cualquier zoom.
3. Al soltar, el trazo se convierte en un elemento `image` real de
   Excalidraw — pero **nunca armando el objeto a mano** (eso es
   exactamente el tipo de construcción a ciegas que rompió el panel en
   3.2). Se usa `convertToExcalidrawElements` (función pública que el
   motor expone justo para esto) más `viewportCoordsToSceneCoords` (para
   traducir la bounding box de pantalla a coordenadas de escena,
   respetando zoom/scroll). Ambas se agregaron al re-export de
   `notas-embed.tsx` y forzaron un rebuild del bundle a mitad de sesión.
4. Resultado: el trazo de textura queda como una imagen normal —
   movible, escalable, exportable, y automáticamente cubierta por el fix
   de IndexedDB de 3.5.

Verificado en vivo con Playwright: armar aerosol + arrastrar sobre el
overlay → `status` pasa a *"Aerosol agregado como imagen"*.

### 3.7 Suavizado de trazo: no hay campo nativo, y el primer intento no alcanzaba

El motor no tiene ningún campo de smoothing/simplificación para
`freedraw` (confirmado contra los tipos). Se implementó aparte
(`smoothPoints`), con una lección de matemática incluida: un promedio
móvil 1-2-1 repetido con puntas fijas es la ecuación del calor discreta —
converge a la recta pero necesita del orden de N² pasadas; con 70 pasadas
apenas bajaba el desvío de 64px a 20px, prácticamente sin efecto visible
arriba de 150%. Se midió con un test real (línea de 49 puntos, desvío
máximo respecto de la cuerda recta) y se rehizo en dos etapas: hasta 100%
promedia (saca el temblor, conserva la mano), pasado 100% además tira cada
punto hacia la cuerda recta — a 500% el desvío da **0.0px**, recta exacta.
El conteo de puntos se preserva siempre (el array `pressures` de un
elemento freedraw tiene que tener el mismo largo).

### 3.8 Radius: hay un techo duro que no se puede subir con más px

Encontrado leyendo la función real en el bundle minificado:
`radio = min(valor, lado_corto × 0.25)` — 25% del lado corto, sin
excepción. El slider llega a 600px (útil en elementos grandes) y hay un
botón "máximo" que calcula el tope real por elemento seleccionado. Para un
círculo real hay que usar la herramienta elipse — un rectángulo nunca va a
llegar a óvalo por más que subas el número.

### 3.9 Fuentes: 9 nativas, no más, sin fingir lo contrario

El motor tiene exactamente 9 fuentes horneadas en el bundle (ids `1,2,3,
5,6,7,8,9,10` — no existe el id `4`), cada una registrada en runtime como
`FontFace`. No hay API pública de registro de fuentes nuevas
(`setCustomTextMetricsProvider` existe pero es para OTRA cosa — un
proveedor de métricas de texto, no para agregar una tipografía
renderizable). Para meter fuentes propias (Archivo, Instrument Serif, o
cualquier Google Font) hay que **forkear el código fuente real de
Excalidraw** (no el paquete `@atyrode/excalidraw` compilado — ese solo
trae `dist/`, sin `src/`) y rebuildear el monorepo entero. Es un proyecto
aparte, no un ajuste — se le dijo así a Franco explícitamente, en vez de
prometer 10 fuentes que no iban a renderizar.

### 3.10 Cuentagotas: la API nativa de Excalidraw es privada, se usa la del navegador

`openEyeDropper` existe en el motor pero es `private` en la clase `App` —
no forma parte de `ExcalidrawImperativeAPI`, inalcanzable desde afuera. Se
usa la API estándar `window.EyeDropper` del navegador en su lugar (con
feature-detection y el botón deshabilitado + tooltip explicando el motivo
si no está disponible — Firefox/Safari todavía no la soportan). Como
beneficio extra, esta versión puede tomar color de **cualquier parte de la
pantalla**, no solo del canvas — más útil que el original.

---

## 4. Inventario de features — qué existe hoy, funcionando y verificado

| Feature | Dónde | Estado |
|---|---|---|
| Motor Excalidraw embebido, lazy-loaded (10MB, solo baja al abrir una clase) | `loadBundle()` | ✅ verificado |
| Dock arrastrable con 14 herramientas + separadores por atajo de teclado (no por índice — evita romperse si se agrega una herramienta) | `wireStudio` → `TOOLS` | ✅ |
| Panel de propiedades nativo restyleado + arrastrable + nuestras secciones injertadas | `graftIntoIsland`, `makeIslandDraggable` | ✅ verificado con Playwright |
| Sincronía de dos vías panel-nativo ↔ nuestros controles (color, grosor, opacidad, fuente, tamaño, alineación) | `syncFromEngine`, llamado en cada `onChange` | ✅ |
| Suavizado de trazo, 0–500%, matemáticamente verificado | `smoothPoints` | ✅ |
| Preview en vivo del pincel (color+grosor+opacidad+suavidad, canvas real) | `paintBrushPreview` | ✅ |
| Cuentagotas (API nativa del navegador) | `[data-eyedrop]` | ✅ (Chrome/Edge; deshabilitado con motivo en otros) |
| Caja de texto que ajusta párrafo al arrastrar (nativo del motor) + auto-wrap de texto pegado (propio, `canvas.measureText`) | `wrapParagraph`, `autoWrapPastes` | ✅ |
| 9 fuentes con preview real en su propia tipografía | `FONTS` | ✅ |
| Radius con slider a 600px + botón "máximo" real por elemento | `data-radius-max` | ✅ |
| 10 superficies de fondo (video/negro/crema/degradados/noise), cicladas con un botón, con polaridad de tinta automática | `SURFACES`, `applySurface` | ✅ |
| 7 pinceles de textura (aerosol, dither, tinta, noise, VHS, ASCII, estampa personalizada) | `BRUSHES`, overlay + `convertToExcalidrawElements` | ✅ verificado (aerosol probado en vivo) |
| Capas y grupos: lista con miniatura real, nombre editable, clic para seleccionar+centrar | `groupsOf`, `renderLayers` | ✅ (agrupar es `Ctrl+G` nativo del motor, no se construyó nada para eso) |
| Sesión de "clase": cronómetro que banca tiempo entre aperturas, centímetros de pincel reales (longitud de `points`), tarjeta de cierre con nombre/duración/cm/elementos | `elapsedMs`, `pathLengthPx`, `askClose`/`resumeClass` | ✅ |
| Guardado de imágenes en IndexedDB, JSON liviano en localStorage | sección 3.5 | ✅ |
| Export JSON portable (con imágenes embebidas) / Import JSON (hidrata IndexedDB) | `downloadJson`, `importBtn` | ✅ |
| Export a PNG | `exportToBlob` vía el motor | ✅ |
| Tarjetas de clase: banner PNG real, tilt 3D con parallax (reusa `holo-tilt.js` del sitio), caption con fragmento de texto sobre la miniatura, meta (duración/cm/fecha) que se pliega al hover dejando la imagen respirar, CTA "Abrir clase" | `renderList`, CSS `.clase-card*` | ✅ |
| Grilla con foco tipo neumorfismo: hover en una tarjeta difumina y achica las demás (`:has()`) | CSS `.notas__rail:has(...)` | ✅ verificado con Playwright (blur/scale reales medidos) |
| Sin ningún emoji ni glifo de texto — todo SVG propio | auditado con barrido de rangos Unicode | ✅ |
| El fondo (video + wash de color) es local al estudio, no se apaga con el dark/light mode del sitio | `.notas-studio` declara su propia escala de color | ✅ |
| "La pizarra siempre activa": el shell del estudio es `pointer-events:none`, solo el canvas y las cajas de chrome reales capturan clics — nunca un panel invisible tapa el lienzo | CSS raíz de `.notas-studio` | ✅ |

---

## 5. Lo que falta / conocido roto — sin inflar nada

- **Fuentes propias del sitio (Archivo, Instrument Serif) o Google Fonts
  trend**: bloqueado sin forkear el código fuente real de Excalidraw (ver
  3.9). No intentado — se le explicó el tamaño real a Franco.
- **Pivote grande sin hacer**: dibujar directamente *sobre* el sitio con
  scroll normal de la página (no en un overlay a pantalla completa), con
  el canvas "bloqueado" por secciones de scroll, y un PNG que queda fijo y
  arrastrable en el home. Es el cambio de arquitectura más grande
  pendiente — hoy el estudio es un overlay `position:fixed inset:0` a
  pantalla completa cuando está abierto.
- **Layers sin toggle de visibilidad**: el motor no tiene el concepto de
  "capa oculta" más allá de opacidad/lock por elemento — el panel de Capas
  enumera, muestra miniatura y permite seleccionar/borrar, pero no
  esconder-sin-borrar. Documentado como límite real, no como bug.
- **El botón de radius quedó muy abajo en un panel largo** — funciona
  (verificado con Playwright, un timeout en un test fue inestabilidad del
  test, no del botón), pero la ergonomía de scrollear tanto dentro del
  panel es mejorable.
- **Refactor de `sh4-notas.js`**: 2130 líneas en un solo archivo. El resto
  del sitio separa por feature (`sh2-fx.js`, `sh2-three.js`, etc.) — acá
  no se hizo por velocidad de iteración. Candidato a partir en módulos
  (`sh4-notas-panel.js`, `sh4-notas-brushes.js`, `sh4-notas-storage.js`,
  etc.) en una sesión futura, sin apuro.
- **`chromium-cli` no está instalado** en este entorno (el skill `run` lo
  espera por default) — se usó Playwright directo como fallback documentado
  por el propio skill. Ver sección 7 para dejarlo listo de nuevo.

---

## 6. Cómo iterar de acá en adelante — lo que esta sesión aprendió a las patadas

1. **Leer el archivo real antes de editar, siempre.** Varios bugs de esta
   sesión (selector con nombre viejo tras un rename, variable sin
   declarar, atributo duplicado) salieron de editar contra un modelo
   mental desactualizado del archivo en vez de releerlo. La herramienta
   `Edit` (que falla ruidosamente si el texto viejo no matchea) es más
   segura que reemplazos por script de texto libre — pero ninguna de las
   dos reemplaza releer el archivo entero cuando ya lleva muchas rondas de
   cambios.
2. **Un chequeo estático de selectores no alcanza — hace falta un parser
   real.** Se armó un script Python que extrae todo `querySelector(...)` y
   verifica que el atributo/clase exista en algún lado del archivo — mejor
   que nada, pero **no verifica que atributo y valor estén pegados en el
   mismo elemento** (falso positivo real que dejó pasar el bug de
   z-index). La versión mejorada usa `html.parser` de verdad sobre el
   template de `innerHTML`, valida anidado de tags Y cruza cada selector
   contra los atributos reales parseados. Preferir esta segunda versión.
3. **Cuando algo "no funciona" y no hay screenshot legible, no seguir
   adivinando — conseguir consola real.** Esta sesión instaló Playwright
   (`npm install --no-save playwright && npx playwright install
   chromium`, desde `pad/viewer/` porque necesita un `node_modules` con
   permiso de escritura cerca) y escribió scripts `.mjs` de un solo uso
   para: cargar la página, listar errores de consola (`page.on
   ('pageerror', ...)`), medir geometría/estilos computados de elementos
   específicos, y simular interacciones reales (`page.mouse.down/move/up`)
   para verificar que algo realmente pasa en la escena, no solo que el
   botón exista. Esto encontró el bug de z-index en minutos, después de
   que el rastreo estático agotara sus ideas. **Recomendado dejarlo
   instalado** para la próxima sesión en vez de reinstalar cada vez —
   ~300MB entre el paquete y el binario de Chromium, ya descargado en
   `C:\Users\franc\AppData\Local\ms-playwright\`.
4. **Verificar que el servidor sirve lo que creés que sirve.** Con tantos
   reinicios de `python -m http.server` en una sesión larga, puede quedar
   un proceso viejo pisando el puerto. Antes de asumir "caché del
   navegador", comparar el hash SHA256 del archivo servido contra el
   archivo en disco (`curl ... | sha256sum` vs `sha256sum archivo`) — es
   gratis y saca la duda de raíz.
5. **Cuando Franco tira una lista larga de pedidos ("todo orto")**,
   priorizar por: (a) bugs reales que rompen lo ya construido, (b) pedidos
   acotados y de bajo riesgo, (c) features grandes nuevas — y ser honesto
   en el momento sobre el tamaño real de cada una (ver 3.9, el caso de las
   fuentes) en vez de prometer todo y entregar a medias.
6. **El patrón de re-parenting de nodos de React (3.2) es la fuente de
   bugs más cara de todas.** Cualquier feature nueva que necesite tocar
   algo DENTRO del árbol que `mountNotas`/`createRoot` controla —
   `[data-notas-canvas]` — tiene que o (a) usar la API imperativa
   (`updateScene`, `addFiles`, etc.), o (b) vivir afuera como hermano y
   comunicarse por posición/coordenadas (como el overlay de pinceles), o
   (c) appendear como hijo adicional al final con referencia dura guardada
   (como el panel). Nunca mover ni re-padrear un nodo que ya está adentro.
7. **Mostrar en localhost real antes de decir que algo está listo**, y
   decir explícitamente cuándo NO se pudo verificar visualmente — este
   documento lista qué está "✅ verificado" vs solo "sintaxis OK" para que
   la próxima sesión sepa dónde confiar y dónde todavía hace falta un ojo
   humano.

---

## 7. Comandos de referencia rápida

```bash
# levantar el sitio
cd southustles/app
python -m http.server 8090

# rebuildear el motor (después de tocar pad/viewer/src/notas-embed.tsx)
cd pad/viewer
npm run build:notas
cp -r node_modules/@atyrode/excalidraw/dist/prod/fonts ../../southustles/app/vendor/notas/

# instalar Playwright si no está (ya instalado al 2026-08-17, ver arriba)
cd pad/viewer
npm install --no-save playwright
npx playwright install chromium

# chequeo de sintaxis rápido de un archivo JS
node --check ruta/al/archivo.js

# verificar que el server sirve el archivo actual (no uno viejo cacheado)
curl -s http://localhost:PUERTO/js/sh4-notas.js | sha256sum
sha256sum app/js/sh4-notas.js   # tienen que coincidir
```

Script mínimo de Playwright para diagnosticar (adaptar según necesidad —
correr desde `pad/viewer/` para que Node encuentre `node_modules`):

```js
import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));
await page.goto('http://localhost:PUERTO/#notas', { waitUntil: 'networkidle' });
await page.locator('[data-notas-new]').click();
await page.waitForSelector('.n-panel.is-open', { timeout: 15000 });
// ... interactuar / medir / screenshot
await browser.close();
```

---

## 8. Próximos pasos sugeridos (no decididos, para cuando Franco los traiga)

- Pivote de dibujar sobre el sitio con scroll (ver sección 5).
- Refactor de `sh4-notas.js` en módulos, si el archivo sigue creciendo.
- Fork real de Excalidraw si las fuentes propias se vuelven prioridad.
- Toggle de visibilidad por capa, si Franco lo pide explícitamente sabiendo
  que no es nativo (implicaría manejar un flag propio de "oculto" que
  filtre en el render, no un campo del motor).

## Publicar clases (estado 2026-08-27)

Las clases publicadas viven en `app/media/clases/` y viajan con cada deploy:

- `index.json` — manifiesto de la galería (lo lee `loadPublished()` en sh4-notas.js).
- `<id>/clase.json` — metadata + elementos, sin dataURLs (~100KB).
- `<id>/<fileId>.webp|svg` — cada imagen como archivo propio, cacheable por CloudFront.

Para publicar una clase nueva: exportarla con el botón **JSON** del estudio y correr

```bash
cd pad/viewer   # ahí está playwright, que hace la conversión a WebP
node ../../southustles/tools/publicar-clase.mjs "ruta/al/export.json" ../../southustles/app/media/clases
```

y commitear `app/media/clases`. El script reencodea los rasters a WebP (máx 1800px,
q=0.82 — los reales bajan 60-76%), deja los SVG intactos, y actualiza el manifiesto
(re-publicar un id existente lo reemplaza). Al abrirse una clase publicada, el sitio
le crea al visitante una copia local con id nuevo — editar nunca pisa la original.

Pendiente conocido: el botón PUBLISH desde el navegador (Cognito + IAM acotado a
`clases/`) — diseño completo en el plan de sesión; hasta entonces publicar es
export → script → commit.
