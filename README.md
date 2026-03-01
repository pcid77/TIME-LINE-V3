# TIME-LINE-V1

Aplicación web (HTML/CSS/JS) para crear líneas de tiempo por temas con:

- múltiples líneas independientes,
- vista horizontal (izquierda a derecha) y vertical,
- selección de color por línea,
- menú único de carga para elegir en qué línea insertar eventos/periodos,
- eventos con fecha, descripción, imagen y link,
- periodos resaltados dentro de la propia línea,
- nombre de cada línea visible dentro del trazo de la línea,
- edición y eliminación de eventos/periodos,
- vista general grande con selección de una o varias líneas para verlas juntas,
- persistencia local en `localStorage`.

## ¿Cómo ponerlo en marcha? (paso a paso)

> Si no tienes experiencia técnica, usa la **Opción 1**.

### Opción 1 (la más fácil): abrir el archivo directamente

1. Entra en la carpeta del proyecto.
2. Haz doble clic en `index.html`.
3. Se abrirá en tu navegador (Chrome/Edge/Firefox).
4. Ya puedes crear tu primera línea de tiempo.

### Opción 2 (recomendada): servidor local

Esta opción evita problemas con algunos navegadores y rutas de archivos.

1. Abre una terminal en la carpeta del proyecto.
2. Ejecuta este comando:

```bash
python3 -m http.server 4173 --directory /workspace/TIME-LINE-V1
```

3. Abre en el navegador:

```text
http://localhost:4173/index.html
```

4. Para detener el servidor, vuelve a la terminal y pulsa `Ctrl + C`.
