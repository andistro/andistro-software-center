#!/bin/bash

# Script de desinstalação do Andistro Software Center
# Remove o diretório de instalação, binário e arquivo .desktop

echo "Desinstalando o Andistro Software Center..."

# Remove o diretório de instalação
echo "Removendo diretório de instalação..."
rm -rf /opt/andistro-software-center

# Remove o binário do PATH
echo "Removendo binário do sistema..."
sudo rm -f /usr/local/bin/andistro-software-center

# Remove o arquivo .desktop
echo "Removendo entrada do menu de aplicações..."
rm -f ~/.local/share/applications/andistro-software-center.desktop

# Mensagem de sucesso
echo "Andistro Software Center foi desinstalado com sucesso!"
echo "Obrigado por usar o Andistro Software Center."