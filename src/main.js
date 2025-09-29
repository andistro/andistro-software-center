// Dicionário de traduções
const translations = {};
let currentLanguage = 'pt';

// Função para detectar idioma do sistema
function detectSystemLanguage() {
    // Primeiro, tenta obter idioma via backend/Python launcher
    if (typeof window.pywebview !== 'undefined' && window.pywebview.api) {
        try {
            // Tenta obter LANG do Python launcher
            return window.pywebview.api.get_system_lang();
        } catch (error) {
            console.warn('Não foi possível obter idioma via pywebview:', error);
        }
    }
    
    // Tenta obter via endpoint backend (se disponível)
    try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/api/system-lang', false); // síncrono para inicialização
        xhr.send();
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            if (response.lang) {
                return response.lang;
            }
        }
    } catch (error) {
        console.warn('Endpoint /api/system-lang não disponível:', error);
    }
    
    // Fallback: usa navigator.language do browser
    const browserLang = navigator.language || navigator.userLanguage || 'en-US';
    console.log('Usando idioma do browser como fallback:', browserLang);
    return browserLang;
}

// Função para normalizar código de idioma
function normalizeLanguageCode(langCode) {
    if (!langCode) return 'pt';
    
    // Remove codificação e converte para minúsculo
    const cleanLang = langCode.split('.')[0].split('_')[0].toLowerCase();
    
    // Mapeia códigos de idioma para os suportados
    switch (cleanLang) {
        case 'pt':
        case 'pt-br':
        case 'portuguese':
            return 'pt';
        case 'en':
        case 'en-us':
        case 'english':
            return 'en';
        default:
            // Se não encontrar, usa inglês como padrão
            return 'en';
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    // Detecta idioma do sistema
    const detectedLang = detectSystemLanguage();
    currentLanguage = normalizeLanguageCode(detectedLang);
    
    console.log('Idioma detectado:', detectedLang, '-> normalizado:', currentLanguage);
    
    await initializeI18n();
});

// Função para inicializar i18n
async function initializeI18n() {
    try {
        await loadTranslations();
        updateTexts();
        
        // Atualiza seletor de idioma se existir
        const languageSelector = document.getElementById('language-selector');
        if (languageSelector) {
            languageSelector.value = currentLanguage;
            languageSelector.addEventListener('change', function() {
                currentLanguage = this.value;
                updateTexts();
                // Salva preferência do usuário
                localStorage.setItem('preferredLanguage', currentLanguage);
            });
        }
        
        // Verifica se há preferência salva do usuário
        const savedLanguage = localStorage.getItem('preferredLanguage');
        if (savedLanguage && savedLanguage !== currentLanguage) {
            currentLanguage = savedLanguage;
            updateTexts();
            if (languageSelector) {
                languageSelector.value = currentLanguage;
            }
        }
    } catch (error) {
        console.error('Erro ao inicializar i18n:', error);
    }
}

// Função para carregar traduções
async function loadTranslations() {
    try {
        const ptResponse = await fetch(`src/i18n/pt.json`);
        const enResponse = await fetch(`src/i18n/en.json`);
        
        if (ptResponse.ok) {
            translations.pt = await ptResponse.json();
        } else {
            console.warn('Não foi possível carregar traduções em português');
            translations.pt = {};
        }
        
        if (enResponse.ok) {
            translations.en = await enResponse.json();
        } else {
            console.warn('Não foi possível carregar traduções em inglês');
            translations.en = {};
        }
    } catch (error) {
        console.error('Erro ao carregar traduções:', error);
        // Fallback: definir traduções básicas
        translations.pt = {};
        translations.en = {};
    }
}

// Função para obter texto traduzido
function getText(key) {
    if (translations[currentLanguage] && translations[currentLanguage][key]) {
        return translations[currentLanguage][key];
    }
    // Fallback para inglês se não encontrar na língua atual
    if (translations.en && translations.en[key]) {
        return translations.en[key];
    }
    // Fallback final: retorna a chave
    return key;
}

// Função para atualizar todos os textos da página
function updateTexts() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = getText(key);
    });
    
    // Atualiza placeholders
    const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElements.forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        element.placeholder = getText(key);
    });
    
    // Atualiza títulos/tooltips
    const titleElements = document.querySelectorAll('[data-i18n-title]');
    titleElements.forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        element.title = getText(key);
    });
}

// Expor funções globalmente para uso em outras páginas
window.i18n = {
    getText,
    updateTexts,
    setLanguage: function(lang) {
        currentLanguage = normalizeLanguageCode(lang);
        updateTexts();
        localStorage.setItem('preferredLanguage', currentLanguage);
    },
    getCurrentLanguage: function() {
        return currentLanguage;
    }
};

// Função adicional para depuração
window.debugI18n = function() {
    console.log('Current language:', currentLanguage);
    console.log('Available translations:', Object.keys(translations));
    console.log('System detected language:', detectSystemLanguage());
};