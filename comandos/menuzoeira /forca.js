/**
 * Comando: forca & delforca 😵
 * Função: Jogo da forca com sistema de reset.
 * Créditos: Benny ⚔️
 */

const fs = require('fs');
const listaForca = require('../../database/palavras'); 
const { adicionarPontos } = require('../../dono/pontos');

module.exports = {
    name: 'forca',
    category: 'membros',
    description: 'Inicia ou responde ao jogo de forca.',
    alias: ['f', 'jogarforca', 'delforca', 'resetforca'], // Adicionado os aliases de deletar
    async execute(sock, msg, args, { from, isGroup, reply, prefixo, sender, command }) {
        
        const dbZoeiraPath = './database/modozoeira.json';
        const dbZoeira = fs.existsSync(dbZoeiraPath) ? JSON.parse(fs.readFileSync(dbZoeiraPath)) : {};

        if (!dbZoeira[from]) {
            await sock.sendMessage(from, { react: { text: '🛡️', key: msg.key }});
            return reply("⚠️ *MODO ZOEIRA NÃO ESTÁ ATIVADO!*");
        }

        if (!isGroup) return reply("❌ Apenas em grupos.");

        // --- 🗑️ LÓGICA PARA DELETAR O JOGO ---
        if (command === 'delforca' || command === 'resetforca') {
            if (!global.forca || !global.forca[from]) {
                return reply("❌ Não há nenhuma partida de forca em andamento neste grupo.");
            }
            delete global.forca[from];
            await sock.sendMessage(from, { react: { text: '🗑️', key: msg.key }});
            return reply("✅ *JOGO DA FORCA ENCERRADO!* \nA partida foi resetada com sucesso. Use o comando de novo para começar uma nova.");
        }

        // --- 🎮 LÓGICA DE JOGAR ---
        if (global.forca && global.forca[from]) {
            if (args.length === 0) return global.atualizarForca(sock, from, prefixo);

            const tentativa = args.join(' ').toUpperCase().trim();
            const jogo = global.forca[from];

            // 1. TENTATIVA DE PALAVRA COMPLETA (MORTE SÚBITA)
            if (tentativa.length > 1) {
                if (tentativa === jogo.palavra) {
                    jogo.painel = jogo.palavra;
                    adicionarPontos(sender, 'forca', 10); // ADICIONA 10 PONTOS
                    await sock.sendMessage(from, { react: { text: '🏆', key: msg.key }});
                    reply(`🏆 *VITÓRIA TOTAL!* Acertou a palavra: *${jogo.palavra}*\n\n🎁 Você ganhou 10 pontos!\n\n_Use ${prefixo}forca para uma nova partida!_ ⚔️`);
                    delete global.forca[from];
                    return;
                } else {
                    const correta = jogo.palavra;
                    const usuario = sender.split('@')[0];
                    delete global.forca[from];
                    await sock.sendMessage(from, { react: { text: '💀', key: msg.key }});
                    return sock.sendMessage(from, { 
                        text: `💀 Você errou a palavra @${usuario}. A palavra era: *${correta}*\n\nUse o comando de novo para recomeçar uma nova partida.`,
                        mentions: [sender]
                    });
                }
            }

            // 2. TENTATIVA DE LETRA ÚNICA
            if (jogo.tentativas.includes(tentativa)) return reply(`⚠️ *${tentativa}* já foi tentada!`);
            
            jogo.tentativas.push(tentativa);

            if (jogo.palavra.includes(tentativa)) {
                let novoPainel = "";
                for (let i = 0; i < jogo.palavra.length; i++) {
                    novoPainel += jogo.tentativas.includes(jogo.palavra[i]) ? jogo.palavra[i] : "_";
                }
                jogo.painel = novoPainel;

                if (jogo.painel === jogo.palavra) {
                    adicionarPontos(sender, 'forca', 10); // ADICIONA 10 PONTOS
                    await sock.sendMessage(from, { react: { text: '🏆', key: msg.key }});
                    reply(`🏆 *VITÓRIA!* Palavra: *${jogo.palavra}*\n\n🎁 Você ganhou 10 pontos!`);
                    delete global.forca[from];
                    return;
                }
            } else {
                jogo.erros++;
                if (jogo.erros >= 6) {
                    const correta = jogo.palavra;
                    delete global.forca[from];
                    return reply(`💀 *GAME OVER!* Enforcado!\n📖 A palavra era: *${correta}*`);
                }
            }
            return global.atualizarForca(sock, from, prefixo);
        }

        // --- 🚀 INICIAR NOVO JOGO ---
        global.iniciarRodadaForca(sock, from, prefixo);
        await sock.sendMessage(from, { react: { text: '😵', key: msg.key }});
    }
};

// --- ⚙️ FUNÇÕES GLOBAIS ---

global.iniciarRodadaForca = (sock, from, prefixo) => {
    if (!global.forca) global.forca = {};
    let sorteio;
    do {
        sorteio = listaForca[Math.floor(Math.random() * listaForca.length)];
    } while (global.ultimaForca === sorteio.p);
    
    global.ultimaForca = sorteio.p;

    global.forca[from] = {
        palavra: sorteio.p.toUpperCase(),
        dica: sorteio.d,
        tentativas: [],
        erros: 0,
        painel: sorteio.p.replace(/[A-Z]/g, "_")
    };
    global.atualizarForca(sock, from, prefixo);
};

global.atualizarForca = async (sock, from, prefixo) => {
    const jogo = global.forca[from];
    if (!jogo) return;

    const boneco = [
        "  +---+\n  |   |\n      |\n      |\n      |\n      |\n=========",
        "  +---+\n  |   |\n  O   |\n      |\n      |\n      |\n=========",
        "  +---+\n  |   |\n  O   |\n  |   |\n      |\n      |\n=========",
        "  +---+\n  |   |\n  O   |\n /|   |\n      |\n      |\n=========",
        "  +---+\n  |   |\n  O   |\n /|\\  |\n      |\n      |\n=========",
        "  +---+\n  |   |\n  O   |\n /|\\  |\n /    |\n      |\n=========",
        "  +---+\n  |   |\n  O   |\n /|\\  |\n / \\  |\n      |\n========="
    ];

    let msgForca = `😵 *JOGO DA FORCA ACKERMAN* 😵\n\n`;
    msgForca += `\`\`\`${boneco[jogo.erros]}\`\`\`\n\n`;
    msgForca += `📝 Dica: _${jogo.dica}_\n`;
    msgForca += `📖 Palavra: *${jogo.painel.split('').join(' ')}*\n`;
    msgForca += `🚫 Erros: ${jogo.erros}/6\n`;
    msgForca += `🔤 Tentativas: [ ${jogo.tentativas.join(', ')} ]\n\n`;
    msgForca += `🎮 *COMO JOGAR:* \nUse *${prefixo}f [letra]*\nUse *${prefixo}f [palavra]* ⚔️\nUse *${prefixo}delforca* para resetar.`;

    return sock.sendMessage(from, { text: msgForca });
};
