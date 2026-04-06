const fs = require('fs');

module.exports = {
    name: 'ranklindo',
    category: 'menuzoeira',
    description: 'Ranking dos mais lindos do grupo.',
    async execute(sock, msg, args, { from, participants, reply }) {
        
        // --- 🛡️ TRAVA DE SEGURANÇA: MODO ZOEIRA ---
        const dbZoeiraPath = './database/modozoeira.json';
        const dbZoeira = fs.existsSync(dbZoeiraPath) ? JSON.parse(fs.readFileSync(dbZoeiraPath)) : {};

        if (!dbZoeira[from]) {
            await sock.sendMessage(from, { react: { text: '🛡️', key: msg.key }});
            return reply("⚠️ *MODO ZOEIRA NÃO ESTÁ ATIVADO!* \n\nPeça para algum administrador ativar.\nPara ativar é só usar: *modozoeira on*");
        }
        // ------------------------------------------

        await sock.sendMessage(from, { react: { text: '✨', key: msg.key }});
        
        // CORREÇÃO: Busca os participantes caso venha indefinido
        let membros = participants;
        if (!membros) {
            const groupMetadata = await sock.groupMetadata(from);
            membros = groupMetadata.participants;
        }

        const foto = "./media/ranklindo.jpg";
        const listaIds = membros.map(p => p.id);
        const sorteados = listaIds.sort(() => 0.5 - Math.random()).slice(0, 5);

        let texto = `╭━━━〔 ✨ *RANK LINDEZAS* ✨ 〕━━━╮\n┃\n`;
        const medalhas = ['🥇', '🥈', '🥉', '🏅', '🎖️'];
        sorteados.forEach((m, i) => {
            texto += `┃  ${medalhas[i]} ┃ @${m.split('@')[0]}\n`;
        });
        texto += `┃\n╰━━━━〔 🎖️ *ACKERMAN* 🎖️ 〕━━━━╯`;

        if (fs.existsSync(foto)) {
            await sock.sendMessage(from, { image: fs.readFileSync(foto), caption: texto, mentions: sorteados }, { quoted: msg });
        } else {
            return sock.sendMessage(from, { text: texto, mentions: sorteados }, { quoted: msg });
        }
    }
};
