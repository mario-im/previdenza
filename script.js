document.addEventListener('DOMContentLoaded', function() {
    loadMenu();
    loadContent();
    initScrollBehavior();
    initMobileMenu();
});

function loadMenu() {
    fetch('menu.json')
        .then(response => response.json())
        .then(data => {
            const nav = document.getElementById('main-nav');
            nav.innerHTML = createMenuHTML(data);
            initDropdownAccessibility();
        })
        .catch(error => console.error('Errore nel caricamento del menu:', error));
}

function createMenuHTML(menuData) {
    return `<ul>${menuData.map(item => {
        if (item.dropdown) {
            return `
                <li class="dropdown">
                    <a href="${item.link}" aria-haspopup="true" aria-expanded="false">${item.text}</a>
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

function initDropdownAccessibility() {
    const dropdowns = document.querySelectorAll('.dropdown > a');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                this.setAttribute('aria-expanded', this.getAttribute('aria-expanded') === 'false' ? 'true' : 'false');
                this.nextElementSibling.style.display = this.getAttribute('aria-expanded') === 'true' ? 'block' : 'none';
            }
        });
    });
}

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

function createContentHTML(contentData) {
    return contentData.sections.map(section => `
        <div class="content-box" data-id="${section.id}">
            <h2>${section.title}</h2>
            <p>${section.text}</p>
            <a href="${section.cta.link}" class="cta-button">${section.cta.text}</a>
        </div>
    `).join('');
}

function initSortable() {
    new Sortable(document.getElementById('content'), {
        animation: 150,
        ghostClass: 'blue-background-class'
    });
}

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
        this.setAttribute('aria-expanded', mainNav.classList.contains('active'));
        this.innerHTML = mainNav.classList.contains('active') ? '✕' : '☰';
    });
}

// Gestione focus per accessibilità da tastiera
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const activeDropdown = document.querySelector('.dropdown-content[style="display: block;"]');
        if (activeDropdown) {
            activeDropdown.style.display = 'none';
            activeDropdown.previousElementSibling.setAttribute('aria-expanded', 'false');
        }
    }
});