# TIME-LINE-V1

Aplicación web (HTML/CSS/JS) para crear líneas de tiempo por temas con:

- múltiples líneas independientes,
- vista horizontal (izquierda a derecha) y vertical,
- selección de color por línea,
- eventos con fecha, descripción, imagen y link,
- periodos entre fechas,
- edición y eliminación de eventos/periodos,
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

## ¿Cómo usar la app?

1. Completa "Nueva línea de tiempo" (nombre, color y vista).
2. Pulsa **Crear línea**.
3. Dentro de cada línea puedes:
   - añadir **eventos** (fecha, descripción, imagen y link),
   - añadir **periodos** (inicio, fin y nombre del periodo),
   - cambiar color y orientación,
   - editar o eliminar cualquier elemento.

## Problemas frecuentes

### "No se abre nada al hacer doble clic"

- Clic derecho sobre `index.html` → **Abrir con** → elige Chrome/Edge/Firefox.

### "python3: command not found"

- Prueba con:

```bash
python -m http.server 4173 --directory /workspace/TIME-LINE-V1
```

### "El puerto 4173 está ocupado"

- Cambia el puerto, por ejemplo 8080:

```bash
python3 -m http.server 8080 --directory /workspace/TIME-LINE-V1
```

- Y abre:

```text
http://localhost:8080/index.html
```
