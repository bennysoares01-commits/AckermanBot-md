/**
 * Comando: mepontos 💰
 * Função: Mostra o saldo de pontos detalhado (Completo).
 * Créditos: Benny ⚔️
 */
const fs = require('fs');

module.exports = {
    name: 'mepontos',
    category: 'utilitarios',
    description: 'Consulta seus pontos no AckermanBot.',
    alias: ['meuspontos', 'pontos'],
    async execute(sock, msg, args, { from }) {
        const user = msg.sender;
        const dbPath = './dono/pontos.json';
        
        if (!fs.existsSync(dbPath)) {
            fs.writeFileSync(dbPath, JSON.stringify({}));
        }
        
        const db = JSON.parse(fs.readFileSync(dbPath));
        
        // Puxando os dados (Incluindo Futebol e Anime)
        const p = db[user] || { velha: 0, forca: 0, anagrama: 0, futebol: 0, anime: 0, total: 0 };

        let texto = `╭━━━〔 🎖️ *STATUS ACKERMAN* 〕━━━╮\n`;
        texto += `┃\n`;
        texto += `┃ 👤 *GUERREIRO:* @${user.split('@')[0]}\n`;
        texto += `┃\n`;
        texto += `┣━━━〔 🎮 *PONTUAÇÃO* 〕━━━\n`;
        texto += `┃\n`;
        texto += `┃ ❌ *Jogo da Velha:* ${p.velha || 0} pts\n`;
        texto += `┃ 🔤 *Anagrama:* ${p.anagrama || 0} pts\n`;
        texto += `┃ 🪓 *Jogo da Forca:* ${p.forca || 0} pts\n`;
        texto += `┃ ⚽ *Quiz Futebol:* ${p.futebol || 0} pts\n`;
        texto += `┃ ⛩️ *Quiz Anime:* ${p.anime || 0} pts\n`;
        texto += `┃\n`;
        texto += `┣━━━〔 🏆 *TOTAL* 〕━━━\n`;
        texto += `┃\n`;
        texto += `┃ ✨ *ACUMULADO:* ${p.total || 0} pts\n`;
        texto += `┃\n`;
        texto += `╰━━━━━〔 🎖️ *ACKERMAN* 🎖️ 〕━━━━━╯`;

        await sock.sendMessage(from, { text: texto, mentions: [user] });
        await sock.sendMessage(from, { react: { text: '💰', key: msg.key }});
    }
};
