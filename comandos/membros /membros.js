/**
 * Comando: membros 👥
 * Pasta: membros
 * Créditos: Benny ⚔️
 */

const fs = require('fs');

module.exports = {
    name: 'membros',
    category: 'membros',
    description: 'Lista de comandos para os usuários.',
    alias: ['membro', 'utilitarios', 'help'],
    async execute(sock, msg, args, { from, prefixo, reply }) {
        
        await sock.sendMessage(from, { react: { text: '👥', key: msg.key }});

        const fotoMenu = "./media/menu.jpg"; 

        let texto = `╭━━━〔 👤 *MENU DE USUÁRIOS* 👤 〕━━━╮\n`;
        texto += `┃\n`;
        texto += `┃  Aqui estão os comandos disponíveis\n`;
        texto += `┃  para todos os membros do grupo.\n`;
        texto += `┃\n`;
        texto += `┣━━━━━━━━━━━━━━━━━━━━━━━\n`;
        texto += `┃  📊 ┃ *${prefixo}perfil* (Seus dados)\n`;
        texto += `┃  ⚡ ┃ *${prefixo}ping* (Velocidade)\n`;
        texto += `┃  🎨 ┃ *${prefixo}sticker* (Figurinhas)\n`;
        texto += `┃  ✏️ ┃ *${prefixo}rename* (Mudar créditos)\n`;
        texto += `┃  ⛩️ ┃ *${prefixo}infoanime* (Dados de Anime)\n`;
        texto += `┃  🌐 ┃ *${prefixo}wiki* (Pesquisar na Wikipedia)\n`;
        texto += `┃  🎼 ┃ *${prefixo}letra* (Letras de músicas)\n`;
        texto += `┃  🧩 ┃ *${prefixo}advinha* (Jogo de advinhação)\n`;
        texto += `┃  💤 ┃ *${prefixo}afk* (Ficar ausente)\n`;
        texto += `┃  🥇 ┃ *${prefixo}rankpontos* (Mais pontos)\n`;
        texto += `┃  🧮 ┃ *${prefixo}mepontos* (Ver seus pontos)\n`;
        texto += `┃  🧠 ┃ *${prefixo}fatos* (Fatos interessantes)\n`;
        texto += `┃  ⏰ ┃ *${prefixo}lembrete* (Agendar aviso)\n`;
        texto += `┃  🗑️ ┃ *${prefixo}del-lembrete* (Apagar aviso)\n`;
        texto += `┃\n`;
        texto += `┣━━━━━━━━━━━━━━━━━━━━━━\n`;
        texto += `┃\n`;
        texto += `┃  *Dica:* Use os comandos corretamente\n`;
        texto += `┃  para evitar erros no bot.\n`;
        texto += `┃\n`;
        texto += `╰━━━━〔 🎖️ *ACKERMAN* 🎖️ 〕━━━━╯\n\n`;
        texto += `*© 2026 ACKERMAN-BOT - BY BENNY*`;

        const adReply = {
            contextInfo: {
                externalAdReply: {
                    title: `✅ Ackerman-Bot`, 
                    body: `👤 Criador: Benny ⚔️`,
                    mediaType: 1,
                    renderLargerThumbnail: false,
                    thumbnail: "", 
                    sourceUrl: `https://wa.me/559181626178`
                }
            }
        };

        if (fs.existsSync(fotoMenu)) {
            return await sock.sendMessage(from, { 
                image: { url: fotoMenu }, 
                caption: texto,
                ...adReply
            }, { quoted: msg });
        } else {
            return await sock.sendMessage(from, { 
                text: texto,
                ...adReply
            }, { quoted: msg });
        }
    }
};
