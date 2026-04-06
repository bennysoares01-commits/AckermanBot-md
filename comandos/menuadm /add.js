/**
 * Comando: add ✅
 * Pasta: menuadm
 * Créditos: Benny ⚔️
 */

module.exports = {
    name: 'add',
    category: 'menuadm',
    description: 'Adiciona um número ao grupo.',
    alias: ['adicionar', 'convidar'],
    async execute(sock, msg, args, { from, isGroup, reply, eDono }) {
        if (!isGroup) return reply("❌ Apenas em grupos.");

        const groupMetadata = await sock.groupMetadata(from);
        const isAdmin = groupMetadata.participants.find(p => p.id === (msg.key.participant || msg.key.remoteJid))?.admin;
        if (!isAdmin && !eDono) return reply("⚠️ Apenas Generais (ADMs) podem usar este comando.");

        let num = args[0]?.replace(/\D/g, '');
        if (!num) return reply("❌ Digite o número com DDD. \nEx: *.add 55919xxxxxxx*");

        const jid = num + '@s.whatsapp.net';

        await sock.sendMessage(from, { react: { text: '✅', key: msg.key }});

        try {
            const response = await sock.groupParticipantsUpdate(from, [jid], "add");
            
            // O WhatsApp às vezes retorna 403 se a pessoa tiver trava de convite
            if (response[0].status === "403") {
                return reply("⚠️ O usuário tem travas de privacidade. Envie o link do grupo para ele!");
            }
            
            return reply(`✅ Soldado convocado com sucesso!`);
        } catch (err) {
            return reply("❌ Erro ao adicionar. O número pode estar incorreto ou o bot não é ADM.");
        }
    }
};
