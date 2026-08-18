# Metodología de análisis + flujo de iteración (FLOW)

> Ver también [`site-map.md`](./site-map.md) e
> [`interaction-patterns.md`](./interaction-patterns.md) para el resultado de
> este análisis, y [`surgical-backlog.md`](./surgical-backlog.md) para el
> trabajo activo.

## Parte 1 — cómo se analizó el sitio (session handoff)

Para que una sesión futura (yo mismo u otro agente) no tenga que repetir esta
exploración desde cero, así es como se construyó el mapa de `site-map.md` e
`interaction-patterns.md`:

1. **Ubicar el repo real.** `D:\ANTS on MARS\South Hustles\` tiene múltiples
   carpetas parecidas (`repo/`, `southustles/`, zips). Solo `southustles/`
   tiene `.git` real, con remote a
   `https://github.com/godofredoaltavista-afk/southustles`. `repo/` es un zip
   viejo duplicado — ignorar. Verificado con `git remote -v`, `git status`,
   `git log --oneline -20`.
2. **Leer `README.md` primero.** Documenta la arquitectura completa: stack
   (vanilla JS, sin build step, Three.js vía CDN/import maps), infra
   (Terraform solo gestiona CloudFront, el bucket S3 es data source de solo
   lectura para que `terraform apply` nunca pueda borrarlo), pipeline CI/CD
   (`ci.yml` valida en cada PR sin credenciales AWS; `deploy.yml` corre
   `aws s3 sync` + invalidación de CloudFront SOLO en push a `main`), y la
   filosofía **additive-only**: el repo se construye reusando piezas ya
   probadas en otros estudios de Franco (`la-caravana-club`, `apacheta-app`,
   `ant-on-mars`), nunca borrando código que funciona.
3. **Mapear la estructura de `app/`** con `find`/`ls`: un solo `index.html`
   (1316 líneas), CSS modular en `app/css/` (14 archivos, orden de `<link>`
   importa por cascada), JS por feature en `app/js/` (~35 archivos, cada uno
   una responsabilidad aislada, importados desde 3 orquestadores).
4. **Leer `index.html` completo** (en dos tandas por límite de contexto) para
   extraer cada `id` de `<section>`, su propósito, y notas de estado que el
   propio código dejaba (comentarios marcando placeholders o reordenamientos
   pedidos por Franco).
5. **Verificar con `Grep` cada mecanismo interesante antes de asumir nada**:
   el flip de card, el hover-preview de la lista de proyectos, el sistema de
   páginas internas, el patrón de asset pesado externo. En cada caso se leyó
   el archivo completo, no solo el grep.
6. **Cruzar contra screenshots reales del sitio en vivo** — reveló piezas que
   la lectura estática del HTML no mostraba con la misma claridad: el drawer
   "Índice Rápido", el hover-preview funcionando en `#work`, y una project
   page real en `/#/project:pixel-perfect`.
7. **Distinguir los documentos ya existentes en `documentacion/`** del
   trabajo sobre el sitio: `codex-sync-masterplan.md` y
   `prompt-original-franco.md` son sobre el proyecto de video Renault/Peugeot
   504 (canal YouTube/Kick) — una iniciativa paralela de Franco, NO parte del
   trabajo sobre el sitio `southustles`.

**Regla para la próxima sesión**: si `site-map.md` e `interaction-patterns.md`
ya existen y están razonablemente actualizados, NO releer `index.html`
completo de nuevo — usarlos como referencia y solo releer con `Read`/`Grep`
puntual el archivo exacto que se va a tocar, para confirmar que sigue como
acá se documentó (el sitio puede haber cambiado entre sesiones).

---

## Parte 2 — el flujo de iteración (FLOW)

Así es como se itera de acá en adelante, sesión a sesión:

1. **Franco trae el input**: puede ser una imagen, un PDF pixel-perfect de
   referencia del sitio, una sección señalada por `id`, un asset exportado de
   Canva, o simplemente una instrucción de copy/orden. El repo ya está
   clonado localmente — no hace falta re-clonar ni pedir acceso cada vez.
2. **Antes de tocar código**: entender el contexto general de la página, no
   solo la sección puntual — un cambio de copy o de layout en una sección
   puede repetir o contradecir algo que ya existe en otra (ver
   `surgical-backlog.md` #5, la auditoría de texto repetido). Usar
   `site-map.md` e `interaction-patterns.md` en vez de re-explorar todo el
   HTML de nuevo — así no se "gasta de más" en tokens/tiempo re-descubriendo
   lo ya mapeado.
3. **Se hace la iteración en código**: mover secciones, cambiar copy, crear o
   extender product pages (`sh3-pages.js`), mejorar las ventanas/apps que se
   abren, todo respetando el patrón **additive-only** del repo — nunca se
   elimina una clase CSS o un bloque JS que otra sección todavía usa.
4. **Se muestra en localhost**: `app/serve.sh` (o servidor estático
   equivalente) sirviendo `app/` local, para que Franco revise el cambio real
   antes de que exista como commit.
5. **Solo con confirmación explícita ("super confirmado") de Franco**: recién
   ahí se arma el commit y se pide el PR a `main`. El commit debe
   **organizar** el sitio (mover, renombrar, prolijar) sin perder ninguna
   clase CSS ni bloque JS de secciones ya creadas — si algo se reemplaza, se
   reemplaza conscientemente y se dice explícitamente qué se retiró y por
   qué, nunca por accidente de un `git add -A` apurado.
6. **Nunca se mergea sin que Franco lo apruebe** — esto ya está en el README
   como parte del pipeline (`ci.yml` valida, pero el merge a `main` es
   manual, siempre).

Este flujo es el mismo que ya describe el pipeline del README
(`LOCAL → PR → Franco revisa → merge → deploy.yml`), formalizado acá con el
agregado de "mostrar en localhost antes de pedir PR" como paso explícito.

Antes de cualquier PR: `git status` + `git diff` completo, confirmar que
ninguna clase CSS o bloque JS de una sección existente fue borrado sin que
Franco lo haya pedido explícitamente.
