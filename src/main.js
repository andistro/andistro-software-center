// AndDistro Software Center
// Funções para carregar dados remotamente via fetch

// URLs dos arquivos JSON remotos no GitHub
const REMOTE_URLS = {
    destaques: 'https://raw.githubusercontent.com/andistro/andistro-software-center/main/public/destaques.json',
    apps: 'https://raw.githubusercontent.com/andistro/andistro-software-center/main/public/apps.json'
};

// Cache para dados carregados
let cachedData = {
    destaques: null,
    apps: null
};

// Função para carregar dados com fallback
async function loadJSONData(type) {
    try {
        // Primeiro, tenta carregar do GitHub
        const response = await fetch(REMOTE_URLS[type]);
        
        if (response.ok) {
            const data = await response.json();
            cachedData[type] = data;
            console.log(`Dados de ${type} carregados do GitHub com sucesso`);
            return data;
        }
        
        throw new Error(`Erro HTTP: ${response.status}`);
        
    } catch (error) {
        console.warn(`Erro ao carregar ${type} do GitHub:`, error);
        
        // Fallback: tenta carregar do arquivo local
        try {
            const localResponse = await fetch(`../${type}.json`);
            if (localResponse.ok) {
                const data = await localResponse.json();
                cachedData[type] = data;
                console.log(`Dados de ${type} carregados localmente como fallback`);
                return data;
            }
        } catch (localError) {
            console.error(`Erro ao carregar ${type} localmente:`, localError);
        }
        
        // Se tudo falhar, retorna dados vazios
        console.error(`Não foi possível carregar dados de ${type}`);
        return type === 'destaques' ? [] : [];
    }
}

// Função para carregar destaques
async function loadDestaques() {
    if (cachedData.destaques) {
        return cachedData.destaques;
    }
    return await loadJSONData('destaques');
}

// Função para carregar apps
async function loadApps() {
    if (cachedData.apps) {
        return cachedData.apps;
    }
    return await loadJSONData('apps');
}

// Função de inicialização que carrega todos os dados
async function initializeData() {
    try {
        console.log('Inicializando carregamento de dados...');
        
        // Carrega ambos os arquivos simultaneamente
        const [destaques, apps] = await Promise.all([
            loadDestaques(),
            loadApps()
        ]);
        
        console.log('Todos os dados foram carregados com sucesso');
        return { destaques, apps };
        
    } catch (error) {
        console.error('Erro durante inicialização dos dados:', error);
        return { destaques: [], apps: [] };
    }
}

// Exporta as funções para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadDestaques,
        loadApps,
        initializeData
    };
}

// Para uso no browser, adiciona as funções ao window
if (typeof window !== 'undefined') {
    window.loadDestaques = loadDestaques;
    window.loadApps = loadApps;
    window.initializeData = initializeData;
}

// Auto-inicialização quando a página carregar
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', async () => {
        await initializeData();
    });
}