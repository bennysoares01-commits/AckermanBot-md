/**
 * Comando: Curar RPG 🏥
 * Descrição: Recupera a vida do jogador em troca de moedas.
 * Créditos: Benny ⚔️
 */

const fs = require('fs');

module.exports = {
    name: 'curar',
    category: 'menurpg',
    description: 'Recupere sua vida usando moedas.',
    alias: ['medico', 'heal', 'recuperar'],
    async execute(sock, msg, args, { from, reply, sender }) {
        
        const dbPath = './dono/rpg_players.json';
        if (!fs.existsSync(dbPath)) return reply("❌ Erro no sistema.");
        
        let players = JSON.parse(fs.readFileSync(dbPath));
        const userId = sender.split('@')[0];
        const p = players[userId];

        if (!p) return reply("❌ Soldado sem registro! Use */status*.");
        if (p.hp >= p.maxHp) return reply("❤️ Você já está com a vida cheia, soldado!");

        const custoCura = 50; // Custo fixo para curar 50 de HP
        const valorCura = 50;

        if (p.moedas < custoCura) return reply(`❌ Você precisa de pelo menos ${custoCura} moedas para um kit médico.`);

        // Lógica de cura
        p.moedas -= custoCura;
        p.hp = Math.min(p.maxHp, p.hp + valorCura);

        fs.writeFileSync(dbPath, JSON.stringify(players, null, 2));

        let curarMsg = `╭━━━〔 🏥 *CENTRO MÉDICO* 〕━━━╮\n`;
        curarMsg += `│\n`;
        curarMsg += `│ 💉 *KIT MÉDICO APLICADO!*\n`;
        curarMsg += `│\n`;
        curarMsg += `│ ❤️ HP Recuperado: +${valorCura}\n`;
        curarMsg += `│ 🩸 HP Atual: ${p.hp}/${p.maxHp}\n`;
        curarMsg += `│ 💰 Moedas Restantes: ${p.moedas}\n`;
        curarMsg += `│\n`;
        curarMsg += `│ 🤖 *LOGÍSTICA ACKERMAN* ⚔️\n`;
        curarMsg += `╰━━━━━━━━━━━━━━━━━━━━╯`;

        await sock.sendMessage(from, { react: { text: '💉', key: msg.key }});
        return reply(curarMsg);
    }
};
