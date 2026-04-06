/**
 * Comando: Loja RPG 🏪
 * Descrição: Compra de itens e materiais raros.
 * Créditos: Benny ⚔️
 */

const fs = require('fs');

module.exports = {
    name: 'loja',
    category: 'menurpg',
    description: 'Compre recursos e itens especiais.',
    alias: ['shop', 'mercado'],
    async execute(sock, msg, args, { from, reply, sender, prefixo }) {
        
        const dbPath = './dono/rpg_players.json';
        let players = JSON.parse(fs.readFileSync(dbPath));
        const userId = sender.split('@')[0];
        const p = players[userId];

        if (!p) return reply("❌ Use */status* para entrar no jogo.");

        // Se não houver argumentos, mostra o menu da loja
        if (!args.length) {
            let lojaMenu = `╭━━━〔 🏪 *LOJA DA MURALHA* 〕━━━╮\n`;
            lojaMenu += `│\n`;
            lojaMenu += `│ 💰 *SUAS MOEDAS:* ${p.moedas}\n`;
            lojaMenu += `│\n`;
            lojaMenu += `│ 🛒 *ITENS À VENDA:* \n`;
            lojaMenu += `│\n`;
            lojaMenu += `│ 1️⃣ *GÁS (Cilindro)* - 200 moedas\n`;
            lojaMenu += `│ 2️⃣ *AÇO (Ultra-Duro)* - 400 moedas\n`;
            lojaMenu += `│ 3️⃣ *COURO (Firme)* - 150 moedas\n`;
            lojaMenu += `│ 4️⃣ *DOBRO DE XP (1 carga)* - 800 moedas\n`;
            lojaMenu += `│\n`;
            lojaMenu += `│ 📝 *COMO COMPRAR:* \n`;
            lojaMenu += `│ Use: *${prefixo}loja [número]*\n`;
            lojaMenu += `│ _Ex: ${prefixo}loja 1_\n`;
            lojaMenu += `│\n`;
            lojaMenu += `╰━━━━━━━━━━━━━━━━━━━━╯`;
            return reply(lojaMenu);
        }

        const itemEscohido = args[0];
        let sucesso = false;
        let itemNome = "";

        if (itemEscohido === '1') {
            if (p.moedas >= 200) { p.moedas -= 200; p.inventario.gas += 1; itemNome = "Cilindro de Gás"; sucesso = true; }
        } else if (itemEscohido === '2') {
            if (p.moedas >= 400) { p.moedas -= 400; p.inventario.aco += 1; itemNome = "Aço Ultra-Duro"; sucesso = true; }
        } else if (itemEscohido === '3') {
            if (p.moedas >= 150) { p.moedas -= 150; p.inventario.couro += 1; itemNome = "Couro"; sucesso = true; }
        } else if (itemEscohido === '4') {
             // Exemplo de item de XP (o jogador ganha logo o XP)
            if (p.moedas >= 800) { p.moedas -= 800; p.xp += 300; itemNome = "Bônus de 300 XP"; sucesso = true; }
        } else {
            return reply("❌ Opção inválida!");
        }

        if (sucesso) {
            fs.writeFileSync(dbPath, JSON.stringify(players, null, 2));
            await sock.sendMessage(from, { react: { text: '🛍️', key: msg.key }});
            return reply(`✅ *COMPRA REALIZADA!*\n\n📦 Item: ${itemNome}\n💰 Moedas restantes: ${p.moedas}`);
        } else {
            return reply("❌ Você não tem moedas suficientes para este item.");
        }
    }
};
