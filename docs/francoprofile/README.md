# Franco · Perfil vivo — `/francoprofile`

Perfil de entrenamiento de Franco como **scroll infinito animado** (≈47 capítulos y verticales) + **modo app** (dashboard de ventanas de vidrio, 10 vistas). Vanilla ES modules, sin bundler, dentro de `southustles/app/` → se despliega con el pipeline existente (S3 + CloudFront) sin tocar infra.

## Verlo en local
```bash
node tools/francoprofile/serve.mjs 8080
```
Abrí `http://localhost:8080/francoprofile/` (desde la raíz del repo `southustles`). También sirve `app/serve.sh` (python). **No funciona con `file://`** (los módulos y los JSON necesitan http).

## Datos y privacidad
- Lo público (método, plan, premisas, ejercicios, glosario, fuentes) está en `data/*.json`.
- Lo personal (peso, comidas, check-ins, series, fotos, medidas, estudios) vive **solo en el navegador** (IndexedDB `francoprofile`). Se mueve con el **vault** (export/import JSON) desde la vista Vault.
- `data/private/seed.local.json` siembra el perfil con los datos declarados de Franco la primera vez. Está en `.gitignore`: **no se commitea ni se despliega**.
- Datos de ejemplo: el onboarding y el Vault pueden cargar 14 días de **EJEMPLO** (`demo:true`), rotulados en toda la UI y borrables con un click.
- **Si ves una foto o un valor de laboratorio en un commit, el commit está mal.**

## Estructura
`index.html` · `css/` (tokens, base, chrome, capítulos, moods, app, three) · `js/core` (env, tema, bus de scroll, lock, store IndexedDB, datos, modelo, planificador, demo) · `js/ui` (chrome, íconos, helpers, LED, ventanas, HUDs, cursor) · `js/sections` (un archivo por capítulo + `fp-chapters.js`) · `js/views` (una vista de la app por archivo) · `js/features` (app, onboarding, Motion Lab, contexto para Claude) · `js/three` (campo global + particleWord) · `reference/francoprofile-vendor/` (copias de procedencia, sin editar; fuera de `app/`) · `docs/`.

Ver `docs/francoprofile/CONTRACTS.md` (cómo encajan las piezas), `DECISIONS.md`, `PORTED.md`, `SOURCES.md`, `CONFLICTS.md`, `PERF.md`, `TOUCHED.md`.
