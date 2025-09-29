#!/bin/bash

# AndIStro Software Center - Script de Instalação
# Este script instala o AndIStro Software Center no sistema
# Compatível com bash padrão e Termux (Android)

# Configurações de instalação
INSTALL_DIR="/opt/andistro-software-center"
BIN_LINK="/usr/local/bin/andistro-software-center"
APP_NAME="AndIStro Software Center"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para exibir mensagens coloridas
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[OK]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[AVISO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERRO]${NC} $1"
    exit 1
}

# Verificar se está sendo executado como root (exceto no Termux)
check_permissions() {
    if [ "$PREFIX" = "/data/data/com.termux/files/usr" ]; then
        # Execução no Termux - ajustar caminhos
        INSTALL_DIR="$PREFIX/opt/andistro-software-center"
        BIN_LINK="$PREFIX/bin/andistro-software-center"
        print_status "Detectado ambiente Termux - ajustando caminhos"
    elif [ "$EUID" -ne 0 ]; then
        print_error "Este script deve ser executado como root. Use: sudo $0"
    fi
}

# Criar diretório de instalação
create_install_dir() {
    print_status "Criando diretório de instalação: $INSTALL_DIR"
    
    if [ -d "$INSTALL_DIR" ]; then
        print_warning "Diretório $INSTALL_DIR já existe. Removendo versão anterior..."
        rm -rf "$INSTALL_DIR"
    fi
    
    mkdir -p "$INSTALL_DIR" || print_error "Falha ao criar diretório $INSTALL_DIR"
    print_success "Diretório criado: $INSTALL_DIR"
}

# Copiar arquivos do projeto
copy_files() {
    print_status "Copiando arquivos do $APP_NAME..."
    
    # Copiar todos os arquivos necessários
    cp -r public/ "$INSTALL_DIR/" || print_error "Falha ao copiar pasta public/"
    cp -r src/ "$INSTALL_DIR/" || print_error "Falha ao copiar pasta src/"
    
    # Copiar arquivo README se existir
    if [ -f "reeadme.md" ]; then
        cp reeadme.md "$INSTALL_DIR/" || print_warning "Falha ao copiar reeadme.md"
    fi
    
    print_success "Arquivos copiados com sucesso"
}

# Definir permissões corretas
set_permissions() {
    print_status "Configurando permissões..."
    
    # Definir permissões para diretórios
    find "$INSTALL_DIR" -type d -exec chmod 755 {} \;
    
    # Definir permissões para arquivos
    find "$INSTALL_DIR" -type f -exec chmod 644 {} \;
    
    print_success "Permissões configuradas"
}

# Criar link simbólico
create_symlink() {
    print_status "Criando link simbólico: $BIN_LINK"
    
    # Remover link existente se houver
    if [ -L "$BIN_LINK" ] || [ -f "$BIN_LINK" ]; then
        print_warning "Removendo link anterior: $BIN_LINK"
        rm -f "$BIN_LINK"
    fi
    
    # Criar diretório bin se não existir (para Termux)
    BIN_DIR=$(dirname "$BIN_LINK")
    if [ ! -d "$BIN_DIR" ]; then
        mkdir -p "$BIN_DIR" || print_error "Falha ao criar diretório $BIN_DIR"
    fi
    
    # Criar script executável
    cat > "$BIN_LINK" << EOF
#!/bin/bash
# AndIStro Software Center Launcher
cd "$INSTALL_DIR"

# Verificar se existe um servidor web simples disponível
if command -v python3 >/dev/null 2>&1; then
    echo "Iniciando $APP_NAME em http://localhost:8080"
    python3 -m http.server 8080 -d public/
elif command -v python >/dev/null 2>&1; then
    echo "Iniciando $APP_NAME em http://localhost:8080"
    cd public/
    python -m SimpleHTTPServer 8080
else
    echo "Erro: Python não encontrado. Instale python3 ou python para executar o $APP_NAME"
    echo "Alternativamente, navegue até $INSTALL_DIR/public/ e abra index.html"
fi
EOF
    
    # Tornar o script executável
    chmod +x "$BIN_LINK" || print_error "Falha ao tornar executável: $BIN_LINK"
    
    print_success "Link simbólico criado: $BIN_LINK"
}

# Verificar instalação
verify_installation() {
    print_status "Verificando instalação..."
    
    if [ -d "$INSTALL_DIR" ] && [ -x "$BIN_LINK" ]; then
        print_success "$APP_NAME instalado com sucesso!"
        echo
        echo -e "${GREEN}Como usar:${NC}"
        echo "  Executar: andistro-software-center"
        echo "  Ou acessar diretamente: $INSTALL_DIR/public/index.html"
        echo
        echo -e "${BLUE}Localização dos arquivos:${NC}"
        echo "  Pasta principal: $INSTALL_DIR"
        echo "  Executável: $BIN_LINK"
    else
        print_error "Falha na verificação da instalação"
    fi
}

# Função principal
main() {
    echo -e "${BLUE}=====================================${NC}"
    echo -e "${BLUE} $APP_NAME - Instalador${NC}"
    echo -e "${BLUE}=====================================${NC}"
    echo
    
    check_permissions
    create_install_dir
    copy_files
    set_permissions
    create_symlink
    verify_installation
    
    echo
    print_success "Instalação concluída!"
}

# Verificar se o script está sendo executado diretamente
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
    main "$@"
fi