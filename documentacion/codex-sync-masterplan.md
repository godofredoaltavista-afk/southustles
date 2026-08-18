# Masterplan — Pipeline de video Renault 4L/Peugeot 504 + protocolo de sincronización Codex ↔ Franco ↔ Claude

> Ver también [`prompt-original-franco.md`](./prompt-original-franco.md) — la fuente
> completa sin editar de la que sale este documento. Este archivo es la versión
> **operativa**: qué hace cada agente, en qué orden, y cómo se pasan información
> entre sí sin perder contexto entre sesiones.

---

## 0. Por qué existe este documento

Hay tres actores trabajando sobre el mismo material y ninguno tiene acceso directo
a lo que hacen los otros dos:

- **Codex** corre en la máquina de Franco Oleandro (el primo), con acceso directo
  a los ~200 clips crudos (~11GB, Canon, Siete Lagos). Puede leer/escribir archivos
  ahí, correr `ffmpeg`, procesar video.
- **Claude** (acá) no tiene ni va a tener acceso a esos archivos de video. Solo ve
  lo que Franco le pega en el chat: texto, resúmenes, JSON, capturas.
- **Franco** es el puente físico entre los dos: reenvía manualmente lo que Codex
  produce hacia Claude, y lleva lo que Claude genera (prompts, guiones, decisiones
  de branding) hacia Premiere/Higgsfield/Canva.

Sin un protocolo explícito, cada sesión nueva con Codex o con Claude arranca de
cero y se repite la explicación del proyecto. Este documento resuelve eso: define
el trabajo de cada uno y el formato exacto en que se pasan la posta.

---

## 1. Visión del proyecto (resumen — el detalle completo está en el prompt original)

- **Producto/hook**: Renault 4L restaurado, viaje real por los Siete Lagos (Neuquén,
  El Chocón), con perra pitbull, hostels, guitarra al fogón, mecánica a la vista
  (cambios de aceite, amortiguadores, tren delantero). Después se suma un Peugeot
  504 (estética minimalista/rally, robusta, guardabarros anchos, tren nuevo).
- **Canal**: nicho mecánica + naturaleza + storytelling, apuntando a picos de
  vistas tipo "100k en 3-5 días" con miniaturas fuertes (restauración + paisaje +
  acción). Primero el proyecto es protagonista, después las personas.
- **Formato de contenido**: se arranca de footage real (Canon, sonido ambiente
  real: agua, piedra, gente, guitarra, la perra roncando) y se lo lleva a nivel
  "tráiler de cine" con Premiere + Higgsfield Seedance 2.0, usando frames reales
  como ancla (first/last frame) para que la IA genere solo las transiciones,
  nunca reemplace el clip entero.
- **Identidad visual / branding**: dos sub-marcas a craftear en Figma/Canva —
  "Club Renault 4L" y el proyecto Peugeot 504 — bajo el paraguas de South Hustles.
  Se usan microframes de Figma (reemplazo de texto vía script/plugin) para producir
  rápido las variantes de tráiler horizontal, thumbnail, reel vertical y post.
- **Expansión paralela**: stream en Kick de iRacing (simulador), con overlay OBS,
  branding propio, thumbnails y banners generados vía Canva + MCP.
- **Meta de fondo**: no es solo hacer videos — es armar un arnés de agentes propio
  (Codex + Claude + Canva MCP + Figma + notebookLM) que sepa producir contenido de
  este nicho específico (mecánica + naturaleza + cine) de punta a punta, en vez de
  reinventar el proceso en cada proyecto nuevo.

---

## 2. Roles — quién hace qué

| Actor | Acceso | Responsabilidad |
|---|---|---|
| **Codex** | Filesystem del primo, los ~200 clips crudos | Comprimir, tagear, extraer frames. Nunca decide storytelling. |
| **Claude** | Solo texto/JSON que Franco reenvía | Diseñar prompts Seedance, guion, branding, storytelling, workflows. Nunca ve el video en sí. |
| **Franco** | Los dos lados | Reenvía el resumen de Codex a Claude. Lleva los prompts de Claude a Higgsfield/Premiere. Decide qué se sube a Canva/Drive. |
| **Primo (editor)** | Canva/Drive + Premiere + Higgsfield | Ejecuta la edición final con los clips comprimidos + los prompts/frames que arma este pipeline. |

Regla simple para no pisarse: **Codex describe lo que hay en el material real.
Claude inventa lo que debería pasar con eso.** Ninguno de los dos debe intentar
hacer el trabajo del otro.

---

## 3. Pipeline de video — brief para Codex

Este es el mensaje que Franco le pasa a Codex tal cual (o casi tal cual) como
contexto de arranque:

```
CONTEXTO: Carpeta con ~200 clips de video (Canon, ~11GB total), pesos individuales
entre 30MB y 140MB. Mezcla de horizontal y vertical. Destino: comprimir para subir
a Canva/Drive, donde un editor los va a tomar en Premiere + Higgsfield Seedance 2.0
para armar trailers cinematográficos.

═══════════════════════════════════════════
TAREA 1 — COMPRESIÓN (sin pérdida perceptible)
═══════════════════════════════════════════
- Recorrer recursivamente la carpeta de origen. NUNCA sobrescribir ni mover los
  originales — todo output va a una carpeta paralela.
- Codec: H.264 (libx264), preset "slow", CRF 23–26 (ajustar dentro de ese rango
  hasta lograr ≥50% de reducción de tamaño vs. el original; si con CRF 26 no se
  llega al 50%, bajar resolución un escalón antes que subir más el CRF).
- Audio: preservar SIEMPRE. Si ya es AAC, copiar el stream sin reencodear
  (-c:a copy). Si no, reencodear a AAC 192kbps. El audio ambiente (agua, viento,
  guitarra, gente, la perra) es contenido usable en el corte final — no es
  descartable ni de menor prioridad que el video.
- Mantener resolución y orientación originales (no rotar, no recortar, no
  reencuadrar).
- Naming: mismo nombre + sufijo "_comp" (ej. IMG_0231.MP4 → IMG_0231_comp.mp4).
- Casos borde:
  - Archivo corrupto o que ffmpeg no puede abrir → loguearlo en errores, NO
    intentar "reparar" ni omitir silenciosamente.
  - Clips duplicados (mismo hash o metadata idéntica) → marcar como duplicado en
    el CSV, no eliminar.
  - Clips de menos de 2 segundos → marcar como "descartable_candidato" (probable
    error de grabación), no borrar, solo señalizar.
  - Video grabado en vertical pero con metadata de rotación rara (algunos Canon
    guardan la orientación como flag EXIF en vez de rotar el frame) → detectar
    la orientación real por dimensiones + flag de rotación, no solo por width/height
    crudos.
- Reintentos: si ffmpeg falla en un archivo, reintentar una vez con preset
  "medium" antes de marcarlo como error definitivo.
- Salida: carpeta /comprimidos/ + resumen.csv con columnas: archivo, tamaño_original,
  tamaño_comprimido, %_reduccion, resolución, orientación, duración, fps, estado
  (ok/error/duplicado/descartable_candidato).

═══════════════════════════════════════════
TAREA 2 — ANÁLISIS Y TAGGING
═══════════════════════════════════════════
Un .json por clip en /metadata/<mismo_nombre>.json con esta estructura:

{
  "archivo": "IMG_0231.MP4",
  "orientation": "horizontal" | "vertical",
  "resolucion": "1920x1080",
  "duracion_seg": 14.3,
  "pan_direction": "left_to_right" | "right_to_left" | "static" | "handheld_shake",
  "highlight_moments": [
    { "timestamp": 8.2, "score": 0.0-1.0, "motivo": "pico de movimiento brusco" },
    { "timestamp": 11.5, "score": 0.0-1.0, "motivo": "gesto de brazos en alto (pose)" }
  ],
  "smooth_segments": [
    { "start": 0.0, "end": 4.5 }
  ],
  "first_frame": "/frames/IMG_0231_first.jpg",
  "last_frame": "/frames/IMG_0231_last.jpg",
  "notas": "texto libre si hay algo visualmente relevante (nieve, agua, perro, fogón, mecánica, etc.)"
}

Cómo generar cada campo:
- pan_direction: optical flow (OpenCV Farneback o `ffmpeg vidstabdetect`), tomar
  el vector dominante de movimiento de cámara (no de sujetos en cuadro).
- highlight_moments: combinar (a) picos de movimiento brusco vía optical flow,
  (b) picos de audio (RMS) — coincide muchas veces con el "momento fuerte" real,
  (c) si es viable sin mucho esfuerzo, pose detection liviana (MediaPipe Pose)
  para marcar gestos específicos tipo brazos en alto. Si (c) no es viable en el
  tiempo disponible, entregar igual (a) y (b) — no bloquear la tarea por esto.
- smooth_segments: tramos de bajo motion-blur / cámara estable, candidatos a
  slow-motion o de fondo para overlay de texto.
- first_frame / last_frame: extraer como .jpg en resolución completa. Estos son
  el ancla que Higgsfield Seedance usa para generar la transición IA — el clip
  real casi no se toca, se generan solo los frames intermedios entre el last_frame
  de un clip y el first_frame del siguiente.

═══════════════════════════════════════════
ENTREGA
═══════════════════════════════════════════
/comprimidos/   — videos comprimidos
/frames/        — first/last frame de cada clip
/metadata/      — un json por clip
resumen.csv     — tabla agregada de la Tarea 1

No editar, recortar ni reordenar el contenido de los clips. Solo comprimir,
tagear, extraer frames.
```

---

## 4. Protocolo de sincronización Codex ↔ Franco ↔ Claude

Esta es la parte central de este documento — el mecanismo para que el trabajo de
Codex (sobre archivos reales) y el de Claude (sobre storytelling/prompts) avancen
en el mismo sentido sin que Franco tenga que re-explicar todo cada vez.

### 4.1 El ciclo

```
┌─────────┐   procesa lote    ┌────────────────────┐   pega resumen   ┌─────────┐
│  Codex  │ ────────────────▶ │  status/handoff.md │ ───────────────▶ │  Franco │
└─────────┘                   └────────────────────┘                  └────┬────┘
     ▲                                                                      │
     │                                                                      ▼
     │            usa prompts + frames             ┌──────────────────────────┐
     └───────────────────────────────────────────── │  Claude regenera prompts │
       (siguiente lote de clips a tagear,            │  con tags reales         │
        priorizado según lo que faltó)               └──────────────────────────┘
```

1. Codex procesa un lote de clips (ej. de a 20-30, no los 200 de una).
2. Al terminar el lote, Codex escribe un archivo de estado en
   `documentacion/handoff/codex-status-<fecha>-<lote>.md` (formato abajo).
3. Franco pega el contenido de ese archivo (o el archivo completo) en la
   conversación con Claude.
4. Claude lee los tags reales (orientación, pan_direction, highlight_moments,
   smooth_segments) y con eso — no con suposiciones — arma o ajusta el siguiente
   lote de prompts Seedance, indicando qué clip real (por nombre de archivo) debería
   ir en cada rol de la secuencia.
5. Franco lleva esos prompts + los first/last frame correspondientes a
   Higgsfield/Premiere.
6. Se repite con el siguiente lote hasta cubrir los ~200 clips.

Este ciclo se puede repetir tantas veces como lotes haya. No hace falta esperar a
tener los 200 clips tageados para arrancar a generar prompts — al contrario, es
mejor ir refinando con lotes chicos.

### 4.2 Formato del archivo de handoff que escribe Codex

`documentacion/handoff/codex-status-YYYY-MM-DD-loteN.md`:

```markdown
# Codex status — lote N — YYYY-MM-DD

## Resumen
- Clips procesados en este lote: 27
- Comprimidos OK: 25 | Errores: 1 | Duplicados: 1
- Reducción de tamaño promedio: 58%
- Horizontales: 18 | Verticales: 9

## Highlights detectados (ordenados por score)
- IMG_0231.MP4 — t=11.5s — score 0.91 — "gesto de brazos en alto, final de muelle"
- IMG_0248.MP4 — t=4.2s — score 0.85 — "pico de audio + movimiento brusco (agua)"
- ...

## Clips por tipo de movimiento
- pan_direction left_to_right: IMG_0231, IMG_0250, IMG_0261
- pan_direction right_to_left: IMG_0233, IMG_0255
- static/tripod: IMG_0240, IMG_0242
- handheld_shake: IMG_0257

## Notas libres relevantes
- IMG_0245: mecánica, cambio de aceite, buena luz
- IMG_0260: perro durmiendo cerca del fogón
- IMG_0266: reflejo de agua muy nítido, candidato a "espejo/reflejo"

## Pendientes / errores
- IMG_0270: archivo corrupto, no se pudo abrir
- Lote siguiente: clips IMG_0280 a IMG_0310
```

No hace falta que Codex mande los 27 JSON completos a Claude — alcanza con este
resumen. Los JSON completos quedan en `/metadata/` para cuando el editor los
necesite directamente en Premiere/Higgsfield.

### 4.3 Qué hace Claude con ese resumen

Reglas de mapeo tag → prompt (para que la generación de prompts no sea al azar):

- Un `highlight_moment` con score alto y motivo tipo "gesto/brazos en alto" →
  candidato a cierre de secuencia (el "momento revelación" del storytelling que
  pidió Franco: silencio → naturaleza → gesto de la persona → cambio de concepto).
- `pan_direction: left_to_right` en un clip → el siguiente clip de la secuencia
  debe abrir con movimiento coherente hacia la derecha (o un corte estático) para
  que la transición generada por Seedance no "salte" de dirección.
- `orientation: vertical` → ese clip se reserva para la tanda de prompts de reel/short,
  no para el tráiler horizontal de cine.
- `smooth_segments` largos → candidatos a slow-motion u overlay de texto/branding
  (logo, trazo de recorrido tipo Photoshop) porque hay poco movimiento de cámara
  que compita visualmente.
- Notas libres tipo "mecánica" → alimentan las secuencias de estilo "HUD de juego /
  hipertexturizado" (freeze + overlay tipo gauge, ver secuencia C abajo).
- Notas libres tipo "fogón/guitarra/perro" → alimentan las secuencias de tono íntimo/
  hostel (silencio, sonido antes que imagen, estilo "bong japonés" que pidió Franco).

Con esas reglas, cada vez que llega un handoff nuevo, Claude no re-inventa prompts
genéricos — ajusta los prompts de la sección 5 para que apunten a clips reales
existentes en ese lote.

### 4.4 Qué NO hace este protocolo (por ahora)

- No hay integración automática todavía — es 100% manual vía copy/paste de Franco.
  Eso está bien para el volumen actual (~200 clips en lotes).
- Mejora futura, no implementada aún: mover este handoff a un notebook de
  NotebookLM (vía el MCP ya disponible) en lugar de archivos Markdown sueltos, para
  tener historial + búsqueda semántica entre sesiones. Se deja como nota, no se
  ejecuta hasta que el volumen de handoffs lo justifique.
- Codex no decide storytelling ni branding. Si un handoff de Codex viene con
  sugerencias creativas, Claude las puede tomar como insumo pero la decisión final
  de narrativa es de Claude + Franco.

---

## 5. Prompts Seedance / Higgsfield — banco inicial (se irá actualizando por lote)

Regla general para todos: usar el **first_frame** y **last_frame** reales del clip
como ancla de entrada/salida — la IA genera solo la transición intermedia, nunca
reemplaza el clip. Cuando un lote de Codex confirme qué archivo real cumple los
requisitos de tags de cada prompt, anotar el nombre de archivo al lado (columna
"clip real" — vacía hasta tener el handoff correspondiente).

### Secuencia A — Renault 4L / frío / perro
*Requiere: 1 clip interior con perro, 1 clip macro (caña de pescar / detalle), 1 clip POV manejo con espejo.*

1. Close-up of a brown dog inside a vintage beige Renault 4L, zooming into the frosted window reflecting snowy Patagonian mountains and pine trees, photorealistic 35mm, fluid transition, first/last frame from source footage. — *clip real: ___*
2. Macro pan along a fishing rod at golden hour over a still lake, slow dolly-in, warm light turning cold blue as fog rolls in, cinematic grain, first/last frame preserved. — *clip real: ___*
3. Interior POV driving shot, rearview mirror reflection, snow starting to fall, security-camera framing, subtle slow-motion on the mirror reflection only, rest of frame untouched. — *clip real: ___ (requiere pan_direction registrado para calzar con la secuencia B)*

### Secuencia B — 360° que se congela
*Requiere: 1 clip de paneo 360°/amplio, idealmente con smooth_segment largo.*

4. Slow 360° pan around a mountain lake campsite, mid-rotation the landscape begins to frost over in real time, ice crystals creeping across rocks and water, photorealistic. — *clip real: ___*
5. Continuation: distant echo of climbers' voices and ice-axe strikes fades in as the frost sequence completes, camera holds static, temperature-drop color grade (warm to cold). — *clip real: ___*
6. Same framing, time-lapse transition from dusk to full night, stars appearing, campfire light igniting in foreground, seamless continuation from clip 5's final frame. — *clip real: ___*

### Secuencia C — Mecánica / taller (hiperestilizado, HUD de juego)
*Requiere: clips etiquetados con notas "mecánica" (cambio de aceite, amortiguadores, tren delantero).*

7. Close-up hands pouring oil into the Renault 4L engine, time freezes mid-pour, droplet suspended, HUD-style UI overlay appears (torque wheel, gauge glow) like a racing game diagnostic screen, then resumes at normal speed. — *clip real: ___*
8. Wide shot of the car on ramps, quick stylized slow-motion sweep across new rear shocks and front axle, subtle blueprint/wireframe overlay flickers over the parts being highlighted, returns to photoreal. — *clip real: ___*
9. Low-angle hero shot of the finished 4L, engine revving, dust kicked up in slow motion, HUD overlay fades out, cut to clean photoreal daylight. — *clip real: ___*

### Secuencia D — Siete Lagos / agua / reflejo
*Requiere: clips con reflejo de agua marcado en notas libres, y el clip highlight del "final de muelle, brazos en alto".*

10. Static tripod shot of pine-lined lake shore, water reflection rippling, slow zoom into the reflection until it inverts into the next scene's mountain range. — *clip real: ___*
11. Continuation: reflection resolves into a wide establishing shot of the "fin del mundo" landscape, birds crossing frame, golden hour to blue hour color shift. — *clip real: ___*
12. Dock/pier shot, a figure walks to the end and raises both arms, camera pulls back into a wide aerial-feel shot (simulated crane-out), triumphant pacing, natural sound of wind and water preserved. — *clip real: highlight_moment "brazos en alto" del handoff correspondiente*

### Secuencia E — Hostel / fogón (tono íntimo, sonido antes que imagen)
*Requiere: clips con notas "guitarra", "fogón", "perro durmiendo".*

13. Close-up of hands playing acoustic guitar around a campfire, embers in slow motion, warm firelight flicker, transitions into a wider shot of the group listening. — *clip real: ___*
14. Continuation: camera pans to the dog sleeping and snoring near the fire, soft focus pull, ambient guitar continues bleeding into next scene before cut. — *clip real: ___*
15. Night sky reveal, stars and campfire smoke rising, slow tilt up, fades to black as if closing a chapter. — *clip real: ___*

### Secuencia F — Ruta / velocidad
*Requiere: clips con pan_direction marcado (para que el whip-pan de la 17 calce con la dirección real de movimiento).*

16. Driving POV through a dirt road, dust trailing behind, speed-ramp effect (real speed → fast blur → real speed) synced to engine sound, first/last frame from raw footage. — *clip real: ___*
17. Exterior tracking shot of the 4L passing camera, motion blur on wheels only, rest of frame crisp, quick whip-pan transition to next scene. — *clip real: ___ (pan_direction debe coincidir con el clip 18)*
18. Aerial-style wide of the car alone on an empty Patagonian road, slow push-in, sun flare, fading into text-safe area for logo placement (Renault Club / South Hustles brand slot). — *clip real: ___*

### Secuencia G — Cierre / branding
*Requiere: 1 clip de detalle del logo/patente/parrilla, 1 clip final con el perro.*

19. Macro shot of the Renault 4L badge/grille, slow rack focus, background blurred motion of the trip's landscapes ghosting past (double-exposure style), settles on badge sharp. — *clip real: ___*
20. Final frame transitions into a clean minimal title card zone (Peugeot 504 dark+lime brand palette placeholder), dust particles drifting, ready for logo/typography overlay in Premiere. — *sin clip real, generado full IA para el placeholder de marca*
21. Loop-back shot: dog looking out the window one more time, slow zoom out revealing the full car on the road, sunset, freeze on last frame for thumbnail use. — *clip real: ___ (buen candidato a first_frame de miniatura de YouTube)*

---

## 6. Próximos pasos concretos

1. Franco arranca a mandarle a Codex el brief de la sección 3, apuntando a la
   carpeta real de los clips.
2. Cuando llegue el primer `codex-status-*.md`, pegarlo en la conversación con
   Claude para completar las columnas "clip real: ___" de la sección 5 y ajustar
   prompts si hace falta.
3. Repetir por lote hasta cubrir los ~200 clips.
4. Recién ahí — no antes — evaluar mover el branding de Figma (microframes,
   reemplazo de texto) y el armado de banners/thumbnails en Canva, que dependen
   de tener ya clips reales asignados a cada secuencia.
