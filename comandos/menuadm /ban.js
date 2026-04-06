/**
 * Comando: ban 🔨
 * Pasta: adm
 * Créditos: Benny ⚔️
 */

module.exports = {
    name: "ban",
    category: "admin",
    description: "Remove um membro do grupo.",
    aliases: ["banir", "kick", "remover"],
    async execute(sock, msg, args, { from, isGroup, isAdmins, eDono, reply }) {
        
        // 🛡️ TRAVA DE GRUPO
        if (!isGroup) return reply("⚠️ Este comando só pode ser utilizado em grupos.");

        // 🛡️ TRAVA DE ADMINISTRADOR
        if (!isAdmins && !eDono) return reply("⚠️ COMANDO É APENAS PARA OS ADMINISTRADORES");

        // Pega o alvo (marcado, citado ou por número nos args)
        const quoted = msg.message.extendedTextMessage?.contextInfo?.participant;
        const mencionado = msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        const alvo = mencionado || quoted;

        if (!alvo) return reply("⚠️ Marque alguém ou responda a mensagem de quem deseja banir!");

        // 🛡️ PROTEÇÃO DO CRIADOR
        if (alvo.includes("559181626178")) return reply("❌ Tentativa de motim detectada! Eu jamais baniria o meu Criador.");

        try {
            // Reação de martelo 🔨
            await sock.sendMessage(from, { react: { text: '🔨', key: msg.key } });

            // Executa o banimento
            await sock.groupParticipantsUpdate(from, [alvo], "remove");
            
            return reply(`✅ O usuário @${alvo.split('@')[0]} foi removido do grupo!`, { mentions: [alvo] });

        } catch (err) {
            console.log("Erro ao banir:", err);
            return reply("❌ Erro ao tentar remover o usuário. Verifique se eu sou administrador.");
        }
    }
};
