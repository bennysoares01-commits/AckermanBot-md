/**
 * Comando: chance 🎲
 * Pasta: diversao
 * Créditos: Benny ⚔️
 */

const fs = require('fs');

module.exports = {
    name: 'chance',
    category: 'diversao',
    description: 'Calcula a chance de algo acontecer.',
    async execute(sock, msg, args, { from, reply }) {
        
        // --- 🛡️ TRAVA DE SEGURANÇA: MODO ZOEIRA ---
        const dbZoeiraPath = './database/modozoeira.json';
        const dbZoeira = fs.existsSync(dbZoeiraPath) ? JSON.parse(fs.readFileSync(dbZoeiraPath)) : {};

        if (!dbZoeira[from]) {
            await sock.sendMessage(from, { react: { text: '🛡️', key: msg.key }});
            return reply("⚠️ *MODO ZOEIRA NÃO ESTÁ ATIVADO!* \n\nPeça para algum administrador ativar.\nPara ativar é só usar: *modozoeira on*");
        }
        // ------------------------------------------

        if (!args[0]) return reply("❓ Diga sobre o que eu devo calcular a chance!");
        
        const pergunta = args.join(" ");
        const porcentagem = Math.floor(Math.random() * 101);

        let texto = `*┏━━〔 🎲 PROBABILIDADE 🎲 〕━━┛*\n\n`;
        texto += `🤔 *PERGUNTA:* ${pergunta}\n`;
        texto += `📊 *CHANCE:* ${porcentagem}%\n\n`;
        texto += `*┗━━〔 🎖️ ACKERMAN 🎖️ 〕━━┛*`;

        return reply(texto);
    }
};
