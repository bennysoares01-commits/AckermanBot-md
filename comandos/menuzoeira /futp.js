/**
 * Comando: Quiz de Futebol ⚽
 * Design: Estilo Estádio Ackerman ⚔️
 * Créditos: Benny ⚔️
 */

const fs = require('fs');
const path = require('path');
const perguntas = require('../../database/quiz_futebol');

module.exports = {
    name: 'futp',
    category: 'membros',
    description: 'Quiz sobre astros do futebol.',
    alias: ['futebolquiz', 'delfutp', 'del-futp'],
    async execute(sock, msg, args, { from, reply, sender, command, prefixo }) {
        
        const quizDir = './database/quiz_sessao';
        if (!fs.existsSync(quizDir)) {
            fs.mkdirSync(quizDir, { recursive: true });
        }
        const userFile = path.join(quizDir, `${sender.split('@')[0]}.json`);

        // --- Lógica para Encerrar Partida ---
        if (command === 'delfutp' || command === 'del-futp') {
            if (!fs.existsSync(userFile)) {
                return reply("❌ *ERRO:* Você não tem nenhuma partida em andamento.");
            }
            fs.unlinkSync(userFile);
            await sock.sendMessage(from, { react: { text: '⏹️', key: msg.key }});
            return reply("🏁 *PARTIDA ENCERRADA!*\n\nO jogo foi interrompido. Quando quiser voltar ao campo, use o comando novamente!");
        }

        // --- Iniciar Nova Rodada / Sorteio ---
        const sorteio = perguntas[Math.floor(Math.random() * perguntas.length)];
        const dadosSessao = {
            pergunta: sorteio.pergunta,
            opcoes: sorteio.opcoes,
            resposta: sorteio.resposta
        };

        fs.writeFileSync(userFile, JSON.stringify(dadosSessao, null, 2));

        // --- Design Estilizado ---
        let texto = `╭━━━〔 ⚽ *ARENA ACKERMAN* ⚽ 〕━━━╮\n`;
        texto += `┃\n`;
        texto += `┃ 🏆 *DESAFIO DOS ASTROS*\n`;
        texto += `┃\n`;
        texto += `┣━━━〔 📋 *PERGUNTA* 〕━━━\n`;
        texto += `┃\n`;
        texto += `┃ 🤔 _${sorteio.pergunta}_\n`;
        texto += `┃\n`;
        texto += `┣━━━〔 🔢 *OPÇÕES* 〕━━━\n`;
        texto += `┃\n`;
        
        const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];
        sorteio.opcoes.forEach((opt, i) => {
            texto += `┃ ${emojis[i]} ${opt}\n`;
        });

        texto += `┃\n`;
        texto += `┣━━━〔 ⚔️ *REGRAS* 〕━━━\n`;
        texto += `┃\n`;
        texto += `┃ ✅ Digite apenas o *número* da resposta.\n`;
        texto += `┃ 🚫 Errar encerra o seu jogo.\n`;
        texto += `┃ ⏹️ Pare com: *${prefixo}del-futp*\n`;
        texto += `┃\n`;
        texto += `╰━━━━━〔 🎖️ *ACKERMAN* 🎖️ 〕━━━━━╯`;

        await sock.sendMessage(from, { react: { text: '⚽', key: msg.key }});
        return reply(texto);
    }
};
