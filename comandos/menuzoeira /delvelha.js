/**
 * Comando: deletar jogo da velha 🧹
 * Função: Resetar o tabuleiro do grupo.
 * Créditos: Benny ⚔️
 */

module.exports = {
    name: 'delvelha',
    category: 'menuzoeira',
    description: 'Reseta o jogo da velha do grupo.',
    alias: ['resetvelha', 'limparvelha'],
    async execute(sock, msg, args, { from, isGroup, reply, eDono }) {
        if (!isGroup) return reply("❌ Apenas em grupos.");

        // Verificar se é ADM ou Dono
        const mdata = await sock.groupMetadata(from);
        const adms = mdata.participants.filter(p => p.admin !== null).map(p => p.id);
        const isAdm = adms.includes(msg.key.participant || msg.key.remoteJid);

        if (!isAdm && !eDono) return reply("⚠️ Apenas ADMs ou meu Dono podem resetar o jogo!");

        if (!global.velha || !global.velha[from]) {
            return reply("💡 Não há nenhum jogo da velha rolando aqui.");
        }

        delete global.velha[from];
        await sock.sendMessage(from, { react: { text: '🧹', key: msg.key }});
        return reply("✅ O Jogo da Velha foi resetado com sucesso!");
    }
};
