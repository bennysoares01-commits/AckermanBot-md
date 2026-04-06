/**
 * Comando: menudono 👑
 * Pasta: menudono
 * Créditos: Benny ⚔️
 */

const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'menudono',
    category: 'menudono',
    description: 'Painel de controle exclusivo do dono.',
    alias: ['dono', 'owner', 'painel'],
    async execute(sock, msg, args, { from, prefixo, reply, eDono }) {
        
        // Verificação de Dono 👑
        if (!eDono) {
            await sock.sendMessage(from, { react: { text: '❌', key: msg.key }});
            return reply("⚠️ COMANDO É APENAS PARA O MEU DONO");
        }

        // Reação de autoridade 👑
        await sock.sendMessage(from, { react: { text: '👑', key: msg.key }});

        // Caminho da foto principal do menu
        const fotoMenu = path.resolve('./media/menu.jpg'); 

        let texto = `╭━〔 👑 *PAINEL DO DONO* 👑 〕━╮\n`;
        texto += `│\n`;
        texto += `│ 👨‍💻 *Dono:* Benny\n`;
        texto += `│ 🤖 *Bot:* Ackerman-Bot\n`;
        texto += `│\n`;
        texto += `┣━━〔 ⚙️ *CONFIGURAÇÕES* 〕━━┫\n`;
        texto += `│\n`;
        texto += `│ ✨ *${prefixo}setfoto* (Menu)\n`;
        texto += `│ ✨ *${prefixo}nickdono* (Seu Nick)\n`;
        texto += `│ ✨ *${prefixo}numerodono* (Número Dono)\n`;
        texto += `│ ✨ *${prefixo}setnomebot* (Nome do Bot)\n`;
        texto += `│ ✨ *${prefixo}listavip* (Lista dos VIPs)\n`;
        texto += `│\n`;
        texto += `┣━━〔 🛠️ *MANUTENÇÃO* 〕━━┫\n`;
        texto += `│\n`;
        texto += `│ ✨ *${prefixo}bc* (Transmissão)\n`;
        texto += `│ ✨ *${prefixo}reiniciar*\n`;
        texto += `│ ✨ *${prefixo}desligar*\n`;
        texto += `│\n`;
        texto += `╰━━〔 🎖️ *ACKERMAN ELITE* 🎖️ 〕━━╯\n\n`;
        texto += `*© 2026 ACKERMAN SYSTEM - BY BENNY*`;

        if (fs.existsSync(fotoMenu)) {
            return sock.sendMessage(from, { 
                image: { url: fotoMenu }, 
                caption: texto
            }, { quoted: msg });
        } else {
            return reply(texto);
        }
    }
};
