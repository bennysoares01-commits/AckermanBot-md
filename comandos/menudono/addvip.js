/**
 * ACKERMAN-BOT ⚔️
 * Comando: Adicionar VIP 💎
 * Créditos: Benny ⚔️
 */

const fs = require('fs');

module.exports = {
    name: 'addvip',
    category: 'dono',
    description: 'Adiciona um usuário à lista de VIPs.',
    alias: ['darvip', 'vipadd'],
    async execute(sock, msg, args, { from, sender, reply, isOwner }) {
        
        // --- 🛡️ VERIFICAÇÃO DE DONO (MÉTODO BLINDADO) ---
        const numeroDono = "559181626178";
        // Verifica se o sender contém o seu número ou se o handler já confirmou
        const souDono = (sender && sender.includes(numeroDono)) || isOwner;

        if (!souDono) {
            return reply("❌ COMANDO É APENAS PARA O MEU DONO");
        }

        // Captura o alvo (mencionado ou citado)
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage ? msg.message.extendedTextMessage.contextInfo.participant : false;
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || quoted;

        if (!mentioned) {
            return reply("⚠️ Marque (@) alguém ou responda a uma mensagem para dar VIP.");
        }

        const vipPath = './database/vips.json';
        
        // Garante a existência da pasta e do arquivo
        if (!fs.existsSync('./database')) fs.mkdirSync('./database', { recursive: true });
        if (!fs.existsSync(vipPath)) fs.writeFileSync(vipPath, JSON.stringify([]));
        
        let vips = JSON.parse(fs.readFileSync(vipPath));

        if (vips.includes(mentioned)) {
            return reply("✨ Este usuário já é um membro VIP.");
        }

        vips.push(mentioned);
        fs.writeFileSync(vipPath, JSON.stringify(vips, null, 2));

        await sock.sendMessage(from, { react: { text: '💎', key: msg.key }});
        return reply(`✅ O usuário @${mentioned.split('@')[0]} agora é um membro **VIP**!`, { mentions: [mentioned] });
    }
};
