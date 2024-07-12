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
            initMenuBehavior();
        })
        .catch(error => console.error('Errore nel caricamento del menu:', error));
}

// Funzione per creare l'HTML del menu basato sui dati JSON
function createMenuHTML(menuData) {
    return `<ul>${menuData.map(item => {
        if (item.dropdown) {
            return `
                <li class="dropdown">
                    <a href="${item.link}" class="dropdown-toggle">${item.text}</a>
                    <div class="dropdown-content">
                        ${item.dropdown.map(subItem => `<a href="${subItem.link}">${subItem.text}</a>`).join('')}
                    </div>
                </li>
            `;
        } else {
            return `<li><a href="${item.link}">${item.text}</a></li>`;
        }
    }).join('')}</ul>`;
}

// Inizializza il comportamento del menu, gestendo dropdown e click su mobile
function initMenuBehavior() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    // Gestisce l'apertura/chiusura dei dropdown su mobile
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const dropdownContent = this.nextElementSibling;
                dropdownContent.classList.toggle('active');
            }
        });
    });

    // Gestione migliorata dei click sui link del menu mobile
    document.querySelectorAll('#main-nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                if (this.classList.contains('dropdown-toggle')) {
                    // Se è un toggle di dropdown, previeni la navigazione
                    e.preventDefault();
                } else {
                    // Se è un link normale o un link in un sottomenu, permetti la navigazione
                    // e chiudi il menu mobile
                    document.getElementById('main-nav').classList.remove('active');
                    const menuToggle = document.querySelector('.menu-toggle');
                    if (menuToggle) {
                        menuToggle.innerHTML = '☰';
                        menuToggle.setAttribute('aria-expanded', 'false');
                    }
                }
            }
        });
    });
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
    const scrollThreshold = 50;

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
    menuToggle.setAttribute('aria-expanded', 'false');
    
    const headerContent = document.querySelector('.header-content');
    headerContent.insertBefore(menuToggle, headerContent.firstChild);

    menuToggle.addEventListener('click', function() {
        const mainNav = document.getElementById('main-nav');
        const isExpanded = mainNav.classList.toggle('active');
        this.setAttribute('aria-expanded', isExpanded);
        this.innerHTML = isExpanded ? '✕' : '☰';
    });
}

// Gestione focus per accessibilità da tastiera
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const activeDropdown = document.querySelector('.dropdown-content.active');
        if (activeDropdown) {
            activeDropdown.classList.remove('active');
        }
    }
});