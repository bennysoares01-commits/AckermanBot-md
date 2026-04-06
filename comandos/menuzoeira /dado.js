/**
 * Comando: dado 🎲
 * Pasta: diversao
 * Créditos: Benny ⚔️
 */

const fs = require('fs');

module.exports = {
    name: "dado",
    aliases: ["jogar"],
    async execute(sock, msg, args, { from, reply }) {
        
        // --- 🛡️ TRAVA DE SEGURANÇA: MODO ZOEIRA ---
        const dbZoeiraPath = './database/modozoeira.json';
        const dbZoeira = fs.existsSync(dbZoeiraPath) ? JSON.parse(fs.readFileSync(dbZoeiraPath)) : {};

        if (!dbZoeira[from]) {
            await sock.sendMessage(from, { react: { text: '🛡️', key: msg.key }});
            return reply("⚠️ *MODO ZOEIRA NÃO ESTÁ ATIVADO!* \n\nPeça para algum administrador ativar.\nPara ativar é só usar: *modozoeira on*");
        }
        // ------------------------------------------

        const face = Math.floor(Math.random() * 6) + 1;
        const emojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
        
        await sock.sendMessage(from, { react: { text: '🎲', key: msg.key } });
        await sock.sendMessage(from, { 
            text: `🎲 | O dado parou em: *${face}* ${emojis[face-1]}` 
        }, { quoted: msg });
    }
};
