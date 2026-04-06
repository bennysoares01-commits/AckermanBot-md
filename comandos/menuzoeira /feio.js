const fs = require('fs');

module.exports = {
    name: 'feio',
    category: 'menuzoeira',
    description: 'Mede o nível de feiura de alguém.',
    async execute(sock, msg, args, { from, reply }) {
        
        // --- 🛡️ TRAVA DE SEGURANÇA: MODO ZOEIRA ---
        const dbZoeiraPath = './database/modozoeira.json';
        const dbZoeira = fs.existsSync(dbZoeiraPath) ? JSON.parse(fs.readFileSync(dbZoeiraPath)) : {};

        if (!dbZoeira[from]) {
            await sock.sendMessage(from, { react: { text: '🛡️', key: msg.key }});
            return reply("⚠️ *MODO ZOEIRA NÃO ESTÁ ATIVADO!* \n\nPeça para algum administrador ativar.\nPara ativar é só usar: *modozoeira on*");
        }
        // ------------------------------------------

        const mencao = msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || 
                       msg.message.extendedTextMessage?.contextInfo?.participant || msg.key.participant || msg.key.remoteJid;

        await reply("☣️ Aguarde, analisando seu nível de feiura...");

        setTimeout(async () => {
            const porcentagem = Math.floor(Math.random() * 101);
            const foto = "./media/feio.jpg";
            
            let texto = `╭━━━〔 ☣️ *MEDIDOR DE RADIAÇÃO* ☣️ 〕━━━╮\n┃\n`;
            texto += `┃  👤 *ALVO:* @${mencao.split('@')[0]}\n`;
            texto += `┃  👺 *FEIURA:* ${porcentagem}%\n`;
            texto += `┃\n`;
            texto += `┃  ⚠️ *ALERTA:* Meus sensores detectaram mico!\n`;
            texto += `┃\n`;
            texto += `╰━━━━〔 🎖️ *ACKERMAN* 🎖️ 〕━━━━╯`;

            if (fs.existsSync(foto)) {
                await sock.sendMessage(from, { image: fs.readFileSync(foto), caption: texto, mentions: [mencao] }, { quoted: msg });
            } else {
                return sock.sendMessage(from, { text: texto, mentions: [mencao] }, { quoted: msg });
            }
        }, 2000);
    }
};
