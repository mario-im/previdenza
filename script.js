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
    fetch('previdenza-complementare.json')
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
        </div>
    `).join('');
}

function initSortable() {
    new Sortable(document.getElementById('content'), {
        animation: 150,
        ghostClass: 'blue-background-class',
        onEnd: function(evt) {
            // Qui puoi aggiungere la logica per salvare l'ordine dei contenuti
            console.log('Nuovo ordine:', getContentOrder());
        }
    });
}

function getContentOrder() {
    return Array.from(document.querySelectorAll('.content-box'))
        .map(box => box.getAttribute('data-id'));
}