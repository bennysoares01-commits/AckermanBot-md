/**
 * Comando: qi 🧠
 * Pasta: diversao
 * Créditos: Benny ⚔️
 */

const fs = require('fs');

module.exports = {
    name: 'qi',
    category: 'diversao',
    description: 'Mede o nível de inteligência de um usuário.',
    alias: ['inteligencia'],
    async execute(sock, msg, args, { from, sender, mentions, reply }) {
        
        // --- 🛡️ TRAVA DE SEGURANÇA: MODO ZOEIRA ---
        const dbZoeiraPath = './database/modozoeira.json';
        const dbZoeira = fs.existsSync(dbZoeiraPath) ? JSON.parse(fs.readFileSync(dbZoeiraPath)) : {};

        if (!dbZoeira[from]) {
            await sock.sendMessage(from, { react: { text: '🛡️', key: msg.key }});
            return reply("⚠️ *MODO ZOEIRA NÃO ESTÁ ATIVADO!* \n\nPeça para algum administrador ativar.\nPara ativar é só usar: *modozoeira on*");
        }
        // ------------------------------------------

        // Reação automática 🧠
        await sock.sendMessage(from, { react: { text: '🧠', key: msg.key }});

        // Pega quem foi marcado ou quem mandou o comando
        const alvo = mentions[0] || sender;
        const nivel = Math.floor(Math.random() * 250); // Gera um QI de 0 a 250
        
        let veredito = "";
        if (nivel < 50) veredito = "Sinto muito, a situação é crítica. 🥴";
        else if (nivel < 100) veredito = "Na média, mas falta um pouco de esforço. 📚";
        else if (nivel < 150) veredito = "Um gênio incompreendido! 💡";
        else if (nivel < 200) veredito = "QI de nível NASA! 🚀";
        else veredito = "Einstein ficaria com inveja de você. 🤯";

        let texto = `*┏━━〔 🧠 TESTE DE QI 〕━━┛*\n\n`;
        texto += `👤 *USUÁRIO:* @${alvo.split('@')[0]}\n`;
        texto += `📊 *NÍVEL:* ${nivel} IQ\n`;
        texto += `🗣️ *VEREDITO:* ${veredito}\n\n`;
        texto += `*┗━━〔 🎖️ ACKERMAN 🎖️ 〕━━┛*`;

        return sock.sendMessage(from, { 
            text: texto, 
            mentions: [alvo] 
        }, { quoted: msg });
    }
};
