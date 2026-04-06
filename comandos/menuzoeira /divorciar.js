/**
 * Comando: divorciar 💔
 * Pasta: menuzoeira
 * Créditos: Benny
 */

const fs = require('fs');

module.exports = {
    name: 'divorciar',
    category: 'menuzoeira',
    description: 'Encerre o seu casamento atual.',
    alias: ['separar', 'terminar'],
    async execute(sock, msg, args, { from, reply }) {
        const dbCasaisPath = './dono/casais.json';
        
        if (!fs.existsSync(dbCasaisPath)) {
            return reply("❌ Nenhum registro de casamento encontrado.");
        }

        let dbCasais = JSON.parse(fs.readFileSync(dbCasaisPath));
        const user = msg.key.participant || msg.key.remoteJid;
        
        // Procura o ID do casal onde o usuário está presente
        const idCasal = Object.keys(dbCasais.casais).find(id => id.includes(user));

        if (!idCasal) {
            return reply("🧊 *ERRO:* Você não possui um casamento registrado no momento.");
        }

        // Identifica quem era o parceiro para marcar na despedida
        const parceiro = idCasal.replace(user, '').replace('-', '');

        // Remove do banco de dados
        delete dbCasais.casais[idCasal];
        fs.writeFileSync(dbCasaisPath, JSON.stringify(dbCasais, null, 2));

        // Reação de coração partido 💔
        await sock.sendMessage(from, { react: { text: '💔', key: msg.key }});

        let divTexto = `╭━━━〔 💔 *DIVÓRCIO DE ELITE* 💔 〕━━━╮\n`;
        divTexto += `┃\n`;
        divTexto += `┃  🥀 *ATENÇÃO:* @${user.split('@')[0]}\n`;
        divTexto += `┃  🚫 O laço com @${parceiro.split('@')[0]} foi cortado.\n`;
        divTexto += `┃\n`;
        divTexto += `┃  📜 "Nem todas as alianças duram para sempre.\n`;
        divTexto += `┃  Siga seu caminho, soldado."\n`;
        divTexto += `┃\n`;
        divTexto += `╰━━━━〔 🕊️ *STATUS: SOLTEIRO* 〕━━━━╯`;

        return sock.sendMessage(from, { text: divTexto, mentions: [user, parceiro] }, { quoted: msg });
    }
};
