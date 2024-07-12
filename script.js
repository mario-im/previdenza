// Attende che il DOM sia completamente caricato prima di eseguire le funzioni
document.addEventListener('DOMContentLoaded', function() {
    loadMenu();
    loadContent();
    initScrollBehavior();
    initMobileMenu();
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

// Funzione per caricare il contenuto della pagina
function loadContent() {
    let pageName = window.location.pathname.split("/").pop().split(".")[0];
    if (pageName === '' || pageName === 'index') {
        pageName = 'previdenza-complementare';
    }
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

// Gestisce il comportamento dell'header durante lo scroll
function initScrollBehavior() {
    const header = document.querySelector('header');
    const scrollThreshold = 100; // Soglia di scroll per attivare la trasformazione

    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Inizializza il menu mobile
function initMobileMenu() {
    const menuToggle = document.createElement('button');
    menuToggle.classList.add('menu-toggle');
    menuToggle.innerHTML = '☰';
    menuToggle.setAttribute('aria-label', 'Toggle menu');
    
    const headerContent = document.querySelector('.header-content');
    headerContent.insertBefore(menuToggle, headerContent.firstChild);

    menuToggle.addEventListener('click', function() {
        const mainNav = document.getElementById('main-nav');
        mainNav.classList.toggle('active');
        this.innerHTML = mainNav.classList.contains('active') ? '✕' : '☰';
    });

    // Gestione dei dropdown nel menu mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && e.target.closest('.dropdown')) {
            e.preventDefault();
            const dropdown = e.target.closest('.dropdown');
            dropdown.classList.toggle('active');
        }
    });
}