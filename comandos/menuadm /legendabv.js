/**
 * Comando: Legenda BV ✏️
 * Função: Personalizar o texto de saudação.
 * Créditos: Benny ⚔️
 */

const fs = require('fs');

module.exports = {
    name: 'legendabv',
    category: 'admin',
    description: 'Define o texto de boas-vindas.',
    alias: ['setbv', 'texto-bv'],
    async execute(sock, msg, args, { from, isGroup, isAdmins, reply }) {
        
        if (!isGroup) return reply("⚠️ Este comando só funciona em grupos.");
        if (!isAdmins) return reply("⚠️ Apenas administradores podem usar este comando.");
        if (!args.length) return reply("⚠️ Digite o novo texto. Use *.infobv* para ver as tags disponíveis.");

        const dbPath = './dono/grupos.json';
        let grupos = JSON.parse(fs.readFileSync(dbPath));
        if (!grupos[from]) grupos[from] = { bemvindo: false };

        const novoTexto = args.join(" ");
        grupos[from].legenda = novoTexto;

        fs.writeFileSync(dbPath, JSON.stringify(grupos, null, 2));
        return reply("✅ *Legenda de boas-vindas atualizada!*");
    }
};
