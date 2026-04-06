/**
 * ACKERMAN-BOT ⚔️
 * Comando: Pedra, Papel e Tesoura ✊✋✌️
 * Créditos: Benny ⚔️
 */

const fs = require('fs');

module.exports = {
    name: 'ppt',
    category: 'diversao',
    description: 'Joga Pedra, Papel ou Tesoura contra o bot.',
    alias: ['jokenpo', 'jogar'],
    async execute(sock, msg, args, { from, sender, reply, prefixo, isGroup }) {
        
        // --- 🛡️ TRAVA MODO ZOEIRA ---
        if (isGroup) {
            const zoeiraPath = './database/modozoeira.json';
            const dbZoeira = fs.existsSync(zoeiraPath) ? JSON.parse(fs.readFileSync(zoeiraPath)) : {};
            if (!dbZoeira[from]) return reply("⚠️ O MODO ZOEIRA ESTÁ DESATIVADO NESTE GRUPO!");
        }

        // Escolhas possíveis
        const escolhasValidas = ['pedra', 'papel', 'tesoura'];
        const escolhaUsuario = args[0]?.toLowerCase();

        if (!args[0] || !escolhasValidas.includes(escolhaUsuario)) {
            return reply(`❓ Você precisa escolher uma opção válida.\n\nExemplo: *${prefixo}ppt pedra*, *${prefixo}ppt papel* ou *${prefixo}ppt tesoura*`);
        }

        // Reação de processamento
        await sock.sendMessage(from, { react: { text: '🎮', key: msg.key }});

        // Escolha do Bot
        const escolhaBot = escolhasValidas[Math.floor(Math.random() * escolhasValidas.length)];

        const emojis = {
            pedra: '✊ Pedra',
            papel: '✋ Papel',
            tesoura: '✌️ Tesoura'
        };

        let resultado = "";
        let emojiFinal = "";

        // Lógica de verificação
        if (escolhaUsuario === escolhaBot) {
            resultado = "🤝 *EMPATE!* Nós escolhemos a mesma opção.";
            emojiFinal = '🤝';
        } else if (
            (escolhaUsuario === 'pedra' && escolhaBot === 'tesoura') ||
            (escolhaUsuario === 'papel' && escolhaBot === 'pedra') ||
            (escolhaUsuario === 'tesoura' && escolhaBot === 'papel')
        ) {
            resultado = "🏆 *VOCÊ VENCEU!* Parabéns, você ganhou esta rodada.";
            emojiFinal = '🎉';
        } else {
            resultado = "❌ *VOCÊ PERDEU!* Eu ganhei desta vez.";
            emojiFinal = '🤖';
        }

        let textoFinal = `╭━━━〔 🎮 *JOGO: PPT* 〕━━━╮\n┃\n`;
        textoFinal += `┃ 👤 *SUA ESCOLHA:* ${emojis[escolhaUsuario]}\n`;
        textoFinal += `┃ 🤖 *MINHA ESCOLHA:* ${emojis[escolhaBot]}\n┃\n`;
        textoFinal += `┃ 📢 *RESULTADO:* ${resultado}\n┃\n`;
        textoFinal += `┃ 🎖️ *ACKERMAN-BOT* ⚔️\n`;
        textoFinal += `╰━━━━━〔 ${emojiFinal} 〕━━━━━╯`;

        await sock.sendMessage(from, { text: textoFinal }, { quoted: msg });
        await sock.sendMessage(from, { react: { text: emojiFinal, key: msg.key }});
    }
};
