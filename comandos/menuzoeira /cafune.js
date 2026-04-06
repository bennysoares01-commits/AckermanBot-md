/**
 * Comando: cafune ☁️
 * Pasta: diversao
 * Versão: 2.0 (Design de Elite & Foto)
 * Créditos: Benny ⚔️
 */

const fs = require('fs');

module.exports = {
    name: 'cafune',
    category: 'diversao',
    description: 'Dê um cafuné carinhoso em alguém do grupo.',
    alias: ['cafuné', 'pat'],
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
            return reply(`❓ Marque alguém para fazer cafuné!\nExemplo: *${prefixo}cafune @user*`);
        }

        const quemFez = sender;
        const quemRecebeu = mencao;
        const fotoPath = "./media/cafune.jpg"; // Alterado para JPG

        // Reação carinhosa ☁️
        await sock.sendMessage(from, { react: { text: '☁️', key: msg.key }});

        // 2. Configuração de Nomes
        const nomeFez = msg.pushName || 'Alguém';
        const nomeRecebeu = `@${quemRecebeu.split('@')[0]}`;

        // --- ⚔️ DESIGN ACKERMAN ⚔️ ---
        let texto = `╭━━━━〔 ⚔️ *ACKERMAN* ⚔️ 〕━━━━╮\n`;
        texto += `┃\n`;
        texto += `┃  ☁️ *CAFUNÉ*\n`;
        texto += `┃\n`;
        texto += `┃  👤 *De:* ${nomeFez}\n`;
        texto += `┃  🎯 *Para:* ${nomeRecebeu}\n`;
        texto += `┃\n`;
        texto += `┣━━━━━━━━━━━━━━━━━━━━━━━\n`;
        texto += `┃\n`;
        texto += `┃  ${nomeFez} está fazendo um \n`;
        texto += `┃  cafuné carinhoso em ${nomeRecebeu}...\n`;
        texto += `┃\n`;
        texto += `┃  _"Tem gente que está ficando_\n`;
        texto += `┃  _mal acostumada!"_ 🧸\n`;
        texto += `┃\n`;
        texto += `╰━━━━〔 🎖️ *BY BENNY* 🎖️ 〕━━━━╯`;
        // -------------------------------------

        // 3. Envio da Foto (JPG)
        if (fs.existsSync(fotoPath)) {
            try {
                await sock.sendMessage(from, { 
                    image: fs.readFileSync(fotoPath), 
                    caption: texto,
                    mentions: [quemFez, quemRecebeu]
                }, { quoted: msg });
            } catch (err) {
                console.log("Erro ao enviar foto de cafuné:", err);
                await sock.sendMessage(from, { text: texto, mentions: [quemFez, quemRecebeu] }, { quoted: msg });
            }
        } else {
            // Caso o arquivo não exista
            console.log(`[AVISO] Arquivo não encontrado: ${fotoPath}`);
            await sock.sendMessage(from, { 
                text: texto, 
                mentions: [quemFez, quemRecebeu] 
            }, { quoted: msg });
        }
    }
};
