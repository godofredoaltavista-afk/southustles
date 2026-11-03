# Modo Zen — aviso de origen

Este directorio es el build compilado de un fork local de
[scottsts/Sandboard](https://github.com/scottstts/Sandboard), licenciado
GPLv3 (ver `LICENSE` en esta misma carpeta). El fork vive fuera de este
repositorio; lo que se distribuye acá es el resultado de `vite build`.

Cambios respecto al original:

- Reemplazado el modelo 3D de la palmera (`scene_assets/coconut_tree.glb`)
  por una piedra propia de Apacheta.
- Reajustado el ángulo/elevación de la luz y la fuerza del mecido por
  viento para esa piedra.
- Marca: "Sandboard" reemplazado por "Apacheta Sand Lab" (fuente propia
  `apacheta-display.otf`).
- Dos strings del mensaje de error cuando el navegador no soporta WebGPU,
  traducidos y reescritos con la voz de Apacheta.

Sin cambios en el motor de simulación de arena en sí.
