/**
 * Comando: Mochila RPG 🎒
 * Descrição: Exibe o inventário de materiais e itens do jogador.
 * Créditos: Benny ⚔️
 */

const fs = require('fs');

module.exports = {
    name: 'mochila',
    category: 'menurpg',
    description: 'Veja seus materiais e itens coletados.',
    alias: ['inventario', 'inv', 'itens'],
    async execute(sock, msg, args, { from, reply, sender }) {
        
        const dbPath = './dono/rpg_players.json';
        if (!fs.existsSync(dbPath)) return reply("❌ Ninguém jogou ainda!");
        
        let players = JSON.parse(fs.readFileSync(dbPath));
        const userId = sender.split('@')[0];
        const p = players[userId];

        if (!p) return reply("❌ Você não possui uma mochila. Use */status*!");

        // Garante que o inventário existe para não dar erro
        const inv = p.inventario || { madeira: 0, ferro: 0, couro: 0, gas: 0, aco: 0 };

        let mochilaMsg = `╭━━━〔 🎒 *SUA MOCHILA* 〕━━━╮\n`;
        mochilaMsg += `│\n`;
        mochilaMsg += `│ 👤 *PROPRIETÁRIO:* ${p.nome}\n`;
        mochilaMsg += `│ 💰 *MOEDAS:* ${p.moedas}\n`;
        mochilaMsg += `│\n`;
        mochilaMsg += `│ 📦 *RECURSOS BÁSICOS:* \n`;
        mochilaMsg += `│ 🪵 Madeira: ${inv.madeira}\n`;
        mochilaMsg += `│ ⛓️ Ferro: ${inv.ferro}\n`;
        mochilaMsg += `│ 👞 Couro: ${inv.couro}\n`;
        mochilaMsg += `│\n`;
        mochilaMsg += `│ 🛠️ *EQUIPAMENTOS/RAROS:* \n`;
        mochilaMsg += `│ 💨 Cilindros Gás: ${inv.gas}\n`;
        mochilaMsg += `│ ⚔️ Aço Ultra-Duro: ${inv.aco}\n`;
        mochilaMsg += `│\n`;
        mochilaMsg += `│ 💡 _Use esses materiais para fabricar_\n`;
        mochilaMsg += `│ _melhores armas futuramente!_\n`;
        mochilaMsg += `│\n`;
        mochilaMsg += `╰━━━━━━━━━━━━━━━━━━━━╯`;

        await sock.sendMessage(from, { react: { text: '📦', key: msg.key }});
        return reply(mochilaMsg);
    }
};
