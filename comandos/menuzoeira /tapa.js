/**
 * Comando: tapa 👊
 * Pasta: diversao
 * Créditos: Benny ⚔️
 */

const fs = require('fs');

module.exports = {
    name: 'tapa',
    category: 'diversao',
    description: 'Dá um tapa em um usuário.',
    async execute(sock, msg, args, { from, isGroup, sender, mentions, reply }) {
        
        // --- 🛡️ TRAVA DE SEGURANÇA: MODO ZOEIRA ---
        const dbZoeiraPath = './database/modozoeira.json';
        const dbZoeira = fs.existsSync(dbZoeiraPath) ? JSON.parse(fs.readFileSync(dbZoeiraPath)) : {};

        if (!dbZoeira[from]) {
            await sock.sendMessage(from, { react: { text: '🛡️', key: msg.key }});
            return reply("⚠️ *MODO ZOEIRA NÃO ESTÁ ATIVADO!* \n\nPeça para algum administrador ativar com: *modozoeira on*");
        }
        // ------------------------------------------

        await sock.sendMessage(from, { react: { text: '👊', key: msg.key }});

        const alvo = mentions[0] || sender;
        const forca = Math.floor(Math.random() * 101);
        const frases = ["Isso foi pessoal?", "Doeu bastante!", "Alguém chama um médico!", "Fraco, tente de novo."];
        
        let texto = `*┏━━〔 👊 AGRESSÃO 〕━━┛*\n\n`;
        texto += `💥 @${sender.split('@')[0]} deu um tapa em @${alvo.split('@')[0]}!\n`;
        texto += `💪 *Força:* ${forca}%\n`;
        texto += `🗣️ *Veredito:* ${frases[Math.floor(Math.random() * frases.length)]}\n\n`;
        texto += `*┗━━〔 🎖️ ACKERMAN 🎖️ 〕━━┛*`;

        return sock.sendMessage(from, { text: texto, mentions: [sender, alvo] }, { quoted: msg });
    }
};
