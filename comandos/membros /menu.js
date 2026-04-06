/**
 * Comando: menu ⚡
 * Pasta: membros
 * Créditos: Benny (Criador Oficial) ⚔️
 * Versão: Estável (Sem Áudio)
 */

const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'menu',
    category: 'membros',
    description: 'Menu Principal - Versão estável com Fix de Marcação igual ao ADV.',
    alias: ['help', 'comandos', 'start'],
    async execute(sock, msg, args, { from, prefixo, reply, eDono, isVip, sender }) {
        
        // Reação rápida ⚡
        await sock.sendMessage(from, { react: { text: '⚡', key: msg.key }});

        // --- CARREGAR CONFIGURAÇÕES DO DONO ---
        const configPath = './dono/config.json';
        let donoAtual = "Não Definido";
        let nomeBot = "Ackerman-Bot";

        if (fs.existsSync(configPath)) {
            try {
                const config = JSON.parse(fs.readFileSync(configPath));
                donoAtual = config.donoNick || "Não Definido";
                nomeBot = config.nomeBot || "Ackerman-Bot";
            } catch (e) {
                console.log("Erro ao ler config:", e);
            }
        }

        const fotoMenu = path.resolve('./media/menu.jpg'); 

        // Saudação e Hora
        const hora = new Date().getHours();
        let saudacao = 'Boa noite';
        if (hora >= 5 && hora < 12) saudacao = 'Bom dia';
        else if (hora >= 12 && hora < 18) saudacao = 'Boa tarde';
        const horaAtual = new Date().toLocaleTimeString('pt-BR');

        // --- LÓGICA IDÊNTICA AO ADV.JS ---
        const usuarioOriginal = sender.split('@')[0];
        const target = sender; // O JID completo para o array de mentions

        // TEXTO COM MARCAÇÃO DO USUÁRIO (@numero)
        let texto = `*Oii @${usuarioOriginal}, ${saudacao} >_<*\n\n`;
        
        texto += `┌─ ⭐ *STATUS DO SISTEMA* ⭐\n`;
        texto += `│\n`;
        texto += `│ 🤖 *Bot:* ${nomeBot}\n`;
        texto += `│ 👑 *Dono Atual:* ${donoAtual}\n`;
        texto += `│ 👨‍💻 *Criador:* BENNY ⚔️\n`;
        texto += `│ ⏰ *Hora:* ${horaAtual}\n`;
        texto += `│\n`;
        texto += `└───────────────────\n\n`;

        texto += `┌─ 🛠️ *PAINEL DE COMANDOS* 🛠️\n`;
        texto += `│\n`;
        texto += `│ ✨ *${prefixo}criador* (Info) ⚔️\n`;
        texto += `│ ✨ *${prefixo}infobot*\n`;
        texto += `│ ✨ *${prefixo}membros*\n`;
        texto += `│ ✨ *${prefixo}menuzoeira*\n`;
        texto += `│ ✨ *${prefixo}menuadm*\n`;
        texto += `│ ✨ *${prefixo}menudono*\n`;
        texto += `│ ✨ *${prefixo}menurpg*\n`;
        texto += `│\n`;
        texto += `└───────────────────\n\n`;
        
        texto += `_“A vitória pertence aos que persistem.”_\n`;
        texto += `*© 2026 ACKERMAN SYSTEM - BY BENNY*`;

        // Envio usando a lógica de menção do ADV.JS
        if (fs.existsSync(fotoMenu)) {
            return sock.sendMessage(from, { 
                image: { url: fotoMenu }, 
                caption: texto,
                mentions: [target] 
            }, { quoted: msg });
        } else {
            return sock.sendMessage(from, { 
                text: texto,
                mentions: [target] 
            }, { quoted: msg });
        }
    }
};
