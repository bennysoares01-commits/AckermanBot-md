/**
 * Comando: Status RPG 🛡️ (Versão Blindada)
 * Descrição: Exibe os status de combate sem erros de 'undefined'.
 * Créditos: Benny ⚔️
 */

const fs = require('fs');

module.exports = {
    name: 'status',
    category: 'menurpg',
    description: 'Mostra seus atributos de combate no RPG.',
    alias: ['st', 'meusstatus', 'stats'],
    async execute(sock, msg, args, { from, reply, sender, pushName }) {
        
        const dbPath = './dono/rpg_players.json';
        
        if (!fs.existsSync(dbPath)) {
            fs.writeFileSync(dbPath, JSON.stringify({}, null, 2));
        }
        
        let players = JSON.parse(fs.readFileSync(dbPath));
        const userId = sender.split('@')[0];

        // Se o player for novo, cria do zero
        if (!players[userId]) {
            players[userId] = {
                nome: pushName || 'Soldado',
                level: 1,
                xp: 0,
                hp: 100,
                maxHp: 100,
                mana: 50,
                classe: "Recruta",
                moedas: 100,
                vitorias: 0
            };
            fs.writeFileSync(dbPath, JSON.stringify(players, null, 2));
        }

        const p = players[userId];

        // 🛡️ TRAVA ANTI-UNDEFINED (Se não existir no JSON, ele define agora)
        const nome = p.nome || pushName || 'Soldado';
        const patente = p.classe || "Recruta";
        const nivel = p.level || 1;
        const hpAtual = p.hp || 100;
        const hpMax = p.maxHp || 100;
        const energia = p.mana || 50;
        const experiencia = p.xp || 0;
        const grana = p.moedas || 0;
        const wins = p.vitorias || 0;

        // Layout limpo e corrigido
        let statusMsg = `╭━━━〔 ⚔️ *STATUS ACKERMAN* 〕━━━╮\n`;
        statusMsg += `│\n`;
        statusMsg += `│ 👤 *NOME:* ${nome}\n`;
        statusMsg += `│ 🎖️ *PATENTE:* ${patente}\n`;
        statusMsg += `│ 🛡️ *NÍVEL:* ${nivel}\n`;
        statusMsg += `│\n`;
        statusMsg += `│ ❤️ *VITALIDADE:* ${hpAtual}/${hpMax}\n`;
        statusMsg += `│ 🌀 *ENERGIA:* ${energia}\n`;
        statusMsg += `│ ✨ *EXPERIÊNCIA:* ${experiencia}\n`;
        statusMsg += `│ 💰 *MOEDAS:* ${grana}\n`;
        statusMsg += `│ 🏆 *VITÓRIAS:* ${wins}\n`;
        statusMsg += `│\n`;
        statusMsg += `│ 🤖 *SISTEMA DE ELITE* ⚔️\n`;
        statusMsg += `╰━━━━━━━━━━━━━━━━━━━━╯`;

        await sock.sendMessage(from, { react: { text: '📊', key: msg.key }});
        return reply(statusMsg);
    }
};
