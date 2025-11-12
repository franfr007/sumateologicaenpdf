const WORKER_URL = 'https://suma-teologica-proxy.francisco-fernandezr.workers.dev';

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
    btnGenerar.addEventListener('click', generarHTML);
    document.getElementById('cuestion').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') generarHTML();
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

async function generarHTML() {
    const parte = document.getElementById('parte').value;
    const cuestion = document.getElementById('cuestion').value;

    if (!cuestion || cuestion < 1) {
        showError('Ingresa un número de cuestión válido.');
        return;
    }

    showLoading();
    previewSection.classList.add('hidden');

    try {
        const targetUrl = `https://hjg.com.ar/sumat/${parte}/c${cuestion}.html`;
        const proxyUrl = `${WORKER_URL}?url=${encodeURIComponent(targetUrl)}`;
        
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error('No se pudo cargar la cuestión. Verifica el número.');
        
        const html = await response.text();
        const contenido = extraerContenido(html);
        
        if (!contenido.titulo) {
            throw new Error('No se pudo extraer el contenido.');
        }

        mostrarVistaPrevia(contenido);
        descargarHTML(contenido, parte, cuestion);
        hideLoading();
        showSuccess('¡HTML generado exitosamente!');

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
            if (i > 0 || !texto.includes('Objeciones')) {
                if (texto) articulo.objeciones.push(texto);
            }
        });

        const sedContra = art.querySelector('.asedc');
        if (sedContra) articulo.sedContra = limpiarTexto(sedContra);

        const respondo = art.querySelector('.aresp');
        if (respondo) articulo.respondo = limpiarTexto(respondo);

        art.querySelectorAll('.aado').forEach((ad, i) => {
            const texto = limpiarTexto(ad);
            if (i > 0 || !texto.includes('A las objeciones')) {
                if (texto) articulo.adObjeciones.push(texto);
            }
        });

        if (articulo.titulo) contenido.articulos.push(articulo);
    });

    return contenido;
}

function mostrarVistaPrevia(contenido) {
    let html = `<h4>${contenido.titulo}</h4>`;
    if (contenido.prologo) {
        html += `<p><strong>Prólogo:</strong> ${contenido.prologo.substring(0, 150)}...</p>`;
    }
    html += `<p><strong>Artículos:</strong> ${contenido.articulos.length}</p>`;
    contenido.articulos.forEach(art => {
        html += `<p>• ${art.titulo}</p>`;
    });
    preview.innerHTML = html;
    previewSection.classList.remove('hidden');
}

function descargarHTML(contenido, parte, cuestion) {
    const parteInfo = partes[parte];
    
    const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Suma Teológica - ${parteInfo.codigo} - Cuestión ${cuestion}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: Georgia, 'Times New Roman', serif;
            line-height: 1.6;
            color: #2C1810;
            background: #FFF8DC;
            padding: 20px;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .portada {
            text-align: center;
            padding: 60px 20px;
            background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%);
            color: white;
            margin: -40px -40px 40px;
        }
        .portada h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .portada h2 {
            font-size: 1.5em;
            margin-bottom: 10px;
            font-weight: normal;
        }
        .portada h3 {
            font-size: 1.2em;
            margin-top: 5px;
            font-weight: normal;
        }
        .titulo-cuestion {
            text-align: center;
            color: #8B4513;
            margin: 30px 0;
            font-size: 1.8em;
            text-transform: uppercase;
        }
        hr {
            border: none;
            border-top: 2px solid #8B4513;
            margin: 20px 0;
        }
        h3 {
            color: #8B4513;
            margin: 25px 0 15px;
            font-size: 1.4em;
        }
        h4 {
            color: #555;
            margin: 20px 0 10px;
            font-size: 1.1em;
        }
        p {
            text-align: justify;
            margin: 15px 0;
            line-height: 1.8;
        }
        .articulo {
            margin: 40px 0;
            padding: 20px 0;
        }
        .articulo-separador {
            border: none;
            border-top: 1px solid #DEB887;
            margin: 30px 60px;
        }
        .sed-contra {
            font-style: italic;
            margin: 20px 0;
            padding: 15px;
            background: #FFFACD;
            border-left: 4px solid #FFD700;
        }
        footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 0.9em;
            color: #666;
        }
        @media print {
            body { background: white; }
            .container { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="portada">
            <h1>SUMA TEOLÓGICA</h1>
            <h2>Santo Tomás de Aquino</h2>
            <h3>${parteInfo.nombre} (${parteInfo.codigo})</h3>
            <h3>Cuestión ${cuestion}</h3>
        </div>
        
        <h2 class="titulo-cuestion">${contenido.titulo}</h2>
        <hr>
        
        ${contenido.prologo ? `
        <section>
            <h3>PRÓLOGO</h3>
            <p>${contenido.prologo}</p>
        </section>
        ` : ''}
        
        ${contenido.articulos.map((art, idx) => `
        <article class="articulo">
            <h3>${art.titulo}</h3>
            
            ${art.objeciones.length > 0 ? `
            <div>
                <h4>OBJECIONES:</h4>
                ${art.objeciones.map(obj => `<p>${obj}</p>`).join('')}
            </div>
            ` : ''}
            
            ${art.sedContra ? `
            <div class="sed-contra">
                <strong>Contra esto:</strong> ${art.sedContra}
            </div>
            ` : ''}
            
            ${art.respondo ? `
            <div>
                <h4>RESPONDO:</h4>
                <p>${art.respondo}</p>
            </div>
            ` : ''}
            
            ${art.adObjeciones.length > 0 ? `
            <div>
                <h4>RESPUESTAS A LAS OBJECIONES:</h4>
                ${art.adObjeciones.map(ad => `<p>${ad}</p>`).join('')}
            </div>
            ` : ''}
        </article>
        ${idx < contenido.articulos.length - 1 ? '<hr class="articulo-separador">' : ''}
        `).join('')}
        
        <footer>
            <p>Fuente: <a href="https://hjg.com.ar/sumat/">hjg.com.ar/sumat</a></p>
            <p>Suma Teológica de Santo Tomás de Aquino</p>
        </footer>
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Suma_Teologica_${parteInfo.codigo}_Cuestion_${cuestion}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
