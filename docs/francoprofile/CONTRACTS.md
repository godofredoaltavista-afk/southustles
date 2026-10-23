# CONTRACTS — cómo encajan las piezas de `/francoprofile`

> Leelo entero antes de escribir. Todo vive en `southustles-main/app/francoprofile/` (en adelante `FP/`).
> Se sirve en `http://localhost:8080/francoprofile/` (servidor estático sobre `southustles-main/app`).
> Vanilla ES modules, sin bundler, sin frameworks. Three.js **0.160.0** por import map (`import * as THREE from 'three'`).

## 0. Reglas de equipo (varios agentes en paralelo)

1. **Escribí solo tus archivos** (tabla §1). No edites archivos de otro dueño ni del core (`js/core/*`, `js/ui/fp-ui.js`, `fp-icons.js`, `fp-led.js`, `js/features/fp-motionlab.js`, `fp-context.js`, `js/sections/fp-chapters.js`, `js/fp-main.js`, `index.html`, `css/fp-tokens.css`, `css/fp-base.css`). Si necesitás algo que falta, implementalo **dentro de tus archivos** y anotalo en tu informe final.
2. **Additive-only.** Nada fuera de `FP/` se toca. Los repos originales se leen, no se editan.
3. Prefijos: clases `fp-*`, variables `--fp-*`, eventos `fp-*`, claves `localStorage` `fp.*` (solo preferencias de UI). Cada módulo hace `console.log('[fp/<modulo>] init')` una vez.
4. **Archivos completos.** Nada de "acá va el resto".
5. Colores: **siempre tokens** de `css/fp-tokens.css` (`--fp-bg-*`, `--fp-ink-*`, `--fp-line`, `--fp-accent*`, `--fp-ok/warn/bad`, `--fp-skel-*`, y las tintas MOOD `--fp-hot --fp-magenta --fp-lime --fp-ultra --fp-cream --fp-navy --fp-grad-hot --fp-grad-ring --fp-grad-chrome --fp-grad-dusk --fp-noise`). Dark = grises puros R=G=B. **Sin cian** (el azul es ultramar `--fp-ultra` o `--fp-skel-l`).
6. Z-index solo con `--fp-z-*`. Nunca `9999`. Nunca una regla global tipo `body > :not(...) { position:relative; z-index:1 }`.
7. Animá solo `transform/translate/opacity/clip-path/filter`. Un solo rAF por efecto. Pausá todo lo que esté fuera de pantalla (`ctx.env.onVisible`). `prefers-reduced-motion` (`ctx.env.prefersReducedMotion()`) → frame estático, sin typewriter, sin parallax.
8. Scroll: **nunca** `addEventListener('scroll')`. Usá `ctx.scroll.onScrollFrame(fn)` + `getSectionProgress(el)` / `getInnerProgress(el)`.
9. **Three.js:** un solo renderer global lo maneja `js/three/fp-field.js` (dueño: agente THREE). Los demás **no crean `WebGLRenderer`**. Para efectos 3D chicos usá canvas 2D (proyección propia), SVG o CSS 3D.
10. Contenido: todo número de entrenamiento sale de `ctx.data` (JSON en `data/`) o de `01_PERFIL_Y_METODO.md` con su etiqueta **[U]/[C]/[?]** (`ctx.ui.tag('U')`) y respaldo (`ctx.ui.support('Solida')`). Lo privado (peso, comidas, check-ins, fotos, medidas) sale del vault (`ctx.state` / `ctx.store`); si no hay, **estado vacío con CTA** (`.fp-empty`). Los datos de ejemplo llevan `demo:true` → mostrá `ctx.ui.demoChip()`.
11. Guardarraíles: no diagnosticar, no interpretar laboratorio, **nada hormonal ni farmacológico**, sin cifras sin fuente ("−40 % lesiones" prohibido), suplementos solo creatina 5 g. Copy en **español rioplatense (voseo)**, directo. No copiar párrafos de mentores ni nada personal de `contexttt.txt` (solo el extracto curado de 03 §12.4).
12. Verificación: chequeá sintaxis con `bash "<scratchpad>/fpcheck.sh" <tus .js>` (ruta del script en el prompt). **No uses el panel Browser** (lo usa el agente principal para probar todo junto).

## 1. Dueños de archivos

| Agente | Archivos (todos dentro de `FP/`) |
|---|---|
| **CORE** (principal) | `index.html`, `js/fp-main.js`, `js/core/*`, `js/ui/{fp-ui,fp-icons,fp-led,fp-chrome}.js`, `js/features/{fp-motionlab,fp-context}.js`, `js/sections/fp-chapters.js`, `css/{fp-tokens,fp-base,fp-chrome}.css`, `docs/*` |
| **CH-A** | `js/sections/ch01-hero.js … ch14-bolsa.js` (14 archivos), `css/fp-ch-a.css` |
| **CH-B** | `js/sections/ch15-cardio.js … ch28-footer.js` (14 archivos), `css/fp-ch-b.css` |
| **MOOD-A** | `js/sections/mood-{poster,cine,glifos,venn,halftone,daydance,lauren}.js`, `css/fp-mood-a.css` |
| **MOOD-B** | `js/sections/mood-{works,globe,spectral,cielo,neon,cases,dither,editorial}.js`, `css/fp-mood-b.css` |
| **APP-1** | `js/features/fp-app.js` (shell + router), `js/ui/fp-windows.js` (Workspace), `js/views/fp-view-{hoy,sesion,plan,lab}.js`, `js/features/fp-onboarding.js`, `css/fp-app.css`, `css/fp-onboarding.css` |
| **APP-2** | `js/views/fp-view-{comida,checkin,progreso,biblioteca,vault,ajustes}.js`, `css/fp-views-b.css` |
| **THREE** | `js/three/fp-field.js`, `js/three/fp-particle-word.js`, `js/ui/{fp-hud-drive,fp-cursor,fp-color-hud}.js`, `css/fp-three.css` |

## 2. Contrato de capítulo / vertical (`js/sections/<id>.js`)

```js
export default {
  id: 'quien',          // slug; la sección queda con id="ch-quien" (el archivo se llama ch02-quien.js, el id interno puede ser corto)
  n: '02',              // número visible (moods: 'M1'…)
  title: 'Quién',       // corto: nav, menú, tira lateral
  pol: 'theme',         // 'theme' (sigue el tema, gradient weave) | 'invert' (capítulo «punch», contrasta) | 'mood' (fondo propio full-bleed, sin padding por defecto)
  bg: 'grid',           // opcional: 'grid' | 'dots' | 'beam' (fondos aditivos de fp-base.css)
  gl: null,             // opcional: 'hero' | 'bolsa' | 'calm' → el campo Three.js global se muestra/cambia de modo mientras este capítulo está en pantalla
  app: 'plan',          // opcional: agrega «Ver en la app →» a #/plan
  bridge: 'Frase-puente final.', // opcional (línea-puente en Instrument Serif)
  render(ctx) { return `<div class="fp-wrap">…</div>`; },   // HTML (string). Se pinta al arrancar.
  async init(el, ctx) { … },   // corre UNA vez cuando el capítulo se acerca al viewport. Cableá interacción acá.
};
```
- El registro (`fp-chapters.js`) crea `<section class="fp-section fp-ch fp-ch--<id> [fp-mood|fp-pol-invert] [fp-bg-*]" id="ch-<id>" data-fp-section data-fp-ch data-fp-title data-fp-pol [data-fp-gl]>` y después de `init` llama `ctx.ui.reveal(el)`, `ctx.ui.counters(el)`, `ctx.ui.enhance(el)`. O sea: marcá en tu HTML `data-fp-fade` (`left|right|scale`), `data-fp-delay="140"`, `data-fp-count="12.5" data-fp-suffix=" kg"`, `data-fp-magnetic`, `data-fp-dirfill`, `data-fp-tilt` y se activan solos.
- Datos vivos: en `init`, pintá lo dinámico desde `ctx.state` y re-pintá con `ctx.onData(() => repaint())`.
- Cada capítulo: **una idea, una animación protagonista, un dato fuerte**. Máx. 3 ideas.

## 3. `ctx` (lo arma `fp-main.js`, se pasa a todo)

| Clave | Qué es |
|---|---|
| `ctx.data` | `{ profile, plan, exercises, muscles, exById, muscleById, dayByKey, premises, premiseLegend, glossary, sources, phrases, rules, joints, boxer() }` (ver `data/*.json`). `boxer()` → Promise del `boxer.json` real de Motion Lab. |
| `ctx.state` | `{ profile, days, sessions }` del vault (IndexedDB). `await ctx.load()` lo refresca. |
| `ctx.onData(fn)` | `fn(detail)` en cada cambio del vault (debounced). |
| `ctx.store` | `getProfile() saveProfile(patch) getDay(d) getDayOrNew(d) updateDay(d, fn) putDay() allDays() listDays({from,to}) deleteDay() listSessions() getSession() putSession() deleteSession() putMedia(blob,meta)→id getMedia() mediaURL(id) deleteMedia() listMedia() listLabs() putLab() deleteLab() exportVault({includeMedia,includeLabs}) previewImport(obj) importVault(obj) clearAll() hasDemo() clearDemo() usage() blankDay(d) emit(kind)` |
| `ctx.M` | modelo puro: `todayISO isoOf parseISO addDays daysBetween weekdayKey weekStart fmtDate rangeISO greeting isTrainDay planFor setsOf volumeByMuscle totalSets dayProtein dayKcal dayWater dayTrained streak adherence tempoAdherence weightSeries movingAvg weeklyAvg currentWeight projection runKm painStreak avgOf lastSetsFor atRepCeiling` |
| `ctx.planner.suggest({days,data,profile})` | `[{id, level:'ok'|'info'|'warn'|'bad', title, why, then}]` |
| `ctx.ml` | Motion Lab: `normalize(raw, filename) readFile(file) metrics(session) vsPrevious(sessions, s) anglesOf(frame) kpiMain(kpis) SkeletonPlayer JOINTS BONES SKEL` |
| `ctx.ui` | `toast(msg, kind) tag(t) support(s) demoChip() gauge({value,max,label,unit,band,size,status,display}) spark(values,{band,avg,h,w}) bars(items) tilt(el) magnetic(el) dirfill(el) enhance(root) reveal(root) counters(root) downloadFile(name, content, type) copyText(text) segmented(el, value, onChange) icon(name,size) esc(str) fmt(n,dec)` |
| `ctx.icon(name, size)` | SVG inline (ver nombres en `js/ui/fp-icons.js`) |
| `ctx.led` | `drawLED(canvas, text, {on, off, glow, align, ink})`, `accentColor()` |
| `ctx.env` | `fxEnabled() prefersReducedMotion() isCoarsePointer() isMobile() clamp lerp LS.get/set onVisible(el, fn) cssVar(name) esc fmt uid` |
| `ctx.scroll` | `onScrollFrame(fn) getSectionProgress(el) getInnerProgress(el) scrollVelocity() lockBodyScroll() unlockBodyScroll()` |
| `ctx.theme` | `onThemeChange(fn) isDark() setTheme(t,{persist,from}) applyViewTheme(t) storedTheme() followSystem()` — evento `fp-theme-changed` |
| `ctx.openApp(view)` / `ctx.closeApp()` | router por hash (`#/hoy`…) |
| `ctx.gl` | `{ setMode(name), setDrive('G'|'Z'|'H'|'F'), ready }` (lo completa THREE) |
| `ctx.particleWord(word)` | partículas que forman una palabra ('ENTRENÁ', 'LISTO') |
| `ctx.chapters` | `[{id,n,title,pol,el,mood,pause}]` después de montar |

## 4. Contrato de vista de la app (`js/views/fp-view-<id>.js`) — APP-1 y APP-2

```js
export default {
  id: 'comida', title: 'Comida', icon: 'comida',
  theme: 'light',                 // tema por vista (Motion Lab VIEW_THEME). El toggle manual del usuario manda.
  hint: 'Foto + guía + proteína', // subtítulo corto
  windows(ctx) {                  // ventanas de vidrio del Workspace (fracciones del área: x,y,w,h en 0..1)
    return [
      { id: 'foto', title: 'Foto del plato', icon: 'camera', def: { x: .02, y: .03, w: .44, h: .56 }, glass: 1,
        mount(body, ctx, api) { /* armá el contenido en body; api = { ws, win, refresh(), toast } */ } },
    ];
  },
  onShow(ctx) {}, onHide(ctx) {},  // opcionales
};
```
- El shell (APP-1) crea un `Workspace` por vista la primera vez que se visita, llama `mount` una sola vez por ventana y mantiene los nodos (se **mueven**, no se recrean). Reaccioná a datos con `ctx.onData`.
- `glass`: 0 opaco · 1 translúcido · 2 transparente (en reposo solo ícono + título; vidrio al hover).
- < 760 px de ancho → las ventanas se apilan como cards.
- Clases para usar dentro de ventanas: las de `fp-base.css` (`fp-btn`, `fp-input`, `fp-field`, `fp-seg`, `fp-switch`, `fp-check`, `fp-gauge`, `fp-bar`, `fp-table`, `fp-empty`, `fp-drop`, `fp-list`, `fp-spark`, `fp-chip`, `fp-tag`, `fp-support`) + las que defina APP-1 en `fp-app.css` (`.fp-kv`, `.fp-stat`, `.fp-led`, `.fp-action-card` …, ver su informe).

## 5. Dirección estética (lo que Franco pidió, con referencias reales)

- **Modo app = Moyon Lab v3.** Inicio claro: gris `#e6e6e6` con **piso en perspectiva de grilla**, píldora de cabecera con marca + pestañas (la activa en píldora oscura con acento), chips de estado chiquitos en mono, **3 puntos de color** del HUD arriba a la derecha, botón «Configurar». Tarjetas de acción 2×2 en **Bebas** (`ENTRENÁ / REGISTRÁ / ANALIZÁ / COMPARÁ`, una en acento), pasos `① ② ③`, titular que se tipea + subtítulo en Instrument Serif itálica, **lente circular** con esqueleto de partículas y esquinas en corchete, dígitos **LED** para racha/hoy, grilla de ejercicios con íconos. Vista **Sesión/Lab = Estudio de Moyon Lab** (oscuro): esqueleto grande con **ángulos en caja negra** (169°, 76°…), «Progreso del movimiento» con barra %, señales (extensión del brazo, rodillas izq azul / der roja), **bitácora** en mono, **equilibrio** `100 % ←→ 0 %`, conteo LED, acciones (jab/cruzado/gancho/upper con barras), tarjetas «Cuerpo» (codo izq 129° …), timeline de grabación naranja. Fuentes: `motion-lab-master/app/css/v3.css`, `app/js/ui/{home,hero,background,hudkit,shell,studio,windows,onboarding}.js`.
- **Navegación creativa Apacheta:** cabecera mínima (HOY · …) + marca centrada con **cordón/péndulo**, ticks verticales a la izquierda con el nombre de la sección activa, **dock inferior en píldora** («Secciones · Perfil · Cielo»), contador `09 / 12`, «← VOLVER». Texto que **entra desde el blur como en cine**, citas grandes en serif itálica centradas, paneles de color plenos (azul, rojo, navy, mostaza) con tarjetas tipo libro 3D, cielo navy con onda/horizonte de puntos, lunas, **dither** que reacciona al mouse, auras. Fuentes: `apacheta-main/frontend/src/{app/{PaperNav,MenuOverlay,Shell}.tsx, app/shell.css, screens/{Cielo,Lobby,Hoy}.tsx, screens/{cielo,lobby,screens}.css, ui/{Aura,HeroOrb,ZenBanner,RopeToggle,ScoreGauge,SwipeCard,GlassWindow,BootLoader}.tsx+css, ui/fx/{dither.ts,DitherField.tsx,Grain.tsx,BandaTrama.tsx,DataMotes.tsx,constellation.ts,liquid.ts,fx.css}, styles/{editorial,animations}.css, hud/engine/*}`.
- **South Hustles:** hero gigante en Archivo 800 con palabras en gradiente/serif itálica, HUD de 3 puntos **vertical a la izquierda** con RESET, texto vertical en el borde derecho, nav píldora oscura, lista de trabajos con **preview flotante con gradiente + scanlines CRT + asset que gira** al hover y «DESCUBRÍ AHORA →», palabra fantasma «WORK», **case cards** inclinadas con gradiente y badge «CASE» + estrellas, marquees, footer gigante. Fuentes: `southustles-main/app/{index.html, js/*.js, css/*.css}` (sobre todo `sh-main.js initProjects/initHoloTeasers/initEcoCards`, `preview-3d.js`, `holo-tilt.js`, `sh2-fx.js`, `sh2-theme.css`, `cards.css`, `sh2-content.css`, `sections.css`).
- **Ant on Mars:** NavHUD con modos G/Z/H/F + telemetría arrastrable, cursor de 3 capas, ventanas flotantes macOS. Fuentes: `ant-on-mars-super-frontend-main/src/{scripts,styles}`.
- **Moodboard (verticales `mood-*`):** pósters glitch (Other Intelligences), ultramar Day Dance (silueta azul flotando sobre foto desenfocada), glifos crema sobre negro tipo petroglifo + píldora «DANCE?», venn serif «Where Creativity and Technology Collide», HUD cinematográfico «S200 PST / 08.10», neón lima sobre negro, Lauren Mia naranja→magenta con anillos, mockups de teléfono/reloj, globo cromado en wireframe, sellos halftone «HALF TONE MUSEUM», franjas espectrales «09TH ANNUAL LOVIE AWARDS», editorial «Contemporaneidade, Tecnologia… & Convergência» y «TRANSCENDENCE» con columnas verticales, grano/ruido gris, cromo. **Siempre con el contenido de Franco** (su método, su cuerpo, su equipo, su meta), nunca lorem ipsum.

## 6. Contenido de Franco (resumen rápido; la fuente es `01_PERFIL_Y_METODO.md` + `data/*.json`)

27 años, Córdoba. Creative technologist, South Hustles. Atleta híbrido: calistenia + boxeo (bolsa 1,20 m) + running (~10 km × 3/sem en la costa) [U]. ~62,5 kg [U] (vault) → meta 65–65,5 kg al 22/12/2026 [U] vs banda realista +0,5–1 kg/mes [C]. Fue ectomorfo; pasó por 57 y 59 kg; hace ~5 meses dejó el alcohol y empezó sol/agua/proteína/entreno [U]. Fuertes: piernas, coordinación, mente-músculo, salto, equilibrio a una pierna. A trabajar: dorsal, tríceps, deltoide posterior, glúteo, gemelo, core lateral, pecho («una bestia, pero atrofiada hacia adelante») [U]. Postura declarada: hombro derecho elevado, escápulas altas, cuello adelantado — no diagnosticado, kinesiólogo una vez [C]. Pulgar con molestia. Equipo: barra, handles, 3 bandas, mancuernas 20 kg (2×10 / 1×15 / barra 20 [?]), garrafa como lastre, soga, bolsa, vendas, guantes, colchoneta, espejo, sol. 3 fases (excéntrica/isométrica/concéntrica) + tempo 3-1-1; RIR 1–2; 3–4 series; 12–20 series/músculo/semana; 4 palancas; 9 palancas de progresión sin pesas; plan Lun empuje · Mar tracción · Mié piernas · Jue descanso · Vie torso superseries · Sáb boxeo/core · Dom descanso; sesión Subidón (8–10′) → Fuerza (35–45′) → Bolsa (10–15′). Comida: proteína 110–130 g, 3–4 comidas de 25–40 g, superávit +250–350 kcal; agua 3 L; creatina 5 g diaria sin timing. Sueño 8+ h. Cardio A (prioridad masa: 1–2 salidas zona 2) vs B (3×10 km comiendo +250–300 kcal). Lema: **«Entrenando duro, durmiendo duro.»**
