/**
 * Comando: casar 💍
 * Pasta: menuzoeira
 * Créditos: Benny ⚔️
 */

const fs = require('fs');

module.exports = {
    name: 'casar',
    category: 'menuzoeira',
    description: 'Peça um membro do grupo em casamento.',
    alias: ['casamento', 'proposta'],
    async execute(sock, msg, args, { from, prefixo, reply, sender }) {
        
        // --- 🛡️ TRAVA DE SEGURANÇA: MODO ZOEIRA ---
        const dbZoeiraPath = './database/modozoeira.json';
        const dbZoeira = fs.existsSync(dbZoeiraPath) ? JSON.parse(fs.readFileSync(dbZoeiraPath)) : {};

        if (!dbZoeira[from]) {
            await sock.sendMessage(from, { react: { text: '🛡️', key: msg.key }});
            return reply("⚠️ *MODO ZOEIRA NÃO ESTÁ ATIVADO!* \n\nPeça para algum administrador ativar.\nPara ativar é só usar: *modozoeira on*");
        }
        // ------------------------------------------
        
        await sock.sendMessage(from, { react: { text: '💍', key: msg.key }});

        const noivo = sender;
        const noiva = msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || 
                      msg.message.extendedTextMessage?.contextInfo?.participant || null;

        if (!noiva) return reply(`⚔️ *ERRO:* Marque alguém! Ex: ${prefixo}casar @usuario`);
        if (noiva === noivo) return reply("❌ Você não pode casar consigo mesmo!");

        // --- REGISTRA O PEDIDO NO HANDLER ---
        if (!global.pedidosCasamento) global.pedidosCasamento = {};
        
        global.pedidosCasamento[`${from}-${noiva}`] = {
            noivo: noivo,
            tempo: Date.now()
        };

        // Remove o pedido automaticamente após 2 minutos se não houver resposta
        setTimeout(() => {
            if (global.pedidosCasamento[`${from}-${noiva}`]) {
                delete global.pedidosCasamento[`${from}-${noiva}`];
            }
        }, 120000);

        // Caminho da foto
        const caminhoFoto = "./media/casar.jpg";

        let pedidoTexto = `╭━━━〔 💍 *PEDIDO DE ELITE* 💍 〕━━━╮\n`;
        pedidoTexto += `┃\n`;
        pedidoTexto += `┃  🌹 *ATENÇÃO:* @${noiva.split('@')[0]}\n`;
        pedidoTexto += `┃  🛡️ @${noivo.split('@')[0]} quer casar com você!\n`;
        pedidoTexto += `┃\n`;
        pedidoTexto += `┃  ✅ Diga *Sim* para aceitar\n`;
        pedidoTexto += `┃  ❌ Diga *Não* para recusar\n`;
        pedidoTexto += `┃\n`;
        pedidoTexto += `╰━━━━〔 🎖️ *ACKERMAN-BOT* 🎖️ 〕━━━━╯`;

        // Lógica de envio com Foto JPG
        if (fs.existsSync(caminhoFoto)) {
            return sock.sendMessage(from, { 
                image: fs.readFileSync(caminhoFoto), 
                caption: pedidoTexto,
                mentions: [noivo, noiva] 
            }, { quoted: msg });
        } else {
            return sock.sendMessage(from, { 
                text: pedidoTexto, 
                mentions: [noivo, noiva] 
            }, { quoted: msg });
        }
    }
};
