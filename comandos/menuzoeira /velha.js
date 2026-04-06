/**
 * Comando: jogo da velha ❌⭕
 * Função: Desafiar um membro e aguardar confirmação com alerta de turnos.
 * Pasta: menuzoeira
 * Créditos: Benny ⚔️
 */

const fs = require('fs');
const { adicionarPontos } = require('../../dono/pontos');

module.exports = {
    name: 'velha',
    category: 'menuzoeira',
    description: 'Desafia alguém para o jogo da velha.',
    alias: ['ttt', 'jogodavelha'],
    async execute(sock, msg, args, { from, isGroup, reply, sender, eDono }) {
        if (!isGroup) return reply("❌ Apenas em grupos.");

        // --- 🛡️ TRAVA DE SEGURANÇA: MODO ZOEIRA ---
        const dbZoeiraPath = './database/modozoeira.json';
        const dbZoeira = fs.existsSync(dbZoeiraPath) ? JSON.parse(fs.readFileSync(dbZoeiraPath)) : {};

        if (!dbZoeira[from]) {
            await sock.sendMessage(from, { react: { text: '🛡️', key: msg.key }});
            return reply("⚠️ *MODO ZOEIRA NÃO ESTÁ ATIVADO!* \n\nPeça para algum administrador ativar com: *modozoeira on*");
        }

        const msgTexto = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";
        const pura = msgTexto.toLowerCase().trim();

        // --- ✅ LÓGICA DE ACEITAR/RECUSAR ---
        if (global.velha && global.velha[from] && global.velha[from].status === "ESPERANDO") {
            const jogo = global.velha[from];
            
            if (sender !== jogo.p2) return; 

            if (pura === 'sim') {
                jogo.status = "JOGANDO";
                await sock.sendMessage(from, { react: { text: '⚔️', key: msg.key }});
                
                let textoAceite = `🎖️ *COMBATE INICIADO!* 🎖️\n\n`;
                textoAceite += `❌ @${jogo.p1.split('@')[0]}\n`;
                textoAceite += `⭕ @${jogo.p2.split('@')[0]}\n\n`;
                textoAceite += `📢 *AVISO:* O desafiante @${jogo.p1.split('@')[0]} começa jogando!\n`;
                textoAceite += `━━━━━━━━━━━━━━━\n\n`;
                textoAceite += global.renderizarTabuleiro(from);
                textoAceite += `\n\n👉 *TURNO ATUAL:* @${jogo.turno.split('@')[0]} (❌)`;
                
                return reply(textoAceite, { mentions: [jogo.p1, jogo.p2] });
            }

            if (pura === 'não' || pura === 'nao') {
                delete global.velha[from];
                await sock.sendMessage(from, { react: { text: '🏳️', key: msg.key }});
                return reply(`🏳️ @${sender.split('@')[0]} recusou o desafio. A paz continua... por enquanto.`, { mentions: [sender] });
            }
        }

        // --- 🎮 LÓGICA DE JOGADA ---
        if (global.velha && global.velha[from] && global.velha[from].status === "JOGANDO" && args[0] >= 1 && args[0] <= 9) {
            const jogo = global.velha[from];
            const casa = parseInt(args[0]) - 1;

            if (sender !== jogo.turno) {
                return reply(`⏳ Calma! Ainda é a vez de @${jogo.turno.split('@')[0]}.`, { mentions: [jogo.turno] });
            }

            if (typeof jogo.tabuleiro[casa] !== 'number') {
                return reply("⚠️ Essa casa já está ocupada! Escolha outra.");
            }

            const simbolo = jogo.simbolo[sender];
            jogo.tabuleiro[casa] = simbolo;
            jogo.turno = (sender === jogo.p1) ? jogo.p2 : jogo.p1;

            // Verificação de Vitória
            const vitoria = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
            let ganhou = vitoria.some(pos => jogo.tabuleiro[pos[0]] === simbolo && jogo.tabuleiro[pos[1]] === simbolo && jogo.tabuleiro[pos[2]] === simbolo);

            if (ganhou) {
                const tabFinal = global.renderizarTabuleiro(from);
                adicionarPontos(sender, 'velha', 15); // ADICIONA 15 PONTOS AO VENCEDOR
                delete global.velha[from];
                await sock.sendMessage(from, { react: { text: '🏆', key: msg.key }});
                return reply(`🏆 *VITÓRIA MILITAR!*\n\nO soldado @${sender.split('@')[0]} dominou o campo e ganhou 15 pontos!\n\n${tabFinal}`, { mentions: [sender] });
            }

            if (jogo.tabuleiro.every(c => typeof c !== 'number')) {
                const tabFinal = global.renderizarTabuleiro(from);
                delete global.velha[from];
                return reply(`🤝 *EMPATE!* O campo de batalha ficou em ruínas.\n\n${tabFinal}`);
            }

            let proximoSimbolo = (jogo.turno === jogo.p1) ? "❌" : "⭕";
            return reply(`⚔️ *JOGADA REALIZADA!*\n\n${global.renderizarTabuleiro(from)}\n\n👉 *VEZ DE:* @${jogo.turno.split('@')[0]} (${proximoSimbolo})`, { mentions: [jogo.turno] });
        }

        // --- ⚔️ INICIAR NOVO DESAFIO ---
        const mencionado = msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        if (!mencionado) return reply("⚠️ Marque o oponente! Ex: *.velha @usuario*");
        if (mencionado === sender) return reply("⚔️ Você não pode lutar contra si mesmo!");
        if (global.velha?.[from]) return reply("⚠️ Já existe uma batalha em curso!");

        if (!global.velha) global.velha = {};
        global.velha[from] = {
            status: "ESPERANDO",
            p1: sender,
            p2: mencionado,
            tabuleiro: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            turno: sender,
            simbolo: { [sender]: "❌", [mencionado]: "⭕" }
        };

        let convite = `╭━━━〔 ⚔️ *DESAFIO ACKERMAN* ⚔️ 〕━━━╮\n┃\n`;
        convite += `┃ 👤 *DESAFIANTE:* @${sender.split('@')[0]}\n`;
        convite += `┃ 🎯 *OPONENTE:* @${mencionado.split('@')[0]}\n`;
        convite += `┃\n`;
        convite += `┃  _Soldado, você foi convocado para uma_\n`;
        convite += `┃  _batalha de Jogo da Velha!_\n`;
        convite += `┃\n`;
        convite += `┃  👉 Digite *[ Sim ]* para aceitar\n`;
        convite += `┃  👉 Digite *[ Não ]* para recusar\n`;
        convite += `┃\n`;
        convite += `╰━━━━━〔 🎖️ *ACKERMAN* 🎖️ 〕━━━━━╯`;

        return reply(convite, { mentions: [sender, mencionado] });
    }
};

global.renderizarTabuleiro = (from) => {
    const jogo = global.velha[from];
    if (!jogo) return "";
    const t = jogo.tabuleiro.map(casa => {
        const emojis = ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];
        return (casa === "❌" || casa === "⭕") ? casa : emojis[casa];
    });
    return `      ${t[0]} | ${t[1]} | ${t[2]}\n      ----------\n      ${t[3]} | ${t[4]} | ${t[5]}\n      ----------\n      ${t[6]} | ${t[7]} | ${t[8]}`;
};
