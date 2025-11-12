# 📖 Generador de PDF - Suma Teológica

Aplicación web para generar PDFs formateados de las cuestiones de la Suma Teológica de Santo Tomás de Aquino.

## ✨ Características

- 📚 Acceso a todas las partes de la Suma Teológica:
  - Prima Pars (Ia)
  - Prima Secundae (I-II)
  - Secunda Secundae (II-II)
  - Tertia Pars (III)
- 🎨 Formato PDF profesional y elegante
- 📱 Diseño responsive (funciona en móviles y tablets)
- 👁️ Vista previa del contenido antes de generar
- 💾 Descarga automática del PDF
- 🌐 Extracción directa desde hjg.com.ar

## 🚀 Uso

1. Selecciona la parte de la Suma Teológica que deseas consultar
2. Ingresa el número de cuestión
3. Haz clic en "Generar PDF"
4. El PDF se descargará automáticamente

## 🛠️ Tecnologías utilizadas

- HTML5
- CSS3 (con diseño responsive)
- JavaScript (Vanilla JS)
- jsPDF (para generación de PDFs)
- AllOrigins (proxy CORS)

## 📦 Instalación y despliegue

### Opción 1: GitHub Pages

1. Sube los archivos a un repositorio de GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Suma Teológica PDF Generator"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/suma-teologica-pdf.git
   git push -u origin main
   ```

2. Activa GitHub Pages:
   - Ve a Settings → Pages
   - En "Source" selecciona "main" branch
   - Guarda los cambios

3. Tu aplicación estará disponible en:
   `https://TU_USUARIO.github.io/suma-teologica-pdf/`

### Opción 2: Uso local

Simplemente abre el archivo `index.html` en tu navegador web.

## 📁 Estructura del proyecto

```
suma-teologica-pdf/
│
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # Lógica JavaScript
└── README.md          # Este archivo
```

## 🎯 Características del PDF generado

- ✅ Portada con información de la parte y cuestión
- ✅ Título de la cuestión
- ✅ Prólogo (cuando existe)
- ✅ Todos los artículos con:
  - Título del artículo
  - Objeciones
  - Sed Contra
  - Respondo
  - Respuestas a las objeciones
- ✅ Numeración de páginas
- ✅ Fuente citada en cada página

## 🌐 Fuente de datos

Los datos se extraen de: [hjg.com.ar/sumat](https://hjg.com.ar/sumat/)

## 📝 Notas

- La aplicación utiliza un proxy CORS (AllOrigins) para acceder al contenido
- Se recomienda verificar que el número de cuestión exista para la parte seleccionada
- El PDF se genera en formato A4 con márgenes apropiados para impresión

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo licencia MIT.

## 🙏 Créditos

- **Fuente de contenido**: [hjg.com.ar/sumat](https://hjg.com.ar/sumat/)
- **Santo Tomás de Aquino**: Autor de la Suma Teológica
- Desarrollado con ❤️ para facilitar el estudio de la filosofía tomista

## 📧 Contacto

Si tienes preguntas o sugerencias, no dudes en abrir un issue en GitHub.

---

**Ad maiorem Dei gloriam** ✝️
