# 📁 Estructura del Proyecto

```
suma-teologica-pdf/
│
├── 📄 index.html              # Página principal de la aplicación
├── 🎨 styles.css              # Estilos CSS (diseño y colores)
├── ⚙️ script.js               # Lógica JavaScript (extracción y PDF)
├── 🚫 .gitignore             # Archivos a ignorar en Git
│
├── 📖 README.md              # Documentación principal
├── 🚀 DEPLOYMENT.md          # Guía de despliegue en GitHub
├── 📚 EXAMPLES.md            # Ejemplos de uso y cuestiones recomendadas
└── 🎯 demo.html              # Página demo/preview (opcional)
```

## Archivos principales

### 📄 index.html (2.3 KB)
**Propósito**: Estructura HTML de la aplicación

**Contenido**:
- Header con título y subtítulo
- Formulario de selección (parte y número)
- Botón de generar PDF
- Área de loading/mensajes
- Vista previa del contenido
- Footer con créditos

**Dependencias**:
- styles.css (estilos)
- script.js (funcionalidad)
- jsPDF (CDN externo)

---

### 🎨 styles.css (5.2 KB)
**Propósito**: Diseño visual y responsive

**Características**:
- Variables CSS para colores personalizables
- Diseño responsive (móvil, tablet, desktop)
- Animaciones suaves
- Estilos para loading spinner
- Mensajes de error/éxito
- Scrollbar personalizada

**Paleta de colores**:
- Primary: #8B4513 (marrón oscuro)
- Secondary: #D2691E (chocolate)
- Accent: #CD853F (perú)
- Background: #FFF8DC (cornsilk)
- Text: #2C1810 (marrón muy oscuro)

---

### ⚙️ script.js (11 KB)
**Propósito**: Lógica principal de la aplicación

**Funciones principales**:
1. `generarPDF()` - Función principal que orquesta todo el proceso
2. `extraerContenido(html)` - Parsea el HTML y extrae la estructura
3. `crearPDF(contenido)` - Genera el documento PDF con formato
4. `mostrarVistaPrevia()` - Muestra preview del contenido
5. Funciones auxiliares de UI (showLoading, showError, etc.)

**Flujo de trabajo**:
```
Usuario click "Generar PDF"
    ↓
Construir URL (hjg.com.ar/sumat/[parte]/c[numero].html)
    ↓
Fetch con proxy CORS (AllOrigins)
    ↓
Parsear HTML y extraer contenido
    ↓
Mostrar vista previa
    ↓
Generar PDF con jsPDF
    ↓
Descargar automáticamente
```

**Estructura del contenido extraído**:
```javascript
{
  titulo: "Título de la cuestión",
  prologo: "Texto del prólogo",
  articulos: [
    {
      titulo: "Título del artículo",
      objeciones: ["objeción 1", "objeción 2", ...],
      sedContra: "Texto sed contra",
      respondo: "Texto respondo",
      adObjeciones: ["respuesta 1", "respuesta 2", ...]
    },
    // ... más artículos
  ]
}
```

---

## Flujo de datos

```
┌─────────────────┐
│  Usuario input  │
│  (parte, #)     │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Construir URL  │
│  hjg.com.ar     │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Fetch (proxy)  │
│  AllOrigins     │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Parse HTML     │
│  DOMParser      │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Extraer datos  │
│  (estructura)   │
└────────┬────────┘
         │
         ├────────────────┐
         │                │
         ↓                ↓
┌─────────────────┐  ┌─────────────────┐
│  Vista previa   │  │  Generar PDF    │
│  (HTML)         │  │  (jsPDF)        │
└─────────────────┘  └────────┬────────┘
                              │
                              ↓
                     ┌─────────────────┐
                     │  Descargar PDF  │
                     └─────────────────┘
```

## Tecnologías y dependencias

### Librerías externas (CDN)

1. **jsPDF** (v2.5.1)
   - URL: `https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js`
   - Propósito: Generar PDFs del lado del cliente
   - Licencia: MIT

2. **AllOrigins** (API)
   - URL: `https://api.allorigins.win/raw?url=...`
   - Propósito: Proxy CORS para fetch
   - Gratuito para uso personal

### Navegadores soportados

✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+
✅ Opera 76+
❌ Internet Explorer (no soportado)

## Tamaños de archivo

| Archivo | Tamaño | Comprimido (gzip) |
|---------|--------|-------------------|
| index.html | 2.3 KB | ~1.0 KB |
| styles.css | 5.2 KB | ~1.5 KB |
| script.js | 11 KB | ~3.0 KB |
| **Total** | **18.5 KB** | **~5.5 KB** |

*Nota: jsPDF se carga desde CDN (no cuenta en el tamaño)*

## Rendimiento

### Métricas estimadas

- **Tiempo de carga inicial**: < 1 segundo
- **Tiempo de fetch**: 2-5 segundos (depende de la red)
- **Tiempo de generación PDF**: 1-3 segundos
- **Tiempo total**: ~5-10 segundos

### Optimizaciones aplicadas

✅ Uso de CDN para librerías
✅ Código JavaScript minificable
✅ CSS optimizado sin dependencias pesadas
✅ Carga asíncrona de contenido
✅ Sin jQuery ni frameworks pesados

## Seguridad

### Consideraciones

✅ **No almacena datos**: Todo se procesa en el cliente
✅ **No usa cookies**: Sin tracking
✅ **HTTPS**: Compatible con GitHub Pages (SSL automático)
✅ **Sin autenticación**: No requiere login
✅ **Sin backend**: No hay servidor propio

### Limitaciones CORS

La aplicación usa AllOrigins como proxy para evitar problemas de CORS.
Alternativas si AllOrigins falla:
- cors-anywhere.herokuapp.com
- thingproxy.freeboard.io
- Implementar proxy propio

## Mantenimiento

### Actualizaciones necesarias

🔄 **Nunca** (salvo bugs):
- HTML estructura
- CSS estilos base

🔄 **Raramente**:
- jsPDF (nueva versión)
- AllOrigins (si cambia la API)

🔄 **Ocasionalmente**:
- Ajustes de diseño
- Mejoras de UX
- Nuevas características

## Próximas mejoras sugeridas

### Prioridad Alta
- [ ] Modo offline con Service Worker
- [ ] Caché de cuestiones ya descargadas
- [ ] Opción de descargar múltiples cuestiones

### Prioridad Media
- [ ] Búsqueda de texto en cuestiones
- [ ] Índice general navegable
- [ ] Compartir en redes sociales

### Prioridad Baja
- [ ] Modo oscuro
- [ ] Personalización de fuente
- [ ] Exportar a otros formatos (EPUB, DOCX)

---

**Versión**: 1.0.0
**Última actualización**: Noviembre 2025
**Licencia**: MIT
