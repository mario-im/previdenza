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
    
    dropdownToggles.forEach(toggle => {
        let isOpen = false;
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const dropdownContent = this.nextElementSibling;
                if (isOpen) {
                    // Se il dropdown è già aperto, naviga alla pagina
                    window.location.href = this.getAttribute('href');
                } else {
                    // Altrimenti, apri il dropdown
                    dropdownContent.classList.add('active');
                    isOpen = true;
                }
            }
        });

        // Chiudi il dropdown quando si clicca fuori
        document.addEventListener('click', function(e) {
            if (!toggle.contains(e.target) && window.innerWidth <= 768) {
                const dropdownContent = toggle.nextElementSibling;
                dropdownContent.classList.remove('active');
                isOpen = false;
            }
        });
    });

    // Gestione dei click sui link del sottomenu
    document.querySelectorAll('.dropdown-content a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                document.getElementById('main-nav').classList.remove('active');
                const menuToggle = document.querySelector('.menu-toggle');
                if (menuToggle) {
                    menuToggle.innerHTML = '☰';
                    menuToggle.setAttribute('aria-expanded', 'false');
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

// Funzione per creare l'HTML del contenuto basato sui dati JSON e supporto per CTA multiple in una singola sezione.
function createContentHTML(contentData) {
    return contentData.sections.map(section => {
        let sectionHTML = `<div class="content-box" id="${section.id}">`;
        sectionHTML += `<h2>${section.title}</h2>`;
        
        if (section.text) {
            // Gestisce liste puntate e numerate
            if (section.text.includes('•') || section.text.includes('1.')) {
                sectionHTML += `<div class="formatted-text">${formatText(section.text)}</div>`;
            } else {
                sectionHTML += `<p>${section.text}</p>`;
            }
        }
        
        if (section.subsections) {
            sectionHTML += createSubsectionsHTML(section.subsections);
        }
        
        if (section.cta) {
            if (Array.isArray(section.cta)) {
                sectionHTML += section.cta.map(cta => 
                    `<a href="${cta.link}" class="cta-button">${cta.text}</a>`
                ).join('');
            } else {
                sectionHTML += `<a href="${section.cta.link}" class="cta-button">${section.cta.text}</a>`;
            }
        }
        
        sectionHTML += '</div>';
        return sectionHTML;
    }).join('');
}

// Funzione per creare una subsection con titolo e testo
function createSubsectionsHTML(subsections) {
    return subsections.map(subsection => `
        <div class="subsection">
            <h3>${subsection.title}</h3>
            ${subsection.text ? `<p>${subsection.text}</p>` : ''}
            ${subsection.cta ? `<a href="${subsection.cta.link}" class="cta-button">${subsection.cta.text}</a>` : ''}
        </div>
    `).join('');
}

// Funzione per formattare il testo con liste puntate e numerate
function formatText(text) {
    // Converte le liste puntate
    text = text.replace(/•\s(.*?)(?=(\n|$))/g, '<li>$1</li>');
    if (text.includes('<li>')) {
        text = '<ul>' + text + '</ul>';
    }
    
    // Converte le liste numerate
    text = text.replace(/(\d+)\.\s(.*?)(?=(\n|$))/g, '<li>$2</li>');
    if (text.includes('<li>') && !text.includes('<ul>')) {
        text = '<ol>' + text + '</ol>';
    }
    
    // Gestisce i paragrafi e le note
    text = text.replace(/\n\n/g, '</p><p>');
    text = '<p>' + text + '</p>';
    text = text.replace(/<p>\*(.*?)<\/p>/g, '<p class="note">*$1</p>');
    
    return text;
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
    
    const headerContent = document.querySelector('.header-content');
    headerContent.insertBefore(menuToggle, headerContent.firstChild);

    menuToggle.addEventListener('click', function() {
        const mainNav = document.getElementById('main-nav');
        mainNav.classList.toggle('active');
        this.innerHTML = mainNav.classList.contains('active') ? '✕' : '☰';
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
