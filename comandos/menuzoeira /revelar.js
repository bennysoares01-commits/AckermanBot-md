/**
 * Comando: revelar 🔓
 * Função: Revela a palavra do anagrama atual e encerra a rodada.
 * Créditos: Benny ⚔️
 */

const fs = require('fs');

module.exports = {
    name: 'revelar',
    category: 'menuzoeira',
    description: 'Revela a palavra do anagrama atual.',
    alias: ['revelar_anagrama', 'desisto'],
    async execute(sock, msg, args, { from, isGroup, reply, eDono }) {
        if (!isGroup) return reply("❌ Apenas em grupos.");

        // --- 🛡️ TRAVA DE SEGURANÇA: MODO ZOEIRA ---
        const dbZoeiraPath = './database/modozoeira.json';
        const dbZoeira = fs.existsSync(dbZoeiraPath) ? JSON.parse(fs.readFileSync(dbZoeiraPath)) : {};

        if (!dbZoeira[from]) {
            await sock.sendMessage(from, { react: { text: '🛡️', key: msg.key }});
            return reply("⚠️ *MODO ZOEIRA NÃO ESTÁ ATIVADO!* \n\nPeça para algum administrador ativar com: *modozoeira on*");
        }
        // ------------------------------------------

        // Trava para ADMs e Dono
        const groupMetadata = await sock.groupMetadata(from);
        const isAdmin = groupMetadata.participants.find(p => p.id === (msg.key.participant || msg.key.remoteJid))?.admin;
        if (!isAdmin && !eDono) return reply("⚠️ Apenas Generais (ADMs) podem revelar a palavra.");

        if (!global.anagrama || !global.anagrama[from] || !global.anagrama[from].palavra) {
            return reply("❌ Não há nenhum jogo de anagrama rolando agora.");
        }

        const palavraRevelada = global.anagrama[from].palavra;
        
        // Remove a palavra atual para evitar que acertem depois de revelada
        delete global.anagrama[from].palavra;

        await sock.sendMessage(from, { react: { text: '💡', key: msg.key }});
        await reply(`🏳️ *DESISTÊNCIA!* \n\nA palavra secreta era: *${palavraRevelada}*\n\n_Uma nova rodada começará em 5 segundos..._`);

        // Reinicia o jogo automaticamente após 5 segundos
        setTimeout(() => {
            if (global.anagrama[from] && global.anagrama[from].status) {
                global.iniciarRodadaAnagrama(sock, from);
            }
        }, 5000);
    }
};
