/**
 * Comando: marcar 📢
 * Pasta: menuadm
 * Função: Menciona todos os membros do grupo.
 */

module.exports = {
    name: 'marcar',
    category: 'menuadm',
    description: 'Marca todos os membros do grupo.',
    alias: ['todos', 'summon', 'tagall'],
    async execute(sock, msg, args, { from, isGroup, reply, eDono }) {
        
        if (!isGroup) return reply("❌ Este comando só pode ser usado em grupos.");

        // Coleta metadados do grupo
        const groupMetadata = await sock.groupMetadata(from);
        const participants = groupMetadata.participants;
        
        // Verifica se é ADM ou Dono
        const sender = msg.key.participant || msg.key.remoteJid;
        const isAdmin = participants.find(p => p.id === sender)?.admin;
        
        if (!isAdmin && !eDono) return reply("⚠️ Comando exclusivo para ADMs ou meu Dono.");

        await sock.sendMessage(from, { react: { text: '📢', key: msg.key }});

        let mensagem = args.length > 0 ? `*MENSAGEM:* ${args.join(' ')}\n\n` : `*CONVOCAÇÃO GERAL!* ⚔️\n\n`;
        let mentions = [];

        for (let participant of participants) {
            mensagem += `⚔️ @${participant.id.split('@')[0]}\n`;
            mentions.push(participant.id);
        }

        return sock.sendMessage(from, { 
            text: mensagem, 
            mentions: mentions 
        }, { quoted: msg });
    }
};
