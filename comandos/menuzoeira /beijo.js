/**
 * Comando: beijo 💋
 * Pasta: diversao
 * Versão: 2.0 (Design de Elite & Foto)
 * Créditos: Benny ⚔️
 */

const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'beijo',
    category: 'diversao',
    description: 'Dê um beijo em alguém do grupo.',
    alias: ['kiss', 'bjo', 'beijar'],
    async execute(sock, msg, args, { from, reply, prefixo, sender }) {
        
        // --- 🛡️ TRAVA DE SEGURANÇA: MODO ZOEIRA ---
        const dbZoeiraPath = './database/modozoeira.json';
        const dbZoeira = fs.existsSync(dbZoeiraPath) ? JSON.parse(fs.readFileSync(dbZoeiraPath)) : {};

        if (!dbZoeira[from]) {
            await sock.sendMessage(from, { react: { text: '🛡️', key: msg.key }});
            return reply("⚠️ *MODO ZOEIRA NÃO ESTÁ ATIVADO!* \n\nPeça para algum administrador ativar.\nPara ativar é só usar: *modozoeira on*");
        }
        // ------------------------------------------
        
        // 1. Identifica o alvo (por marcação @ ou respondendo a mensagem)
        const mencao = msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || 
                       msg.message.extendedTextMessage?.contextInfo?.participant;
        
        if (!mencao) {
            return reply(`⚠️ Mencione alguém para beijar!\nExemplo: *${prefixo}beijo @user*`);
        }

        const quemBeijou = sender;
        const quemRecebeu = mencao;
        const fotoPath = "./media/beijo.jpg"; // Mudamos para buscar JPG

        // Reação automática 💋
        await sock.sendMessage(from, { react: { text: '💋', key: msg.key }});

        // 2. Configuração de Nomes (para o design)
        const nomeBeijou = msg.pushName || 'Alguém';
        const nomeRecebeu = `@${quemRecebeu.split('@')[0]}`;

        // --- ⚔️ DESIGN ACKERMAN ⚔️ ---
        let texto = `╭━━━━〔 ⚔️ *ACKERMAN* ⚔️ 〕━━━━╮\n`;
        texto += `┃\n`;
        texto += `┃  💋 *MOMENTO CARINHO*\n`;
        texto += `┃\n`;
        
        if (quemRecebeu === quemBeijou) {
            texto += `┃  👤 *De:* ${nomeBeijou}\n`;
            texto += `┃  🎯 *Para:* Si mesmo(a) \n`;
            texto += `┃\n`;
            texto += `┣━━━━━━━━━━━━━━━━━━━━━━━\n`;
            texto += `┃\n`;
            texto += `┃  ${nomeBeijou} está se \n`;
            texto += `┃  beijando no espelho! 😳\n`;
        } else {
            texto += `┃  👤 *De:* ${nomeBeijou}\n`;
            texto += `┃  🎯 *Para:* ${nomeRecebeu}\n`;
            texto += `┃\n`;
            texto += `┣━━━━━━━━━━━━━━━━━━━━━━━\n`;
            texto += `┃\n`;
            texto += `┃  💋 ${nomeBeijou} deu um \n`;
            texto += `┃  beijão em ${nomeRecebeu}! \n`;
        }
        
        texto += `┃\n`;
        texto += `╰━━━━〔 🎖️ *BY BENNY* 🎖️ 〕━━━━╯`;
        // -------------------------------------

        // 3. Envio da Foto (JPG)
        if (fs.existsSync(fotoPath)) {
            try {
                // Envia a foto com o design no caption
                await sock.sendMessage(from, { 
                    image: fs.readFileSync(fotoPath), 
                    caption: texto,
                    mentions: [quemBeijou, quemRecebeu]
                }, { quoted: msg });
            } catch (err) {
                console.log("Erro ao enviar foto de beijo:", err);
                // Se der erro na foto, manda só o texto
                await sock.sendMessage(from, { text: texto, mentions: [quemBeijou, quemRecebeu] }, { quoted: msg });
            }
        } else {
            // Caso o arquivo beijo.jpg não exista na pasta media
            console.log(`[AVISO] Arquivo não encontrado: ${fotoPath}`);
            await sock.sendMessage(from, { 
                text: texto, 
                mentions: [quemBeijou, quemRecebeu] 
            }, { quoted: msg });
        }
    }
};
