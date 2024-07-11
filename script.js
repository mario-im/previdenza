// Attende che il DOM sia completamente caricato prima di eseguire le funzioni
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
            initMobileMenu();
        })
        .catch(error => console.error('Errore nel caricamento del menu:', error));
}

// Funzione per creare l'HTML del menu basato sui dati JSON
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

// Inizializza il comportamento del menu per dispositivi mobili
function initMobileMenu() {
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                this.classList.toggle('active');
            }
        });
    });
}

// Funzione per caricare il contenuto della pagina
function loadContent() {
    // Determina il nome della pagina corrente
    let pageName = window.location.pathname.split("/").pop().split(".")[0];
    if (pageName === '' || pageName === 'index') {
        pageName = 'previdenza-complementare';
    }
    // Carica il JSON corrispondente alla pagina
    fetch(`${pageName}-content.json`)
        .then(response => response.json())
        .then(data => {
            const content = document.getElementById('content');
            content.innerHTML = createContentHTML(data);
            initSortable();
        })
        .catch(error => console.error('Errore nel caricamento dei contenuti:', error));
}

// Funzione per creare l'HTML del contenuto basato sui dati JSON
function createContentHTML(contentData) {
    return contentData.sections.map(section => `
        <div class="content-box" data-id="${section.id}">
            <h2>${section.title}</h2>
            <p>${section.text}</p>
            <a href="${section.cta.link}" class="cta-button">${section.cta.text}</a>
        </div>
    `).join('');
}

// Inizializza la funzionalità di riordino dei contenuti
function initSortable() {
    new Sortable(document.getElementById('content'), {
        animation: 150,
        ghostClass: 'blue-background-class'
    });
}