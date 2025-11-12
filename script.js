// Mapeo de partes
const partes = {
    'a': { nombre: 'Prima Pars', codigo: 'Ia' },
    'b': { nombre: 'Prima Secundae', codigo: 'I-II' },
    'c': { nombre: 'Secunda Secundae', codigo: 'II-II' },
    'd': { nombre: 'Tertia Pars', codigo: 'III' }
};

// Elementos del DOM
let btnGenerar, loading, errorDiv, successDiv, previewSection, preview;

document.addEventListener('DOMContentLoaded', () => {
    btnGenerar = document.getElementById('btnGenerar');
    loading = document.getElementById('loading');
    errorDiv = document.getElementById('error');
    successDiv = document.getElementById('success');
    previewSection = document.getElementById('previewSection');
    preview = document.getElementById('preview');

    btnGenerar.addEventListener('click', generarPDF);
    
    // Permitir generar con Enter
    document.getElementById('cuestion').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            generarPDF();
        }
    });
});

function showLoading() {
    loading.classList.remove('hidden');
    errorDiv.classList.add('hidden');
    successDiv.classList.add('hidden');
    btnGenerar.disabled = true;
}

function hideLoading() {
    loading.classList.add('hidden');
    btnGenerar.disabled = false;
}

function showError(mensaje) {
    errorDiv.textContent = '❌ ' + mensaje;
    errorDiv.classList.remove('hidden');
    successDiv.classList.add('hidden');
}

function showSuccess(mensaje) {
    successDiv.textContent = '✅ ' + mensaje;
    successDiv.classList.remove('hidden');
    errorDiv.classList.add('hidden');
}

async function generarPDF() {
    const parte = document.getElementById('parte').value;
    const cuestion = document.getElementById('cuestion').value;

    if (!cuestion || cuestion < 1) {
        showError('Por favor, ingresa un número de cuestión válido.');
        return;
    }

    showLoading();
    previewSection.classList.add('hidden');

    try {
        // Construir URL
        const url = `https://hjg.com.ar/sumat/${parte}/c${cuestion}.html`;
        
        // Fetch con CORS proxy
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl);
        
        if (!response.ok) {
            throw new Error('No se pudo cargar la cuestión. Verifica que el número de cuestión exista para esta parte.');
        }

        const html = await response.text();
        const contenido = extraerContenido(html);
        
        if (!contenido.titulo) {
            throw new Error('No se pudo extraer el contenido correctamente.');
        }

        // Mostrar vista previa
        mostrarVistaPrevia(contenido);

        // Generar PDF
        await crearPDF(contenido, parte, cuestion);

        hideLoading();
        showSuccess('¡PDF generado y descargado exitosamente!');

    } catch (error) {
        hideLoading();
        showError(error.message);
        console.error('Error:', error);
    }
}

function extraerContenido(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const contenido = {
        titulo: '',
        prologo: '',
        articulos: []
    };

    // Extraer título de la cuestión
    const tituloDiv = doc.querySelector('.qtit');
    if (tituloDiv) {
        contenido.titulo = tituloDiv.textContent.trim();
    }

    // Extraer prólogo
    const prologoDiv = doc.querySelector('#qprol');
    if (prologoDiv) {
        contenido.prologo = prologoDiv.textContent.trim();
    }

    // Extraer artículos
    const articulos = doc.querySelectorAll('.art');
    articulos.forEach((art) => {
        const articulo = {
            titulo: '',
            objeciones: [],
            sedContra: '',
            respondo: '',
            adObjeciones: []
        };

        // Título del artículo
        const tituloArt = art.querySelector('.atit');
        if (tituloArt) {
            // Eliminar el enlace "lat"
            const cloneTitulo = tituloArt.cloneNode(true);
            const latLink = cloneTitulo.querySelector('.lat');
            if (latLink) latLink.remove();
            articulo.titulo = cloneTitulo.textContent.trim();
        }

        // Objeciones
        const objeciones = art.querySelectorAll('.ao');
        objeciones.forEach((obj, index) => {
            if (index === 0 && obj.textContent.includes('Objeciones')) return; // Saltar el encabezado
            articulo.objeciones.push(obj.textContent.trim());
        });

        // Sed contra
        const sedContra = art.querySelector('.asedc');
        if (sedContra) {
            articulo.sedContra = sedContra.textContent.trim();
        }

        // Respondo
        const respondo = art.querySelector('.aresp');
        if (respondo) {
            articulo.respondo = respondo.textContent.trim();
        }

        // Respuestas a las objeciones
        const adObjeciones = art.querySelectorAll('.aado');
        adObjeciones.forEach((ad, index) => {
            if (index === 0 && ad.textContent.includes('A las objeciones')) return; // Saltar el encabezado
            articulo.adObjeciones.push(ad.textContent.trim());
        });

        if (articulo.titulo) {
            contenido.articulos.push(articulo);
        }
    });

    return contenido;
}

function mostrarVistaPrevia(contenido) {
    let html = `<h4>${contenido.titulo}</h4>`;
    
    if (contenido.prologo) {
        html += `<p><strong>Prólogo:</strong><br>${contenido.prologo}</p>`;
    }

    html += `<p><strong>Total de artículos:</strong> ${contenido.articulos.length}</p>`;

    contenido.articulos.forEach((art, index) => {
        html += `<h4>${art.titulo}</h4>`;
    });

    preview.innerHTML = html;
    previewSection.classList.remove('hidden');
}

async function crearPDF(contenido, parte, cuestion) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - (2 * margin);
    let y = margin;

    // Función para agregar nueva página si es necesario
    function checkPageBreak(height = 10) {
        if (y + height > pageHeight - margin) {
            doc.addPage();
            y = margin;
            return true;
        }
        return false;
    }

    // Función para agregar texto con wrap
    function addText(text, fontSize, isBold = false, isItalic = false, align = 'left') {
        doc.setFontSize(fontSize);
        doc.setFont('times', isBold ? 'bold' : (isItalic ? 'italic' : 'normal'));
        
        const lines = doc.splitTextToSize(text, maxWidth);
        
        lines.forEach((line, index) => {
            checkPageBreak(fontSize * 0.5);
            
            let x = margin;
            if (align === 'center') {
                x = pageWidth / 2;
            } else if (align === 'right') {
                x = pageWidth - margin;
            }
            
            doc.text(line, x, y, { align: align });
            y += fontSize * 0.5;
        });
        
        y += 3;
    }

    // Portada
    doc.setFillColor(139, 69, 19); // Color marrón
    doc.rect(0, 0, pageWidth, 60, 'F');
    
    doc.setTextColor(255, 248, 220);
    doc.setFontSize(24);
    doc.setFont('times', 'bold');
    doc.text('SUMA TEOLÓGICA', pageWidth / 2, 25, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text('Santo Tomás de Aquino', pageWidth / 2, 35, { align: 'center' });
    
    doc.setFontSize(14);
    const parteInfo = partes[parte];
    doc.text(`${parteInfo.nombre} (${parteInfo.codigo})`, pageWidth / 2, 45, { align: 'center' });
    doc.text(`Cuestión ${cuestion}`, pageWidth / 2, 53, { align: 'center' });

    doc.setTextColor(0, 0, 0);
    y = 80;

    // Título de la cuestión
    addText(contenido.titulo.toUpperCase(), 16, true, false, 'center');
    y += 5;

    // Línea separadora
    doc.setDrawColor(139, 69, 19);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // Prólogo
    if (contenido.prologo) {
        addText('PRÓLOGO', 12, true);
        addText(contenido.prologo, 10, false, false, 'justify');
        y += 5;
    }

    // Artículos
    contenido.articulos.forEach((articulo, index) => {
        checkPageBreak(20);
        
        // Título del artículo
        addText(articulo.titulo, 12, true);
        y += 3;

        // Objeciones
        if (articulo.objeciones.length > 1) {
            addText('OBJECIONES:', 11, true);
            articulo.objeciones.slice(1).forEach((obj, i) => {
                addText(obj, 10, false, false, 'justify');
            });
            y += 3;
        }

        // Sed contra
        if (articulo.sedContra) {
            addText(articulo.sedContra, 10, false, true, 'justify');
            y += 3;
        }

        // Respondo
        if (articulo.respondo) {
            addText('RESPONDO:', 11, true);
            addText(articulo.respondo, 10, false, false, 'justify');
            y += 3;
        }

        // Respuestas a las objeciones
        if (articulo.adObjeciones.length > 1) {
            addText('RESPUESTAS A LAS OBJECIONES:', 11, true);
            articulo.adObjeciones.slice(1).forEach((ad, i) => {
                addText(ad, 10, false, false, 'justify');
            });
        }

        // Separador entre artículos
        if (index < contenido.articulos.length - 1) {
            y += 5;
            checkPageBreak(15);
            doc.setDrawColor(210, 180, 140);
            doc.setLineWidth(0.3);
            doc.line(margin + 30, y, pageWidth - margin - 30, y);
            y += 10;
        }
    });

    // Pie de página en todas las páginas
    const totalPages = doc.internal.getNumberOfPages();
    doc.setFontSize(9);
    doc.setTextColor(100);
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.text(
            `Fuente: hjg.com.ar/sumat | Página ${i} de ${totalPages}`,
            pageWidth / 2,
            pageHeight - 10,
            { align: 'center' }
        );
    }

    // Guardar PDF
    const nombreArchivo = `Suma_Teologica_${parteInfo.codigo}_Cuestion_${cuestion}.pdf`;
    doc.save(nombreArchivo);
}
