document.addEventListener('DOMContentLoaded', function() {
    loadMenu();
    loadContent();
});

function loadMenu() {
    fetch('menu.json')
        .then(response => response.json())
        .then(data => {
            const nav = document.getElementById('main-nav');
            nav.innerHTML = createMenuHTML(data);
        })
        .catch(error => console.error('Errore nel caricamento del menu:', error));
}

function createMenuHTML(menuData) {
    return `<ul>${menuData.map(item => {
        if (item.dropdown) {
            return `
                <li class="dropdown">
                    <a href="${item.link}">${item.text}</a>
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
    if (contentData.sections[0].subsections) {
        // Formato per "I nostri fondi pensione"
        return contentData.sections.map(section => `
            <section class="content-box" data-id="${section.id}">
                <h1>${section.title}</h1>
                ${createSubsectionsHTML(section.subsections)}
            </section>
        `).join('');
    } else {
        // Formato per "Previdenza complementare"
        return contentData.sections.map(section => `
            <div class="content-box" data-id="${section.id}">
                <h2>${section.title}</h2>
                <p>${section.text}</p>
                <a href="${section.cta.link}" class="cta-button">${section.cta.text}</a>
            </div>
        `).join('');
    }
}

function createSubsectionsHTML(subsections) {
    return subsections.map(subsection => `
        <div class="subsection">
            <h2>${subsection.title}</h2>
            <p>${subsection.text}</p>
            <a href="${subsection.cta.link}" class="cta-button">${subsection.cta.text}</a>
        </div>
    `).join('');
}

function initSortable() {
    new Sortable(document.getElementById('content'), {
        animation: 150,
        ghostClass: 'blue-background-class',
        onEnd: function(evt) {
            console.log('Nuovo ordine:', getContentOrder());
        }
    });
}

function getContentOrder() {
    return Array.from(document.querySelectorAll('.content-box'))
        .map(box => box.getAttribute('data-id'));
}