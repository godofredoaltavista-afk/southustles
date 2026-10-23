# TOUCHED — archivos existentes tocados (additive-only)

| Archivo | Qué se agregó | Por qué |
|---|---|---|
| `app/index.html` | 1 línea: `<a class="menu-overlay__link" href="/francoprofile/">Sport <em>Profile</em> <span>09</span></a>` dentro de `#menu-overlay` (menú full-screen). **No** hay botón en la barra de navegación. | Punto de entrada (pedido de Franco, 03 §3.3) |
| `tools/ut/smoke.sh` | 7 chequeos HTTP de `/francoprofile/` (HTML, CSS, JS, datos) | `ci.yml` y `deploy.yml` ya corren este script: así el CI valida la ruta nueva sin tocar los workflows |

Todo lo demás es nuevo: `app/francoprofile/**`, `docs/francoprofile/**`, `reference/francoprofile-vendor/**` (procedencia, no se deploya), `tools/francoprofile/serve.mjs`.
