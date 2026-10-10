# UT Digitall

Frontend autónomo preparado para la ruta **https://www.southustles.com/UT/**. La entrega actual se revisa e itera **sólo en localhost**: no incluye push, PR ni publicación en AWS. La mayúscula en `UT` forma parte de la ruta; el alojamiento futuro en S3 distingue mayúsculas y minúsculas. `/UT/` es la entrada prevista y `/UT/index.html` es el acceso explícito equivalente.

El sitio usa HTML, CSS y módulos JavaScript estáticos. No necesita instalación, compilación ni un servidor de aplicación. Su código, recursos y preferencias están contenidos en `app/UT/`; los datos de idioma, tema y acentos usan claves `ut-*` en el almacenamiento del navegador.

## Vista previa y comprobaciones

El checkout local actual está en `C:\apacheta rework\ut-digitall-site`. Desde esa raíz, servir `app/` con el servidor local incluido, que declara los tipos MIME de imágenes, fuentes y módulos:

```sh
python tools/ut/serve.py --port 4173
```

Abrir `http://localhost:4173/UT/` o `http://127.0.0.1:4173/UT/`. No abrir el HTML como `file://`: el navegador necesita HTTP para los módulos y recursos. Los servidores que dependen del registro MIME de Windows pueden enviar WebP y WOFF2 como `application/octet-stream`; `serve.py` evita ese problema. La vista previa equivalente al alojamiento validado en CI usa la imagen Nginx existente:

```sh
docker build -t south-hustles ./app
docker run --rm -p 8080:80 south-hustles
```

Las comprobaciones no requieren paquetes adicionales:

```sh
node tools/ut/validate.mjs
bash tools/ut/smoke.sh http://localhost:4173
```

El validador revisa archivos locales referenciados por HTML/CSS/módulos, traducciones completas en ES/PT-BR/EN, IDs y destinos de navegación, accesibilidad de referencias ARIA, las 12 filas de Universo UT, los cuatro servicios y los contactos suministrados. Comprueba sintaxis de los módulos sin ejecutar el frontend. El smoke test verifica `/`, `/motionlab/`, `/UT/`, `/UT/index.html`, CSS, los cuatro módulos, la imagen principal y una fuente. Exige HTTP 200, tipos de contenido correctos y rechaza assets que devuelvan un fallback HTML.

Al iterar, revisar escritorio, tablet y móvil; ambos temas; los tres idiomas; navegación con teclado y Escape; filas con puntero, foco y toque; movimiento reducido y almacenamiento bloqueado. Los controles y todo el contenido deben funcionar aunque las animaciones dejen de ejecutarse.

### Resultado de comprobaciones locales — 10/10/2026

- Validador estático: aprobado; IDs, destinos, traducciones ES/PT-BR/EN, 12 filas, cuatro servicios, referencias locales y sintaxis de módulos correctos.
- Smoke HTTP en `http://localhost:4173`: aprobadas las 11 rutas, incluidos ambos sitios existentes, las dos entradas UT, CSS, cuatro módulos, WebP y WOFF2. Los tipos MIME coinciden con el contenido; la fuente tiene la firma WOFF2 esperada.
- Sintaxis de `smoke.sh` y comprobación de whitespace del diff: aprobadas.
- Revisión en el navegador integrado: vistas de 1440, 820 y 390 píxeles de ancho; ES/PT-BR/EN; temas claro y oscuro, con transición circular observada.
- Menú: foco contenido dentro del diálogo, recorrido inverso con Shift+Tab, cierre con Escape y retorno al control que lo abrió. Acordeón: apertura por toque/click y navegación con ArrowDown verificadas.
- Animaciones de hojas: los dos contextos WebGL se inicializaron correctamente. La sesión de revisión no registró errores de consola.

Capturas conservadas de la revisión real:

- [Servicios en escritorio](review/desktop-services.jpg)
- [Hero en móvil](review/mobile-hero.jpg)
- [Universo UT en móvil, inglés y tema claro](review/mobile-universe-en-light.jpg)
- [DNA en tablet e inglés](review/tablet-dna-en.jpg)

Límites de esta comprobación: el entorno no tiene Docker disponible, por lo que el contenedor Nginx no se ejecutó localmente; su verificación queda preparada en los workflows. El tratamiento de movimiento reducido y de visibilidad de la página se revisó en el código, sin emular esos estados en el navegador. Los tamaños móviles se revisaron en el navegador integrado, no en dispositivos físicos. Las capturas documentan vistas concretas y no prueban cada cuadro de las animaciones. No se ejecutó despliegue público, push, PR ni ninguna operación AWS/Terraform.

## Fuentes de marca y contenido

El material de referencia es el Canva suministrado (`https://canva.link/8ddfq371i9dqpj3`), sus slides 1–11 y las capturas/PNG descargados por Franco en `Documents/ut digitall`. Los originales preservan su resolución; las versiones WebP se usan para servir el frontend. Los banners con texto incorporado se usan como referencia de composición; el copy principal es HTML traducible.

El registro `app/UT/assets/asset-manifest.json` relaciona los assets con sus archivos originales, página de Canva, dimensiones, transparencia, colores dominantes y tamaños de archivo. Las referencias completas de los 11 slides están en `app/UT/assets/references/`; los originales, en `app/UT/assets/originals/`. Las fuentes alojadas localmente son Helios Extended, Noto Serif Display Italic, Montserrat y Belleza Regular, recuperada para el tratamiento del hero. El CSS declara las variantes y pesos utilizados.

El frontend adapta las composiciones originales al scroll y a los distintos anchos de pantalla: conserva paleta, jerarquía y objetos de marca, con navegación, secciones expansivas, HTML traducible y movimiento. Los slides horizontales sirven como referencia de dirección visual; la página web no es una reproducción idéntica de sus coordenadas. Los PNG descargados conservan su resolución original, y las capas adicionales recuperadas de Canva conservan la resolución disponible en su origen. Los textos que forman parte de una imagen de marca o del mockup de laptop permanecen en el idioma del original.

El copy español proviene de los slides y las capturas suministradas. Las frases cortadas al borde de una captura terminan en la última oración verificable. `app/UT/js/content.js` contiene las tres traducciones y el orden/destino de las 12 entradas. No hay formulario, newsletter, testimonios ni casos de clientes ficticios. Contactos:

- `utdigit@gmail.com`
- `https://www.instagram.com/utdigitall/`
- `https://www.linkedin.com/in/gustavoaltavista?originalSubdomain=ar`

## Pipeline preparado para una publicación futura

Estas instrucciones documentan el mecanismo existente. No autorizan publicar durante las iteraciones locales actuales.

`ci.yml` valida la PR con el mismo contenedor Nginx y con las comprobaciones UT añadidas. El gate existente sigue siendo **la revisión y el merge de Franco a `main`**. El push a una rama o la apertura de una PR no publica el sitio.

Tras el merge, `deploy.yml` repite las validaciones, sincroniza `app/` al bucket S3 existente e invalida CloudFront. No requiere cambios de Terraform ni ejecutar `terraform apply`. `/` y `/motionlab/` se conservan y se verifican junto con UT.

Después de finalizar el workflow, comprobar el dominio público:

```sh
bash tools/ut/smoke.sh https://www.southustles.com
```

Las capturas de revisión entregadas documentan la apariencia del frontend; no reemplazan la comprobación del despliegue público.
