/**
 * Comando: fechar 🔒
 * Pasta: seguranca
 * Função: Restringe o envio de mensagens apenas para ADMs.
 */

module.exports = {
    name: 'fechar',
    category: 'seguranca',
    description: 'Fecha o grupo para apenas ADMs falarem.',
    alias: ['fecharp', 'muteas'],
    async execute(sock, msg, args, { from, isGroup, reply, eDono }) {
        
        if (!isGroup) return reply("❌ Este comando só pode ser usado em grupos.");

        // Coleta metadados do grupo para verificar ADM
        const groupMetadata = await sock.groupMetadata(from);
        const participants = groupMetadata.participants;
        const sender = msg.key.participant || msg.key.remoteJid;
        const isAdmin = participants.find(p => p.id === sender)?.admin;
        
        if (!isAdmin && !eDono) return reply("⚠️ Comando exclusivo para ADMs ou meu Dono.");

        await sock.sendMessage(from, { react: { text: '🔒', key: msg.key }});

        // Altera a configuração do grupo no WhatsApp
        await sock.groupSettingUpdate(from, 'announcement');
        
        return reply("🔒 *MURALHA ERGUIDA!* \n\nAgora apenas os Generais (ADMs) podem enviar mensagens neste grupo.");
    }
};
