// Mapeo de partes
const partes = {
    'a': { nombre: 'Prima Pars', codigo: 'Ia' },
    'b': { nombre: 'Prima Secundae', codigo: 'I-II' },
    'c': { nombre: 'Secunda Secundae', codigo: 'II-II' },
    'd': { nombre: 'Tertia Pars', codigo: 'III' }
};

let btnGenerar, loading, errorDiv, successDiv, previewSection, preview;

document.addEventListener('DOMContentLoaded', () => {
    btnGenerar = document.getElementById('btnGenerar');
    loading = document.getElementById('loading');
    errorDiv = document.getElementById('error');
    successDiv = document.getElementById('success');
    previewSection = document.getElementById('previewSection');
    preview = document.getElementById('preview');
    btnGenerar.addEventListener('click', generarPDF);
    document.getElementById('cuestion').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') generarPDF();
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
        const url = `https://hjg.com.ar/sumat/${parte}/c${cuestion}.html`;
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl);
        
        if (!response.ok) {
            throw new Error('No se pudo cargar la cuestión. Verifica que el número exista.');
        }

        const html = await response.text();
        const contenido = extraerContenido(html);
        
        if (!contenido.titulo) {
            throw new Error('No se pudo extraer el contenido.');
        }

        mostrarVistaPrevia(contenido);
        await crearPDF(contenido, parte, cuestion);
        hideLoading();
        showSuccess('¡PDF generado exitosamente!');

    } catch (error) {
        hideLoading();
        showError(error.message);
        console.error('Error:', error);
    }
}

function extraerContenido(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const contenido = { titulo: '', prologo: '', articulos: [] };

    function limpiarTexto(elemento) {
        if (!elemento) return '';
        const clone = elemento.cloneNode(true);
        clone.querySelectorAll('script, style, .lat').forEach(el => el.remove());
        return (clone.textContent || '').replace(/\s+/g, ' ').trim();
    }

    const tituloDiv = doc.querySelector('.qtit');
    if (tituloDiv) contenido.titulo = limpiarTexto(tituloDiv);

    const prologoDiv = doc.querySelector('#qprol');
    if (prologoDiv) contenido.prologo = limpiarTexto(prologoDiv);

    doc.querySelectorAll('.art').forEach((art) => {
        const articulo = {
            titulo: '',
            objeciones: [],
            sedContra: '',
            respondo: '',
            adObjeciones: []
        };

        const tituloArt = art.querySelector('.atit');
        if (tituloArt) articulo.titulo = limpiarTexto(tituloArt);

        art.querySelectorAll('.ao').forEach((obj, i) => {
            const texto = limpiarTexto(obj);
            if (i > 0 || !texto.includes('Objeciones')) articulo.objeciones.push(texto);
        });

        const sedContra = art.querySelector('.asedc');
        if (sedContra) articulo.sedContra = limpiarTexto(sedContra);

        const respondo = art.querySelector('.aresp');
        if (respondo) articulo.respondo = limpiarTexto(respondo);

        art.querySelectorAll('.aado').forEach((ad, i) => {
            const texto = limpiarTexto(ad);
            if (i > 0 || !texto.includes('A las objeciones')) articulo.adObjeciones.push(texto);
        });

        if (articulo.titulo) contenido.articulos.push(articulo);
    });

    return contenido;
}

function mostrarVistaPrevia(contenido) {
    let html = `<h4>${contenido.titulo}</h4>`;
    if (contenido.prologo) {
        html += `<p><strong>Prólogo</strong> (${contenido.prologo.substring(0, 150)}...)</p>`;
    }
    html += `<p><strong>Artículos:</strong> ${contenido.articulos.length}</p>`;
    contenido.articulos.forEach(art => {
        html += `<h4>${art.titulo}</h4>`;
    });
    preview.innerHTML = html;
    previewSection.classList.remove('hidden');
}

async function crearPDF(contenido, parte, cuestion) {
    const parteInfo = partes[parte];
    const pdfContent = document.createElement('div');
    pdfContent.style.cssText = 'font-family: Georgia, serif; padding: 20px; font-size: 11pt; line-height: 1.6; color: #000;';
    
    pdfContent.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; background: #8B4513; color: white; margin: -20px -20px 30px;">
            <h1 style="font-size: 24pt; margin: 0 0 10px;">SUMA TEOLÓGICA</h1>
            <h2 style="font-size: 16pt; margin: 0 0 10px;">Santo Tomás de Aquino</h2>
            <h3 style="font-size: 14pt; margin: 0 0 5px;">${parteInfo.nombre} (${parteInfo.codigo})</h3>
            <h3 style="font-size: 14pt; margin: 0;">Cuestión ${cuestion}</h3>
        </div>
        
        <h2 style="text-align: center; color: #8B4513; margin: 20px 0; text-transform: uppercase;">${contenido.titulo}</h2>
        <hr style="border: none; border-top: 2px solid #8B4513; margin: 20px 0;">
    `;
    
    if (contenido.prologo) {
        pdfContent.innerHTML += `
            <h3 style="color: #8B4513; margin: 20px 0 10px;">PRÓLOGO</h3>
            <p style="text-align: justify; margin: 10px 0;">${contenido.prologo}</p>
        `;
    }
    
    contenido.articulos.forEach((art, idx) => {
        let html = `<div style="margin-top: 25px;"><h3 style="color: #8B4513; margin: 15px 0 10px;">${art.titulo}</h3>`;
        
        if (art.objeciones.length > 0) {
            html += `<h4 style="color: #555; font-size: 11pt; margin: 15px 0 5px;">OBJECIONES:</h4>`;
            art.objeciones.forEach(obj => {
                html += `<p style="text-align: justify; margin: 8px 0;">${obj}</p>`;
            });
        }
        
        if (art.sedContra) {
            html += `<p style="text-align: justify; margin: 15px 0; font-style: italic;"><strong>Contra esto:</strong> ${art.sedContra}</p>`;
        }
        
        if (art.respondo) {
            html += `<h4 style="color: #555; font-size: 11pt; margin: 15px 0 5px;">RESPONDO:</h4>`;
            html += `<p style="text-align: justify; margin: 8px 0;">${art.respondo}</p>`;
        }
        
        if (art.adObjeciones.length > 0) {
            html += `<h4 style="color: #555; font-size: 11pt; margin: 15px 0 5px;">RESPUESTAS A LAS OBJECIONES:</h4>`;
            art.adObjeciones.forEach(ad => {
                html += `<p style="text-align: justify; margin: 8px 0;">${ad}</p>`;
            });
        }
        
        html += `</div>`;
        if (idx < contenido.articulos.length - 1) {
            html += `<hr style="border: none; border-top: 1px solid #DEB887; margin: 30px 60px;">`;
        }
        pdfContent.innerHTML += html;
    });
    
    pdfContent.innerHTML += `
        <div style="margin-top: 40px; text-align: center; font-size: 9pt; color: #666; border-top: 1px solid #ddd; padding-top: 10px;">
            <p>Fuente: hjg.com.ar/sumat</p>
        </div>
    `;
    
    const opt = {
        margin: [15, 15, 20, 15],
        filename: `Suma_Teologica_${parteInfo.codigo}_Cuestion_${cuestion}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
    
    await html2pdf().set(opt).from(pdfContent).save();
}
