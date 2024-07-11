// Aspetta che il DOM sia completamente caricato prima di eseguire lo script
document.addEventListener('DOMContentLoaded', function() {
    loadMenu();
    loadContent();
});

// Funzione per caricare il menu da un file JSON
function loadMenu() {
    fetch('menu.json')
        .then(response => response.json())
        .then(data => {
            const nav = document.getElementById('main-nav');
            nav.innerHTML = createMenuHTML(data);
        })
        .catch(error => console.error('Errore nel caricamento del menu:', error));
}

// Funzione per creare l'HTML del menu
function createMenuHTML(menuData) {
    return `<ul>${menuData.map(item => {
        if (item.dropdown) {
            // Crea un elemento di menu dropdown se sono presenti sottovoci
            return `
                <li class="dropdown">
                    <a href="${item.link}">${item.text}</a>
                    <div class="dropdown-content">
                        ${item.dropdown.map(subItem => `<a href="${subItem.link}">${subItem.text}</a>`).join('')}
                    </div>
                </li>
            `;
        } else {
            // Crea un elemento di menu semplice se non ci sono sottovoci
            return `<li><a href="${item.link}">${item.text}</a></li>`;
        }
    }).join('')}</ul>`;
}

// Funzione per caricare il contenuto della pagina corrente
function loadContent() {
    // Determina il nome della pagina corrente
    let pageName = window.location.pathname.split("/").pop().split(".")[0];
    if (pageName === '' || pageName === 'index') {
        pageName = 'previdenza-complementare';
    }
    console.log('Caricamento contenuto per la pagina:', pageName);

    // Carica il JSON corrispondente alla pagina
    fetch(`${pageName}-content.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Dati JSON caricati:', data);
            const content = document.getElementById('content');
            content.innerHTML = createContentHTML(data);
            initSortable();
        })
        .catch(error => {
            console.error('Errore nel caricamento dei contenuti:', error);
            document.getElementById('content').innerHTML = `<p>Errore nel caricamento dei contenuti: ${error.message}</p>`;
        });
}

// Funzione per creare l'HTML del contenuto
function createContentHTML(contentData) {
    return contentData.sections.map(section => `
        <div class="content-box" data-id="${section.id}">
            <h2>${section.title}</h2>
            <p>${section.text}</p>
            <a href="${section.cta.link}" class="cta-button">${section.cta.text}</a>
        </div>
    `).join('');
}

// Funzione per inizializzare la funzionalità di riordino
function initSortable() {
    new Sortable(document.getElementById('content'), {
        animation: 150,
        ghostClass: 'blue-background-class',
        onEnd: function(evt) {
            console.log('Nuovo ordine:', getContentOrder());
        }
    });
}

// Funzione per ottenere l'ordine corrente dei contenuti
function getContentOrder() {
    return Array.from(document.querySelectorAll('.content-box'))
        .map(box => box.getAttribute('data-id'));
}