/**
 * Comando: Coletar RPG 🪵 (Versão Luxo)
 * Descrição: Sistema de coleta avançado com materiais e eventos.
 * Créditos: Benny ⚔️
 */

const fs = require('fs');

module.exports = {
    name: 'coletar',
    category: 'menurpg',
    description: 'Explore as muralhas para coletar recursos, moedas e materiais.',
    alias: ['explorar', 'trabalhar', 'farmar'],
    async execute(sock, msg, args, { from, reply, sender }) {
        
        const dbPath = './dono/rpg_players.json';
        if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({}));
        
        let players = JSON.parse(fs.readFileSync(dbPath));
        const userId = sender.split('@')[0];

        // Inicialização completa para novos jogadores
        if (!players[userId]) {
            players[userId] = { 
                nome: "Soldado", level: 1, xp: 0, hp: 100, maxHp: 100, moedas: 100,
                inventario: { madeira: 0, ferro: 0, couro: 0, gas: 0, aco: 0 },
                ultimoColetar: 0 
            };
        }

        const p = players[userId];
        const agora = Date.now();
        const cooldown = 45000; // 45 segundos para ser mais dinâmico

        if (agora - (p.ultimoColetar || 0) < cooldown) {
            const restante = Math.ceil((cooldown - (agora - p.ultimoColetar)) / 1000);
            return reply(`⏳ *AGUARDE, RECRUTA!* Você está recuperando o fôlego. Volte em ${restante}s.`);
        }

        // --- SISTEMA DE RECOMPENSAS VARIADAS ---
        const moedasGanha = Math.floor(Math.random() * 50) + 20;
        const xpGanha = Math.floor(Math.random() * 30) + 10;
        
        // Sorteio de Materiais (Chance de vir cada um)
        const materiaisEncontrados = [];
        if (Math.random() > 0.3) { p.inventario.madeira += 5; materiaisEncontrados.push("🪵 5x Madeira"); }
        if (Math.random() > 0.5) { p.inventario.ferro += 3; materiaisEncontrados.push("⛓️ 3x Ferro"); }
        if (Math.random() > 0.7) { p.inventario.couro += 2; materiaisEncontrados.push("👞 2x Couro"); }
        if (Math.random() > 0.85) { p.inventario.gas += 1; materiaisEncontrados.push("💨 1x Cilindro de Gás"); }
        if (Math.random() > 0.95) { p.inventario.aco += 1; materiaisEncontrados.push("⚔️ 1x Aço Ultra-Duro"); }

        // --- EVENTOS ALEATÓRIOS ---
        let eventoTexto = "";
        const sorteEvento = Math.random();
        if (sorteEvento > 0.9) {
            const bonusBau = 150;
            p.moedas += bonusBau;
            eventoTexto = `\n🎁 *BAÚ ENCONTRADO:* Você achou um suprimento perdido e ganhou +${bonusBau} moedas!`;
        } else if (sorteEvento < 0.1) {
            const danoEspinho = 10;
            p.hp -= danoEspinho;
            eventoTexto = `\n⚠️ *EMBOSCADA:* Você caiu em uma armadilha e perdeu ${danoEspinho} de HP!`;
        }

        // Salva os dados
        p.moedas += moedasGanha;
        p.xp += xpGanha;
        p.ultimoColetar = agora;

        // Lógica de Level UP
        let lvlMsg = "";
        if (p.xp >= p.level * 150) {
            p.level += 1;
            p.maxHp += 25;
            p.hp = p.maxHp;
            lvlMsg = `\n\n⭐ *PROMOÇÃO DE PATENTE!* Você agora é Nível ${p.level}!`;
        }

        fs.writeFileSync(dbPath, JSON.stringify(players, null, 2));

        // Layout da Mensagem
        let resMsg = `╭━━━〔 ⚔️ *EXPEDIÇÃO ACKERMAN* 〕━━━╮\n`;
        resMsg += `│\n`;
        resMsg += `│ 🧭 *RESULTADO DA BUSCA:* \n`;
        resMsg += `│ 💰 Moedas: +${moedasGanha}\n`;
        resMsg += `│ ✨ Experiência: +${xpGanha}\n`;
        
        if (materiaisEncontrados.length > 0) {
            resMsg += `│\n`;
            resMsg += `│ 📦 *MATERIAIS COLETADOS:* \n`;
            materiaisEncontrados.forEach(m => { resMsg += `│ ${m}\n`; });
        }

        if (eventoTexto) resMsg += `│ ${eventoTexto}\n`;
        if (lvlMsg) resMsg += `│ ${lvlMsg}\n`;
        
        resMsg += `│\n`;
        resMsg += `│ 👤 *TOTAL MOEDAS:* ${p.moedas}\n`;
        resMsg += `│ 🤖 *ACKERMAN RPG SYSTEM* ⚔️\n`;
        resMsg += `╰━━━━━━━━━━━━━━━━━━━━╯`;

        await sock.sendMessage(from, { react: { text: '🎒', key: msg.key }});
        return reply(resMsg);
    }
};
