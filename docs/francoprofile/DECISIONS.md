# DECISIONS — defaults implementados (03 §2)

| ID | Decisión | Implementado | Interruptor |
|---|---|---|---|
| D1 | Dónde vive | `southustles/app/francoprofile/` (opción A) | Mover la carpeta a otro repo/Vite = opción B |
| D2 | Público vs privado | Híbrido: `data/*.json` público; vault local para lo personal | `data/private/seed.local.json` (gitignored) |
| D3 | Paleta | Neutros R=G=B de South Hustles + acento terracota de Motion Lab `#e06040` / `#c24e2f` + HUD de 3 puntos + tintas MOOD del moodboard (hot, magenta, lima, ultramar, crema, navy, cromo). Sin cian. | `--fp-accent-base` en `css/fp-tokens.css` (→ `#6d5efc` para el violeta de SH) |
| D4 | Tipografía | Archivo + Instrument Serif; JetBrains Mono solo datos; Bebas Neue solo acción y números gigantes | `--fp-font-*` |
| D5 | Three.js | `three@0.160.0` (mismo import map que `southustles/app/index.html`); un solo renderer global | — |
| D6 | Cardio vs masa | Opción A recomendada, B elegible; se guarda en el perfil | Capítulo Cardio / vista Plan |
| D7 | Meta de peso | Meta [U] 65–65,5 kg al 22/12/2026 siempre junto a la banda realista [C] 0,5–1 kg/mes. No se promete. | — |
| D8 | Sync | No: solo export/import de vault | — |
| D9 | Idioma | Solo ES (rioplatense) | — |
| D10 | Sonido | Solo metrónomo de la sesión, apagado por defecto | Ajustes / Sesión |

## Otras decisiones de esta construcción
- **Capítulos inyectados por JS** desde `js/sections/*.js` (03 §7 regla 1 lo permite): el registro los importa con `import()` y si uno falla se saltea sin romper el resto (additive).
- **Verticales MOOD** (`mood-*`): el 23/10 Franco pidió sumar una sección por cada idea de su moodboard (pósters glitch, glifos, venn editorial, HUD de cine, Lauren Mia, neón lima, globo cromado, halftone, franjas espectrales, lista de trabajos con CRT, case cards, dither de Apacheta, cielo de Apacheta, editorial tipográfico). Van intercaladas con los 28 capítulos.
- **Modo app = Moyon Lab v3** (Inicio claro con piso en perspectiva; Sesión/Lab = Estudio oscuro) + navegación creativa de Apacheta (dock inferior en píldora, ticks, texto que entra desde el blur).
- **Toggle de tema**: el de South Hustles (perilla + grilla de puntos, media luna en oscuro). El cordón de Apacheta queda en `vendor/apacheta/src/ui/RopeToggle.tsx` como alternativa.
- **Servidor local**: `tools/francoprofile/serve.mjs` (Node, sin dependencias, sin caché). Fuera de `app/`: no se despliega.
