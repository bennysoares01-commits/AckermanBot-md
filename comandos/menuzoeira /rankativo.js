/**
 * Comando: rankativo 🏆
 * Pasta: membros
 * Créditos: Benny ⚔️
 */

const fs = require('fs');

module.exports = {
    name: 'rankativo',
    category: 'menuzoeira',
    description: 'Mostra o ranking de membros mais ativos do grupo.',
    alias: ['ranking', 'top'],
    async execute(sock, msg, args, { from, isGroup, db, reply }) {
        
        if (!isGroup) return reply('Este comando só funciona em grupos! ❌');

        // --- 🛡️ TRAVA DE SEGURANÇA: MODO ZOEIRA ---
        const dbZoeiraPath = './database/modozoeira.json';
        const dbZoeira = fs.existsSync(dbZoeiraPath) ? JSON.parse(fs.readFileSync(dbZoeiraPath)) : {};

        if (!dbZoeira[from]) {
            await sock.sendMessage(from, { react: { text: '🛡️', key: msg.key }});
            return reply("⚠️ *MODO ZOEIRA NÃO ESTÁ ATIVADO!* \n\nPeça para algum administrador ativar.\nPara ativar é só usar: *modozoeira on*");
        }
        // ------------------------------------------

        // Reação automática 🏆
        await sock.sendMessage(from, { react: { text: '🏆', key: msg.key }});

        // 1. Pega todos os usuários da database e transforma em array
        const usuarios = Object.entries(db.users).map(([jid, data]) => ({
            jid,
            msgCount: data.messageCount || 0,
            name: data.name || 'Usuário'
        }));

        // 2. Ordena do maior para o menor
        usuarios.sort((a, b) => b.msgCount - a.msgCount);

        // 3. Pega os top 10
        const top10 = usuarios.slice(0, 10);

        if (top10.length === 0) return reply('Ainda não há dados de atividade neste grupo. 😶');

        let texto = `🏆 *RANKING DE ATIVIDADE - ACKERMAN* 🏆\n\n`;
        texto += `> Os 10 membros mais falantes:\n\n`;

        top10.forEach((user, index) => {
            const medalha = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '✨';
            const idLimpo = user.jid.split('@')[0];
            texto += `${medalha} *${index + 1}º* - @${idLimpo}\n`;
            texto += `└ Mensagens: *${user.msgCount}*\n\n`;
        });

        texto += `_Continue interagindo para subir no rank!_`;

        // Envia com menções para os nomes ficarem azuis
        return sock.sendMessage(from, { 
            text: texto, 
            mentions: top10.map(u => u.jid) 
        }, { quoted: msg });
    }
};
