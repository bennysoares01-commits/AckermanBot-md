/**
 * Comando: abraco 🫂
 * Pasta: diversao
 * Versão: 2.0 (Design Clean & Foto)
 * Créditos: Benny ⚔️
 */

const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'abraço',
    category: 'diversao',
    description: 'Dê um abraço em alguém do grupo.',
    alias: ['abracar', 'abraçar'],
    async execute(sock, msg, args, { from, reply, prefixo, sender }) {
        
        // --- 🛡️ TRAVA DE SEGURANÇA: MODO ZOEIRA ---
        const dbPath = './database/modozoeira.json';
        const dbZoeira = fs.existsSync(dbPath) ? JSON.parse(fs.readFileSync(dbPath)) : {};

        if (!dbZoeira[from]) {
            await sock.sendMessage(from, { react: { text: '🛡️', key: msg.key }});
            return reply("⚠️ *MODO ZOEIRA NÃO ESTÁ ATIVADO!* \n\nPeça para algum administrador ativar.\nPara ativar é só usar: *modozoeira on*");
        }
        // ------------------------------------------

        // 1. Identifica quem vai receber o abraço
        const mencao = msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || 
                       msg.message.extendedTextMessage?.contextInfo?.participant;
        
        if (!mencao) {
            return reply(`⚠️ Mencione alguém para abraçar!\nExemplo: *${prefixo}abraco @user*`);
        }

        // 2. Reação de emoji
        await sock.sendMessage(from, { react: { text: '🫂', key: msg.key }});

        // 3. Configuração de Nomes e Caminho da Foto
        const nomeAbracou = msg.pushName || 'Alguém';
        const nomeRecebeu = `@${mencao.split('@')[0]}`;
        const fotoPath = './media/abraco.jpg'; 

        // --- ⚔️ DESIGN ACKERMAN ⚔️ ---
        let texto = `╭━━━━〔 ⚔️ *ACKERMAN* ⚔️ 〕━━━━╮\n`;
        texto += `┃\n`;
        texto += `┃  🫂 *ABRAÇO*\n`;
        texto += `┃\n`;
        texto += `┃  👤 *De:* ${nomeAbracou}\n`;
        texto += `┃  🎯 *Para:* ${nomeRecebeu}\n`;
        texto += `┃\n`;
        texto += `┣━━━━━━━━━━━━━━━━━━━━━━━\n`;
        texto += `┃\n`;
        texto += `┃  ${nomeAbracou} deu um abraço \n`;
        texto += `┃  bem apertado em ${nomeRecebeu}! 🫂\n`;
        texto += `┃\n`;
        texto += `╰━━━━〔 🎖️ *BY BENNY* 🎖️ 〕━━━━╯`;
        // -------------------------------------

        // 4. Envio da Foto
        if (fs.existsSync(fotoPath)) {
            try {
                await sock.sendMessage(from, { 
                    image: fs.readFileSync(fotoPath), 
                    caption: texto,
                    mentions: [sender, mencao]
                }, { quoted: msg });
            } catch (err) {
                console.log("Erro ao enviar foto:", err);
                await sock.sendMessage(from, { text: texto, mentions: [sender, mencao] }, { quoted: msg });
            }
        } else {
            // Se a foto não existir, manda só o texto formatado
            await sock.sendMessage(from, { 
                text: texto, 
                mentions: [sender, mencao] 
            }, { quoted: msg });
        }
    }
};
