const fs = require('fs');

module.exports = {
    name: 'lindo',
    category: 'menuzoeira',
    description: 'Mede o nível de beleza de alguém.',
    alias: ['beleza'],
    async execute(sock, msg, args, { from, reply }) {
        
        // --- 🛡️ TRAVA DE SEGURANÇA: MODO ZOEIRA ---
        const dbZoeiraPath = './database/modozoeira.json';
        const dbZoeira = fs.existsSync(dbZoeiraPath) ? JSON.parse(fs.readFileSync(dbZoeiraPath)) : {};

        if (!dbZoeira[from]) {
            await sock.sendMessage(from, { react: { text: '🛡️', key: msg.key }});
            return reply("⚠️ *MODO ZOEIRA NÃO ESTÁ ATIVADO!* \n\nPeça para algum administrador ativar.\nPara ativar é só usar: *modozoeira on*");
        }
        // ------------------------------------------

        const mencao = msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || 
                       msg.message.extendedTextMessage?.contextInfo?.participant || msg.key.participant || msg.key.remoteJid;

        await reply("🔍 Aguarde, analisando seu nível de beleza...");

        // Delay de 2 segundos para dar suspense
        setTimeout(async () => {
            const porcentagem = Math.floor(Math.random() * 101);
            const foto = "./media/lindo.jpg";
            
            let frases = [];
            
            // --- BANCO DE DADOS DE FRASES (SISTEMA DE SORTEIO POR FAIXA) ---
            if (porcentagem < 20) {
                frases = [
                    "Diz a lenda que a beleza é interior... bem no fundo mesmo. 💀",
                    "Olha, o importante é que você é uma pessoa legal. 😶",
                    "Deus te fez com pressa e esqueceu os detalhes. 🛠️",
                    "Sua beleza é igual feriado: acaba rápido demais. 📉",
                    "Se beleza fosse crime, você seria a pessoa mais inocente do mundo. ⚖️",
                    "A mãe diz que é lindo, mas mãe sempre mente. 🤱",
                    "Você não é feio, só nasceu no planeta errado. 👽",
                    "Seu nível de beleza é rastro de titã puro: assustador. 😵‍💫",
                    "O espelho pediu demissão depois dessa análise. 🪞",
                    "Beleza exótica... bem exótica mesmo. 🗿"
                ];
            } else if (porcentagem < 45) {
                frases = [
                    "O importante é ter saúde e um bom coração. 🛠️🥴",
                    "Com um banho de loja e 3 meses de academia, talvez melhore. 🏋️",
                    "Arrumadinho(a)... mas não abusa da sorte. 🤏",
                    "É o famoso 'bonitinho(a) mas ordinário(a)'. 🐍",
                    "A beleza tá aí, só tá escondida atrás do cansaço. 😴",
                    "Dá pro gasto, mas no escuro ajuda mais. 🕯️",
                    "Parece um boleto: a gente olha e já fica triste. 💸",
                    "Se beleza fosse nota, você estaria de recuperação. 📝",
                    "Beleza de soldado raso: muita vontade, pouca estética. ⚔️",
                    "Na luz da lua você parece um anjo, na do sol parece um erro. ☀️"
                ];
            } else if (porcentagem < 75) {
                frases = [
                    "Na média! Com um filtro e uma boa luz, engana bem. 😶‍徵",
                    "Bonitinho(a)! Já dá pra apresentar pra família. 💍",
                    "Passa despercebido na multidão, o que é ótimo pra espião. 🕵️",
                    "Tem seu charme, só falta descobrir onde ele tá. 🤔",
                    "Visual aprovado pela Tropa de Exploração! 🐎",
                    "Se bater um ângulo bom, a foto do perfil fica top. 📸",
                    "Beleza estável, não causa susto nem paixão súbita. ✅",
                    "Você é tipo um café: nem todo mundo gosta, mas é necessário. ☕",
                    "Status: Pegável em dias de carência. 🔥",
                    "Aprovado! Mas não se ache muito pra não estragar. 🛡️"
                ];
            } else if (porcentagem < 95) {
                frases = [
                    "Olha só! Já dá para ser modelo de comercial de shampoo. 🧴✨",
                    "Cuidado pra não quebrar os corações por onde passa! 💔",
                    "Beleza de alto nível! Os Titãs até param pra olhar. 🤩",
                    "O brilho dessa beleza tá ofuscando o meu sensor! 🌟",
                    "Nível Capitão(ã)! Estética impecável. 🎖️",
                    "Você não caminha, você desfila. 👠",
                    "Quase uma obra de arte do Louvre. 🎨",
                    "Beleza digna de um protagonista de anime. ⛩️",
                    "Seu sorriso deveria ser patrimônio histórico. 🏛️",
                    "Se beleza desse dinheiro, você estaria no topo da Forbes. 💰"
                ];
            } else {
                frases = [
                    "Nível Ackerman! A beleza aqui transborda, que soldado absurdo! ✨⚔️",
                    "PERFEIÇÃO TOTAL! 100% de beleza detectada! 💎👑",
                    "Você é a oitava maravilha do mundo e eu posso provar. 🗺️",
                    "Sua beleza é o motivo da guerra em Marley. 🛡️",
                    "Nem o Levi teria coragem de te dar um chute com esse rosto. ⚔️",
                    "Beleza divina! Acho que encontrei um Deus(a). 🛐",
                    "Parem tudo! A realeza acabou de chegar no grupo. 👑",
                    "Sua beleza é mais rara que um Titã Fêmea. 💎",
                    "Simplesmente impecável. Não há erros nessa estrutura. 📉❌",
                    "O medidor quebrou tentando processar tanta perfeição! 💥"
                ];
            }

            // Seleciona uma frase aleatória dentro da faixa sorteada
            const comentario = frases[Math.floor(Math.random() * frases.length)];

            let texto = `╭━━━〔 ✨ *MEDIDOR DE BELEZA* ✨ 〕━━━╮\n┃\n`;
            texto += `┃  👤 *ALVO:* @${mencao.split('@')[0]}\n`;
            texto += `┃  📊 *NÍVEL:* ${porcentagem}%\n`;
            texto += `┃\n`;
            texto += `┃  📜 *VEREDITO:* ${comentario}\n`;
            texto += `┃\n`;
            texto += `╰━━━━〔 🎖️ *ACKERMAN* 🎖️ 〕━━━━╯`;

            if (fs.existsSync(foto)) {
                await sock.sendMessage(from, { image: fs.readFileSync(foto), caption: texto, mentions: [mencao] }, { quoted: msg });
            } else {
                return sock.sendMessage(from, { text: texto, mentions: [mencao] }, { quoted: msg });
            }
        }, 2000);
    }
};
