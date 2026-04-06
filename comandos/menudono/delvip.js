/**
 * ACKERMAN-BOT ⚔️
 * Comando: Remover VIP 🗑️
 * Créditos: Benny ⚔️
 */

const fs = require('fs');

module.exports = {
    name: 'delvip',
    category: 'dono',
    description: 'Remove um usuário da lista de VIPs.',
    alias: ['tirarvip', 'rvip'],
    async execute(sock, msg, args, { from, sender, reply, isOwner }) {
        
        // --- 🛡️ VERIFICAÇÃO DE DONO (MÉTODO BLINDADO) ---
        const numeroDono = "559181626178";
        const souDono = (sender && sender.includes(numeroDono)) || isOwner;

        if (!souDono) {
            return reply("❌ COMANDO É APENAS PARA O MEU DONO");
        }

        // Captura o alvo (mencionado ou citado)
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage ? msg.message.extendedTextMessage.contextInfo.participant : false;
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || quoted;

        if (!mentioned) {
            return reply("⚠️ Marque alguém ou responda a uma mensagem para remover o VIP.");
        }

        const vipPath = './database/vips.json';
        if (!fs.existsSync(vipPath)) {
            return reply("❌ Nenhum VIP cadastrado no sistema.");
        }

        let vips = JSON.parse(fs.readFileSync(vipPath));

        if (!vips.includes(mentioned)) {
            return reply("⚠️ Este usuário não consta na lista de VIPs.");
        }

        // Filtra a lista removendo o usuário selecionado
        vips = vips.filter(v => v !== mentioned);
        fs.writeFileSync(vipPath, JSON.stringify(vips, null, 2));

        await sock.sendMessage(from, { react: { text: '🗑️', key: msg.key }});
        return reply(`❌ O VIP de @${mentioned.split('@')[0]} foi removido com sucesso.`, { mentions: [mentioned] });
    }
};
