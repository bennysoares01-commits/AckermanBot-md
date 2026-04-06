/**
 * Comando: Bem-vindo 🚪
 * Função: Ativar/Desativar saudações automáticas.
 * Créditos: Benny ⚔️
 */

const fs = require('fs');

module.exports = {
    name: 'bemvindo',
    category: 'admin',
    description: 'Ativa ou desativa as boas-vindas no grupo.',
    alias: ['bv', 'welcome'],
    async execute(sock, msg, args, { from, isGroup, isAdmins, reply }) {
        
        if (!isGroup) return reply("⚠️ Este comando só funciona em grupos.");
        if (!isAdmins) return reply("⚠️ Apenas administradores podem usar este comando.");

        const dbPath = './dono/grupos.json';
        if (!fs.existsSync('./dono')) fs.mkdirSync('./dono');
        if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({}));

        let grupos = JSON.parse(fs.readFileSync(dbPath));
        if (!grupos[from]) grupos[from] = { bemvindo: false, legenda: "Bem-vindo #nmr# ao grupo #nomedogp#!" };

        if (!args[0]) return reply(`📋 *STATUS:* ${grupos[from].bemvindo ? "✅ ATIVADO" : "❌ DESATIVADO"}\n\nUse: *.bemvindo on* ou *.bemvindo off*`);

        if (args[0] === 'on') {
            grupos[from].bemvindo = true;
            reply("✅ *Boas-vindas ativadas para este grupo!*");
        } else if (args[0] === 'off') {
            grupos[from].bemvindo = false;
            reply("❌ *Boas-vindas desativadas.*");
        }

        fs.writeFileSync(dbPath, JSON.stringify(grupos, null, 2));
    }
};
