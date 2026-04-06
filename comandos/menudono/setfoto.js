/**
 * Comando: setfoto 📸
 * Pasta: dono
 * Créditos: Benny ⚔️
 */

const fs = require('fs');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

module.exports = {
    name: 'setfoto',
    category: 'menudono',
    description: 'Define a imagem principal dos menus do bot.',
    alias: ['setmenuimg', 'setimg'],
    async execute(sock, msg, args, { from, reply, eDono }) {

        // Verificação de Dono 👑 (Usando eDono conforme o seu Handler)
        if (!eDono) {
            await sock.sendMessage(from, { react: { text: '❌', key: msg.key }});
            return reply("⚠️ COMANDO É APENAS PARA O MEU DONO");
        }

        // Reação de processamento ⚙️
        await sock.sendMessage(from, { react: { text: '📸', key: msg.key }});

        const quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
        const type = msg.message.imageMessage ? 'imageMessage' : quoted?.imageMessage ? 'imageMessage' : null;

        if (type === 'imageMessage') {
            const stream = await downloadContentFromMessage(msg.message.imageMessage || quoted.imageMessage, 'image');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }

            // Salva a imagem diretamente na pasta media com o nome padrão
            const pathFoto = './media/menu.jpg';
            if (!fs.existsSync('./media')) fs.mkdirSync('./media');
            
            fs.writeFileSync(pathFoto, buffer);

            return reply("✅ *FOTO DO MENU ATUALIZADA COM SUCESSO, CAPITÃO!* ⚔️\n\nTodos os menus agora usarão esta nova imagem.");
            
        } else {
            return reply(`❓ *Como usar:* Envie uma imagem ou responda a uma com o comando *.setfoto*`);
        }
    }
};
