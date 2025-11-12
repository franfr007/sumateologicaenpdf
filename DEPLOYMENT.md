# 🚀 Guía de Despliegue en GitHub

## Paso 1: Preparar el repositorio

1. Ve a [GitHub](https://github.com) e inicia sesión
2. Haz clic en el botón verde "New" para crear un nuevo repositorio
3. Configura el repositorio:
   - **Repository name**: `suma-teologica-pdf` (o el nombre que prefieras)
   - **Description**: "Generador de PDF para la Suma Teológica de Santo Tomás de Aquino"
   - **Public** o **Private**: Elige según tu preferencia (debe ser Public para GitHub Pages gratis)
   - ✅ Marca "Add a README file"
   - Haz clic en "Create repository"

## Paso 2: Subir los archivos

### Opción A: Desde la interfaz web de GitHub

1. En tu nuevo repositorio, haz clic en "Add file" → "Upload files"
2. Arrastra estos archivos:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `.gitignore` (opcional)
3. En el cuadro de commit, escribe: "Versión inicial del generador de PDF"
4. Haz clic en "Commit changes"

### Opción B: Desde la línea de comandos

```bash
# Navega a la carpeta donde están los archivos
cd /ruta/a/tus/archivos

# Inicializa git (si no lo has hecho)
git init

# Agrega el repositorio remoto (reemplaza TU_USUARIO y suma-teologica-pdf)
git remote add origin https://github.com/TU_USUARIO/suma-teologica-pdf.git

# Agrega todos los archivos
git add .

# Haz commit
git commit -m "Versión inicial del generador de PDF"

# Configura la rama principal
git branch -M main

# Sube los archivos
git push -u origin main
```

## Paso 3: Activar GitHub Pages

1. En tu repositorio de GitHub, ve a **Settings** (Configuración)
2. En el menú lateral izquierdo, busca **Pages**
3. En la sección "Source":
   - **Branch**: Selecciona `main`
   - **Folder**: Selecciona `/ (root)`
4. Haz clic en **Save**
5. Espera unos minutos (GitHub te mostrará un mensaje cuando esté listo)
6. Tu sitio estará disponible en: `https://TU_USUARIO.github.io/suma-teologica-pdf/`

## Paso 4: Verifica que funcione

1. Abre la URL de tu GitHub Pages
2. Prueba seleccionar "Prima Pars" y número "85"
3. Haz clic en "Generar PDF"
4. Verifica que se descargue el PDF correctamente

## 🎨 Personalización (Opcional)

### Cambiar colores

En `styles.css`, busca la sección `:root` y modifica los colores:

```css
:root {
    --primary-color: #8B4513;      /* Color principal */
    --secondary-color: #D2691E;    /* Color secundario */
    --accent-color: #CD853F;       /* Color de acento */
    /* ... más colores ... */
}
```

### Agregar Google Analytics (opcional)

En `index.html`, antes de `</head>`, agrega:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=TU_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'TU_ID');
</script>
```

### Agregar dominio personalizado

1. Compra un dominio (por ejemplo, en Namecheap, GoDaddy, etc.)
2. En GitHub Pages settings, agrega tu dominio personalizado
3. Configura los DNS de tu dominio:
   - Tipo: `A`
   - Host: `@`
   - Value: 
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`

## 🔧 Mantenimiento

### Actualizar la aplicación

Después de hacer cambios en los archivos:

```bash
git add .
git commit -m "Descripción de los cambios"
git push
```

GitHub Pages se actualizará automáticamente en unos minutos.

## 📊 Estadísticas de uso

Para ver estadísticas de uso:

1. Ve a tu repositorio en GitHub
2. Haz clic en "Insights"
3. Selecciona "Traffic" para ver visitas

## ⚡ Mejoras futuras sugeridas

- [ ] Agregar opción de compartir en redes sociales
- [ ] Permitir seleccionar el tamaño de fuente
- [ ] Agregar modo oscuro
- [ ] Permitir descargar múltiples cuestiones a la vez
- [ ] Agregar búsqueda de texto dentro de las cuestiones
- [ ] Crear índice general de todas las cuestiones

## 🐛 Solución de problemas

### "No se pudo cargar la cuestión"
- Verifica que el número de cuestión existe para esa parte
- Verifica tu conexión a internet

### El PDF no se descarga
- Verifica que tu navegador permite descargas
- Prueba con otro navegador

### Error de CORS
- La aplicación usa AllOrigins como proxy, si falla intenta más tarde

## 📱 Compatibilidad

- ✅ Chrome (recomendado)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Opera
- ⚠️ Internet Explorer (no soportado)

## 🤝 Compartir tu proyecto

Comparte tu aplicación con:

- Profesores de filosofía y teología
- Estudiantes de seminario
- Comunidades académicas católicas
- Grupos de estudio tomista

## 📧 Soporte

Si encuentras problemas, puedes:

1. Abrir un "Issue" en GitHub
2. Buscar ayuda en comunidades de desarrollo
3. Revisar la consola del navegador (F12) para ver errores

---

**¡Éxito con tu proyecto!** 🎉

Si tienes preguntas, no dudes en buscar ayuda en la comunidad de GitHub.
