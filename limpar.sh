#!/data/data/com.termux/files/usr/bin/bash

# --- LIMPANDO ACKERMAN-BOT PARA ENVIO ---
echo -e "\033[1;31m[!] LIMPANDO DADOS PRIVADOS...\033[0m"

# Remove sua conexão do WhatsApp
rm -rf session
rm -rf auth_info_baileys

# Reseta os bancos de dados para o padrão (vazio)
echo "{}" > ./dono/database.json
echo "{}" > ./database/modozoeira.json

# Remove as pastas pesadas que o novo dono deve baixar
rm -rf node_modules
rm -f package-lock.json

echo -e "\033[1;32m[V] BOT LIMPO! PRONTO PARA COMPACTAR E ENVIAR.\033[0m"
