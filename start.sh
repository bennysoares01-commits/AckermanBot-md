#!/bin/bash

# Cores para o terminal
PINK='\033[38;5;205m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m' # Sem cor

echo -e "${PINK}╭───  ✨ * ˚ ✦  ACKERMAN-BOT  ✦ ˚ * ✨  ───╮${NC}"
echo -e "${PINK}│${NC}  ${CYAN}🚀 INICIANDO O SISTEMA...${NC}                ${PINK}│${NC}"
echo -e "${PINK}│${NC}  ${CYAN}👨‍💻 CRIADOR: BENNY${NC}                       ${PINK}│${NC}"
echo -e "${PINK}╰───  ✨ * ˚ ✦  ✨  ───╯${NC}"

while : 
do
    npm start
    echo -e "${YELLOW}⚠️ O bot caiu ou foi parado. Reiniciando em 5 segundos...${NC}"
    sleep 5
done
