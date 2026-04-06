/**
 * Comando: ship 💖
 * Função: Calcula a compatibilidade entre dois membros.
 * Pasta: diversao
 * Créditos: Benny ⚔️
 */

const fs = require('fs');

module.exports = {
    name: 'ship',
    category: 'diversao',
    description: 'Vê a chance de um casal dar certo.',
    alias: ['casal', 'amor'],
    async execute(sock, msg, args, { from, isGroup, reply, prefixo }) {
        if (!isGroup) return reply("❌ Apenas em grupos.");

        // --- 🛡️ TRAVA DE SEGURANÇA: MODO ZOEIRA ---
        const dbZoeiraPath = './database/modozoeira.json';
        const dbZoeira = fs.existsSync(dbZoeiraPath) ? JSON.parse(fs.readFileSync(dbZoeiraPath)) : {};

        if (!dbZoeira[from]) {
            await sock.sendMessage(from, { react: { text: '🛡️', key: msg.key }});
            return reply("⚠️ *MODO ZOEIRA NÃO ESTÁ ATIVADO!* \n\nPeça para algum administrador ativar com: *modozoeira on*");
        }
        // ------------------------------------------

        // Pega os mencionados
        const mencionados = msg.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
        
        if (mencionados.length < 2) {
            return reply(`⚠️ Marque dois soldados para o ship! Ex: *${prefixo}ship @user1 @user2*`);
        }

        const p1 = mencionados[0];
        const p2 = mencionados[1];
        const porcentagem = Math.floor(Math.random() * 101);

        // Barra de progresso visual
        const blocosCheios = Math.floor(porcentagem / 10);
        const blocosVazios = 10 - blocosCheios;
        const barra = "❤️".repeat(blocosCheios) + "🖤".repeat(blocosVazios);

        // Comentários baseados na porcentagem
        let comentario = "";
        if (porcentagem < 20) comentario = "💀 *CAOS TOTAL:* Melhor nem tentarem, a chance de briga é 100%.";
        else if (porcentagem < 50) comentario = "🤨 *ZONA DE AMIZADE:* Talvez um dia, mas por enquanto, só conhecidos.";
        else if (porcentagem < 80) comentario = "👀 *TEM ALGO ALI:* Tem um clima rolando, falta só atitude!";
        else if (porcentagem < 95) comentario = "🔥 *FOGO NO PARQUINHO:* Esse casal vai dar o que falar!";
        else comentario = "👑 *CASAL REAL:* Feitos um para o outro, tipo o Capitão e a limpeza!";

        let texto = `╭━━━〔 ⚔️ *TERMINAL DE AMOR* ⚔️ 〕━━━╮\n`;
        texto += `┃\n`;
        texto += `┃  👩‍❤️‍👨 *SHIP DETECTADO!*\n`;
        texto += `┃  ❤️ *CANDIDATO 1:* @${p1.split('@')[0]}\n`;
        texto += `┃  ❤️ *CANDIDATO 2:* @${p2.split('@')[0]}\n`;
        texto += `┃\n`;
        texto += `┣━━━━━━━━━━━━━━━━━━━━━━\n`;
        texto += `┃\n`;
        texto += `┃  📊 *COMPATIBILIDADE:* ${porcentagem}%\n`;
        texto += `┃  [ ${barra} ]\n`;
        texto += `┃\n`;
        texto += `┃  📝 *VEREDITO:* \n`;
        texto += `┃  _${comentario}_\n`;
        texto += `┃\n`;
        texto += `╰━━━━〔 🎖️ *ACKERMAN* 🎖️ 〕━━━━╯`;

        await sock.sendMessage(from, { react: { text: '💖', key: msg.key }});
        
        return sock.sendMessage(from, { 
            text: texto, 
            mentions: [p1, p2] 
        }, { quoted: msg });
    }
};
