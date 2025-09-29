// Detectar idioma do sistema
function getSystemLanguage() {
    const language = navigator.language || navigator.languages[0] || 'en';
    // Extrair código da linguagem (ex: pt-BR -> pt-BR, pt -> pt, en-US -> en-US)
    return language;
}

// Função para obter conteúdo localizado
function getLocalizedContent(item, property, fallback = null) {
    const language = getSystemLanguage();
    const languageCode = language.split('-')[0]; // pt-BR -> pt, en-US -> en
    
    // Tentar idioma completo primeiro (ex: pt-BR)
    if (item[property + '_' + language]) {
        return item[property + '_' + language];
    }
    
    // Tentar apenas código do idioma (ex: pt)
    if (item[property + '_' + languageCode]) {
        return item[property + '_' + languageCode];
    }
    
    // Usar versão global como fallback
    return item[property] || fallback;
}

// Função para obter banner localizado
function getLocalizedBanner(item) {
    const language = getSystemLanguage();
    const languageCode = language.split('-')[0];
    
    // Construir possíveis nomes de arquivo
    const possibleBanners = [
        item.banner ? item.banner.replace('.png', `-${language}.png`).replace('.jpg', `-${language}.jpg`) : null,
        item.banner ? item.banner.replace('.png', `-${languageCode}.png`).replace('.jpg', `-${languageCode}.jpg`) : null,
        item.banner // fallback para versão global
    ].filter(Boolean);
    
    // Por enquanto, retornar o primeiro disponível (pode ser melhorado para verificar se existe)
    // Para pt-BR, tentará: banner-pt-BR.png, banner-pt.png, banner.png
    return possibleBanners[0] || item.banner;
}

async function loadJSONData(type) {
    try {
        const response = await fetch(type + '.json');
        if (!response.ok) {
            throw new Error('Falha ao carregar ' + type + '.json');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao carregar JSON:', error);
        return null;
    }
}

// Função para renderizar destaques com suporte a idiomas
function renderDestaques(destaques) {
    const container = document.getElementById('destaques-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    destaques.forEach(destaque => {
        const div = document.createElement('div');
        div.className = 'destaque-item';
        
        // Obter banner localizado
        const bannerSrc = getLocalizedBanner(destaque);
        
        // Obter título e descrição localizados
        const titulo = getLocalizedContent(destaque, 'title', destaque.title);
        const descricao = getLocalizedContent(destaque, 'description', destaque.description);
        const linkText = getLocalizedContent(destaque, 'link_text', 'Saiba mais');
        
        div.innerHTML = `
            <div class="banner">
                <img src="${bannerSrc}" alt="${titulo}" onerror="this.src='${destaque.banner}'">
            </div>
            <div class="content">
                <h3>${titulo}</h3>
                <p>${descricao}</p>
                <a href="${destaque.link}" class="btn-destaque">${linkText}</a>
            </div>
        `;
        
        container.appendChild(div);
    });
}

// Função principal para carregar e renderizar destaques
async function loadDestaques() {
    const data = await loadJSONData('destaques');
    if (data && data.destaques) {
        renderDestaques(data.destaques);
    }
}

// Função para renderizar aplicativos
function renderApps(apps) {
    const container = document.getElementById('apps-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    apps.forEach(app => {
        const div = document.createElement('div');
        div.className = 'app-item';
        
        // Obter nome e descrição localizados
        const nome = getLocalizedContent(app, 'name', app.name);
        const descricao = getLocalizedContent(app, 'description', app.description);
        
        // Usar ícone se disponível
        const iconSrc = app.icon || 'assets/icon/default.svg';
        
        div.innerHTML = `
            <div class="icon">
                <img src="${iconSrc}" alt="${nome}" onerror="this.src='assets/icon/default.svg'">
            </div>
            <div class="info">
                <h4>${nome}</h4>
                <p>${descricao}</p>
                <button onclick="installApp('${app.package}')" class="btn-install">Instalar</button>
            </div>
        `;
        
        container.appendChild(div);
    });
}

// Função para carregar e renderizar apps
async function loadApps() {
    const data = await loadJSONData('apps');
    if (data && data.apps) {
        renderApps(data.apps);
    }
}

// Função para instalar aplicativo
function installApp(packageName) {
    // Implementar lógica de instalação
    console.log('Instalando:', packageName);
    alert('Funcionalidade de instalação será implementada em breve.');
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    console.log('Idioma do sistema detectado:', getSystemLanguage());
    loadDestaques();
    loadApps();
});

// Função para buscar aplicativos
function searchApps(query) {
    // Implementar busca
    console.log('Buscando:', query);
}

// Configurar busca
const searchInput = document.getElementById('search-input');
if (searchInput) {
    searchInput.addEventListener('input', function(e) {
        searchApps(e.target.value);
    });
}