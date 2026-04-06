/**
 * Comando: vidente 🔮
 * Pasta: diversao
 * Créditos: Benny ⚔️
 */

const fs = require('fs');

module.exports = {
    name: 'vidente',
    category: 'diversao',
    description: 'Responde perguntas sobre o futuro.',
    alias: ['previsao', '8ball'],
    async execute(sock, msg, args, { from, isGroup, reply }) {
        
        // --- 🛡️ TRAVA DE SEGURANÇA: MODO ZOEIRA ---
        const dbZoeiraPath = './database/modozoeira.json';
        const dbZoeira = fs.existsSync(dbZoeiraPath) ? JSON.parse(fs.readFileSync(dbZoeiraPath)) : {};

        if (isGroup && !dbZoeira[from]) {
            await sock.sendMessage(from, { react: { text: '🛡️', key: msg.key }});
            return reply("⚠️ *MODO ZOEIRA NÃO ESTÁ ATIVADO!* \n\nPeça para algum administrador ativar com: *modozoeira on*");
        }
        // ------------------------------------------

        if (!args[0]) return reply("❓ Você precisa fazer uma pergunta para o vidente!");
        
        await sock.sendMessage(from, { react: { text: '🔮', key: msg.key }});

        const respostas = [
            "Sim, com certeza!", 
            "Não conte com isso.", 
            "Talvez no futuro.", 
            "As estrelas dizem que sim.", 
            "Definitivamente não.", 
            "Pergunte novamente mais tarde.",
            "É muito provável.", 
            "Minhas fontes dizem que não.", 
            "Sinais apontam que sim.",
            "Melhor não te contar agora..."
        ];
        
        const resposta = respostas[Math.floor(Math.random() * respostas.length)];
        const pergunta = args.join(" ");

        let texto = `*┏━━〔 🔮 VIDENTE 〕━━┛*\n\n`;
        texto += `🤔 *PERGUNTA:* ${pergunta}\n`;
        texto += `✨ *RESPOSTA:* ${resposta}\n\n`;
        texto += `*┗━━〔 🎖️ ACKERMAN 🎖️ 〕━━┛*`;

        return sock.sendMessage(from, { text: texto }, { quoted: msg });
    }
};
