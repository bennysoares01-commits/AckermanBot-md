/**
 * Comando: menuadm 👮‍♂️
 * Pasta: adm
 * Créditos: Benny ⚔️
 */

const fs = require('fs');

module.exports = {
    name: 'menuadm',
    category: 'admin',
    description: 'Painel de controle para os Generais da Tropa.',
    alias: ['adm', 'adms'],
    async execute(sock, msg, args, { from, prefixo, pushName, reply, sender }) {
        
        // Reação de autoridade 👮‍♂️
        await sock.sendMessage(from, { react: { text: '👮‍♂️', key: msg.key }});

        // Caminho da imagem
        const fotoMenu = "./media/menu.jpg"; 

        let texto = `╭━━━〔 ⚔️ *MENU ADM* ⚔️ 〕━━━╮\n`;
        texto += `┃\n`;
        texto += `┃  👮‍♂️ *CONTROLE DE ELITE*\n`;
        texto += `┃  🛡️ *GENERAL:* ${pushName}\n`;
        texto += `┃\n`;
        texto += `┣━━━〔 👥 *MEMBROS* 〕━━━━\n`;
        texto += `┃\n`;
        texto += `┃  🚫 *${prefixo}ban* (Remover)\n`;
        texto += `┃  ✅ *${prefixo}add* (Adicionar)\n`;
        texto += `┃  🆙 *${prefixo}promover* (Dar ADM)\n`;
        texto += `┃  ⬇️ *${prefixo}rebaixar* (Tirar ADM)\n`;
        texto += `┃  📢 *${prefixo}marcar* (Todos)\n`;
        texto += `┃\n`;
        texto += `┣━━━〔 ⚖️ *ADVERTÊNCIAS* 〕━━━━\n`;
        texto += `┃\n`;
        texto += `┃  ⚠️ *${prefixo}adv* (Dar Advertência)\n`;
        texto += `┃  🛡️ *${prefixo}rmadv* (Remover Adv)\n`;
        texto += `┃  🔗 *${prefixo}advlink* (Adv por link)\n`;
        texto += `┃\n`;
        texto += `┣━━━〔 🚪 *RECEPÇÃO* 〕━━━━\n`;
        texto += `┃\n`;
        texto += `┃  🚪 *${prefixo}bemvindo* (on/off)\n`;
        texto += `┃  ✏️ *${prefixo}legendabv* (Texto)\n`;
        texto += `┃  ℹ️ *${prefixo}infobv* (Tags)\n`;
        texto += `┃\n`;
        texto += `┣━━━〔 🛡️ *SEGURANÇA* 〕━━━━\n`;
        texto += `┃\n`;
        texto += `┃  🚫 *${prefixo}antilink* (Ban Direto)\n`;
        texto += `┃  🌐 *${prefixo}antilinkgp* (on/off)\n`;
        texto += `┃  🌊 *${prefixo}antiflood* (on/off)\n`;
        texto += `┃  🎭 *${prefixo}modozoeira* (on/off)\n`;
        texto += `┃  🔇 *${prefixo}mute* (Calar)\n`;
        texto += `┃  🔊 *${prefixo}desmute* (Falar)\n`;
        texto += `┃  🔒 *${prefixo}fechar* (Manual)\n`;
        texto += `┃  🔓 *${prefixo}abrir* (Manual)\n`;
        texto += `┃\n`;
        texto += `┣━━━〔 ⏰ *LOGÍSTICA* 〕━━━━\n`;
        texto += `┃\n`;
        texto += `┃  🕙 *${prefixo}opengp* (Abrir Automático)\n`;
        texto += `┃  🕙 *${prefixo}closegp* (Fechar Automático)\n`;
        texto += `┃  🗑️ *${prefixo}rmhorario* (Remover Horário)\n`;
        texto += `┃\n`;
        texto += `╰━━━━〔 🎖️ *ACKERMAN* 🎖️ 〕━━━━╯\n\n`;
        texto += `*SHINZOU WO SASAGEYO!* 🕊️`;

        if (fs.existsSync(fotoMenu)) {
            await sock.sendMessage(from, { 
                image: { url: fotoMenu }, 
                caption: texto,
                mentions: [sender]
            }, { quoted: msg });
        } else {
            return reply(texto);
        }
    }
};
