/**
 * Comando: Caçar RPG 🏹
 * Descrição: Enfrente monstros e Titãs para ganhar grandes recompensas.
 * Créditos: Benny ⚔️
 */

const fs = require('fs');

module.exports = {
    name: 'cacar',
    category: 'menurpg',
    description: 'Enfrente perigos fora das muralhas.',
    alias: ['matar', 'caçar', 'combate'],
    async execute(sock, msg, args, { from, reply, sender }) {
        
        const dbPath = './dono/rpg_players.json';
        if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({}));
        
        let players = JSON.parse(fs.readFileSync(dbPath));
        const userId = sender.split('@')[0];

        if (!players[userId]) return reply("❌ Soldado, você ainda não tem um perfil! Use */status* primeiro.");

        const p = players[userId];
        const agora = Date.now();
        const cooldown = 90000; // 1 minuto e meio (caçar cansa mais que coletar)

        if (p.hp <= 20) return reply("⚠️ *ESTADO CRÍTICO:* Você está muito ferido para lutar! Descanse ou cure-se.");

        if (agora - (p.ultimoCacar || 0) < cooldown) {
            const restante = Math.ceil((cooldown - (agora - p.ultimoCacar)) / 1000);
            return reply(`⏳ *RECUPERANDO LÂMINAS:* Você precisa de ${restante}s para a próxima caçada.`);
        }

        // --- LISTA DE MONSTROS (Inspirado em AOT) ---
        const monstros = [
            { nome: "Titã de 5 Metros", dano: 15, xp: 40, moedas: 60, chance: 0.5 },
            { nome: "Titã de 15 Metros", dano: 35, xp: 90, moedas: 150, chance: 0.3 },
            { nome: "Titã Excêntrico", dano: 50, xp: 200, moedas: 300, chance: 0.15 },
            { nome: "Titã Blindado (BOSS)", dano: 80, xp: 500, moedas: 1000, chance: 0.05 }
        ];

        // Sorteio do monstro baseado na chance
        const sorte = Math.random();
        let monstro = monstros[0];
        if (sorte < 0.05) monstro = monstros[3];
        else if (sorte < 0.20) monstro = monstros[2];
        else if (sorte < 0.50) monstro = monstros[1];

        // Lógica de Combate
        const vitoria = Math.random() > 0.3; // 70% de chance de vitória inicial
        p.ultimoCacar = agora;

        let resMsg = `╭━━━〔 🏹 *CAÇADA ACKERMAN* 〕━━━╮\n│\n`;
        resMsg += `│ 👹 *INIMIGO:* ${monstro.nome}\n`;

        if (vitoria) {
            p.xp += monstro.xp;
            p.moedas += monstro.moedas;
            p.vitorias = (p.vitorias || 0) + 1;
            
            resMsg += `│ ⚔️ *STATUS:* VITÓRIA ÉPICA!\n`;
            resMsg += `│ ✨ XP: +${monstro.xp}\n`;
            resMsg += `│ 💰 Moedas: +${monstro.moedas}\n`;
            
            // Chance de drop de material raro no combate
            if (Math.random() > 0.8) {
                p.inventario.aco += 2;
                resMsg += `│ ⚔️ *DROP:* +2x Aço Ultra-Duro\n`;
            }
        } else {
            p.hp -= monstro.dano;
            resMsg += `│ ❌ *STATUS:* DERROTA...\n`;
            resMsg += `│ 🩸 *DANO RECEBIDO:* -${monstro.dano} HP\n`;
            resMsg += `│ 🏥 *HP ATUAL:* ${p.hp}/${p.maxHp}\n`;
        }

        // Sistema de Level Up
        if (p.xp >= p.level * 150) {
            p.level += 1;
            p.maxHp += 25;
            p.hp = p.maxHp;
            resMsg += `│\n│ 🔥 *UP:* Subiu para o Nível ${p.level}!\n`;
        }

        fs.writeFileSync(dbPath, JSON.stringify(players, null, 2));
        resMsg += `│\n│ 🤖 *SISTEMA DE ELITE* ⚔️\n╰━━━━━━━━━━━━━━━━━━━━╯`;

        await sock.sendMessage(from, { react: { text: '⚔️', key: msg.key }});
        return reply(resMsg);
    }
};
