/**
 * Comando: fake 📢
 * Pasta: diversao
 * Créditos: Benny ⚔️
 */

const fs = require('fs');

module.exports = {
    name: 'fake',
    category: 'diversao',
    description: 'Gera uma notícia fake sobre alguém.',
    async execute(sock, msg, args, { from, mentions, sender, reply }) {
        
        // --- 🛡️ TRAVA DE SEGURANÇA: MODO ZOEIRA ---
        const dbZoeiraPath = './database/modozoeira.json';
        const dbZoeira = fs.existsSync(dbZoeiraPath) ? JSON.parse(fs.readFileSync(dbZoeiraPath)) : {};

        if (!dbZoeira[from]) {
            await sock.sendMessage(from, { react: { text: '🛡️', key: msg.key }});
            return reply("⚠️ *MODO ZOEIRA NÃO ESTÁ ATIVADO!* \n\nPeça para algum administrador ativar.\nPara ativar é só usar: *modozoeira on*");
        }
        // ------------------------------------------

        const alvo = mentions[0] || sender;
        const numeroAlvo = alvo.split('@')[0];

        const fakes = [
            "foi visto comprando coxinha e não pagando.",
            "foi pego stalkeando o ex às 3 da manhã.",
            "acaba de ganhar o prêmio de maior gado do ano.",
            "foi flagrado conversando com as paredes no banho.",
            "confessou que ainda dorme com a luz acesa.",
            "está sendo procurado por mandar áudios de 10 minutos."
        ];

        const noticia = fakes[Math.floor(Math.random() * fakes.length)];

        let texto = `*┏━━〔 📢 ACKERMAN NEWS 📢 〕━━┛*\n\n`;
        texto += `🚨 *URGENTE:* @${numeroAlvo} ${noticia}\n\n`;
        texto += `*┗━━〔 🎖️ ACKERMAN 🎖️ 〕━━┛*`;

        return sock.sendMessage(from, { text: texto, mentions: [alvo] }, { quoted: msg });
    }
};
