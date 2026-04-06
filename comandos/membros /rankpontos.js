/**
 * Comando: rankpontos 🥇
 * Função: Exibe o Top 10 usuários com mais pontos.
 */
const fs = require('fs');

module.exports = {
    name: 'rankpontos',
    category: 'utilitarios',
    description: 'Exibe o rank mundial de pontos.',
    async execute(sock, msg, args, { from }) {
        const dbPath = './dono/pontos.json';
        if (!fs.existsSync(dbPath)) return sock.sendMessage(from, { text: "Ninguém pontuou ainda!" });

        const db = JSON.parse(fs.readFileSync(dbPath));
        const rank = Object.entries(db)
            .map(([id, pts]) => ({ id, total: pts.total }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 10);

        let texto = `╭━━〔 🥇 *RANK ACKERMAN* 〕━━╮\n┃\n`;
        rank.forEach((user, index) => {
            const medalha = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🎖️';
            texto += `┃ ${medalha} ${index + 1}° - @${user.id.split('@')[0]}\n`;
            texto += `┃ ➔ PONTOS: ${user.total}\n┃\n`;
        });
        texto += `╰━━━━━〔 ⚔️ 〕━━━━━╯`;

        await sock.sendMessage(from, { text: texto, mentions: rank.map(u => u.id) });
        await sock.sendMessage(from, { react: { text: '🏆', key: msg.key }});
    }
};
