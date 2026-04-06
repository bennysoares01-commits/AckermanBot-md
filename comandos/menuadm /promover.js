/**
 * Comando: promover 🆙
 * Pasta: menuadm
 * Créditos: Benny ⚔️
 */

module.exports = {
    name: 'promover',
    category: 'menuadm',
    description: 'Dá cargo de administrador a um membro.',
    alias: ['daradm', 'promo'],
    async execute(sock, msg, args, { from, isGroup, reply, eDono }) {
        if (!isGroup) return reply("❌ Este comando só pode ser usado em grupos.");

        // Puxa os dados do grupo na hora
        const groupMetadata = await sock.groupMetadata(from);
        
        // Verifica se quem usou o comando é admin ou o dono (Igual ao seu rebaixar)
        const usuarioEhAdmin = groupMetadata.participants.find(p => p.id === (msg.key.participant || msg.key.remoteJid))?.admin;
        if (!usuarioEhAdmin && !eDono) {
            return reply("⚠️ Apenas Generais (ADMs) ou o Meu Dono podem usar este comando.");
        }

        // Captura do alvo (marcado ou mencionado)
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.participant;
        const mencionado = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        const alvo = mencionado || quoted;

        if (!alvo) return reply("❌ Marque ou mencione o soldado que será promovido!");

        // Verifica se o alvo já é admin para não dar erro à toa
        const alvoDados = groupMetadata.participants.find(p => p.id === alvo);
        if (alvoDados?.admin === 'admin' || alvoDados?.admin === 'superadmin') {
            return reply("⚠️ Este soldado já faz parte da Elite (ADM)!");
        }

        await sock.sendMessage(from, { react: { text: '🆙', key: msg.key }});

        try {
            // Tenta promover
            await sock.groupParticipantsUpdate(from, [alvo], "promote");

            return sock.sendMessage(from, { 
                text: `🎖️ *PROMOÇÃO CONFIRMADA!* \n\nO soldado @${alvo.split('@')[0]} agora faz parte da Elite (ADM)! ⚔️`, 
                mentions: [alvo] 
            }, { quoted: msg });

        } catch (err) {
            console.log("Erro no promover:", err);
            return reply("❌ Erro ao promover. Verifique se eu (o bot) sou administrador deste grupo!");
        }
    }
};
