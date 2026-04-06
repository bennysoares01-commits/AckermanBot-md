/**
 * Comando: rebaixar ⬇️
 * Pasta: menuadm
 * Créditos: Benny ⚔️
 */

module.exports = {
    name: 'rebaixar',
    category: 'menuadm',
    description: 'Remove o cargo de administrador de um membro.',
    alias: ['tiraradm', 'demote'],
    async execute(sock, msg, args, { from, isGroup, reply, eDono }) {
        if (!isGroup) return reply("❌ Apenas em grupos.");

        const groupMetadata = await sock.groupMetadata(from);
        const isAdmin = groupMetadata.participants.find(p => p.id === (msg.key.participant || msg.key.remoteJid))?.admin;
        if (!isAdmin && !eDono) return reply("⚠️ Apenas Generais (ADMs) podem usar este comando.");

        const quoted = msg.message.extendedTextMessage?.contextInfo?.participant;
        const mencionado = msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        const alvo = mencionado || quoted;

        if (!alvo) return reply("❌ Marque ou mencione quem será rebaixado.");
        if (alvo.includes("559181626178")) return reply("❌ Eu não posso rebaixar o meu Criador.");

        await sock.sendMessage(from, { react: { text: '⬇️', key: msg.key }});

        try {
            await sock.groupParticipantsUpdate(from, [alvo], "demote");
            return reply(`📉 *REBAIXADO!* \n\nO usuário @${alvo.split('@')[0]} foi removido da Elite.`, { mentions: [alvo] });
        } catch (err) {
            return reply("❌ Erro ao rebaixar. Verifique se o bot é administrador.");
        }
    }
};
