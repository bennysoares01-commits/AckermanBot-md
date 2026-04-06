/**
 * Comando: abrir 🔓
 * Pasta: seguranca
 * Função: Permite que todos os membros enviem mensagens.
 */

module.exports = {
    name: 'abrir',
    category: 'seguranca',
    description: 'Abre o grupo para todos falarem.',
    alias: ['abrirgp', 'unmuteas'],
    async execute(sock, msg, args, { from, isGroup, reply, eDono }) {
        
        if (!isGroup) return reply("❌ Este comando só pode ser usado em grupos.");

        const groupMetadata = await sock.groupMetadata(from);
        const participants = groupMetadata.participants;
        const sender = msg.key.participant || msg.key.remoteJid;
        const isAdmin = participants.find(p => p.id === sender)?.admin;
        
        if (!isAdmin && !eDono) return reply("⚠️ Comando exclusivo para ADMs ou meu Dono.");

        await sock.sendMessage(from, { react: { text: '🔓', key: msg.key }});

        // Altera para que todos possam enviar mensagens
        await sock.groupSettingUpdate(from, 'not_announcement');
        
        return reply("🔓 *MURALHA ABERTA!* \n\nO grupo foi liberado. Todos os soldados podem falar agora.");
    }
};
