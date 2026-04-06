/**
 * Comando: Arena Ackerman Quiz ⛩️
 * Integrado: Quiz + Sistema de Resposta (.a) com Verificação Flexível
 * Créditos: Benny ⚔️
 */

const fs = require('fs');
const path = require('path');
const { adicionarPontos } = require('../../dono/pontos');

module.exports = {
    name: 'quemanime',
    category: 'membros',
    description: 'Adivinhe o personagem pelas dicas.',
    alias: ['qa', 'quem-e', 'del-qa', 'a'], 
    async execute(sock, msg, args, { from, reply, sender, command, prefixo, db, isAdmins, eDono, isVip, isOwner }) {
        
        const sessaoDir = './database/quiz_sessao';
        if (!fs.existsSync(sessaoDir)) fs.mkdirSync(sessaoDir, { recursive: true });
        const userFile = path.join(sessaoDir, `anime_${sender.split('@')[0]}.json`);

        // --- 🎯 LÓGICA 1: CANCELAR JOGO ---
        if (command === 'del-qa') {
            if (!fs.existsSync(userFile)) return reply("❌ Você não tem nenhum desafio ativo.");
            fs.unlinkSync(userFile);
            await sock.sendMessage(from, { react: { text: '⏹️', key: msg.key }});
            return reply("🏁 *DESAFIO CANCELADO!*");
        }

        // --- 🎯 LÓGICA 2: RESPONDER (.a) ---
        if (command === 'a') {
            if (!fs.existsSync(userFile)) return; 

            if (args.length === 0) return reply(`🏮 *ARENA ACKERMAN*\n\nDigite o nome do personagem.\nExemplo: *${prefixo}a Levi*`);

            const dadosQA = JSON.parse(fs.readFileSync(userFile));
            const chute = args.join(' ').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
            const respostaCerta = dadosQA.resposta.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

            // ✨ NOVA LÓGICA FLEXÍVEL:
            // Aceita se for EXATO ou se o chute for o primeiro nome (ou parte importante) da resposta
            const nomesDaResposta = respostaCerta.split(' ');
            const acertouParcial = nomesDaResposta.some(n => n === chute && n.length > 2);

            if (chute === respostaCerta || acertouParcial) {
                fs.unlinkSync(userFile);
                adicionarPontos(sender, 'anime', 10);
                await sock.sendMessage(from, { react: { text: '🏆', key: msg.key }});
                await reply(`✅ *ACERTOU, GUERREIRO!*\n\nO personagem era: *${dadosQA.nomeReal}*\n💰 Ganhou *10 pontos*! ⛩️\n\n_Iniciando próxima rodada..._ ⚔️`);
                
                setTimeout(async () => {
                    try { 
                        await this.execute(sock, msg, [], { from, reply, sender, command: 'quemanime', prefixo, db, isAdmins, eDono, isVip, isOwner }); 
                    } catch (e) {}
                }, 2000);
                return;
            } else {
                fs.unlinkSync(userFile);
                await sock.sendMessage(from, { react: { text: '❌', key: msg.key }});
                return reply(`❌ *ERROU!* O alvo escapou.\n\nO personagem era: *${dadosQA.nomeReal}*\nSua partida foi encerrada. ⛩️`);
            }
        }

        // --- 🎯 LÓGICA 3: INICIAR JOGO (quemanime / qa) ---
        let personagens;
        try {
            const dbPath = path.resolve('./database/quiz_anime.js');
            delete require.cache[require.resolve(dbPath)];
            personagens = require(dbPath);
        } catch (e) {
            return reply(`❌ *ERRO NA DATABASE:* Verifique o arquivo 'database/quiz_anime.js'.`);
        }

        const sorteio = personagens[Math.floor(Math.random() * personagens.length)];
        const dadosSessao = {
            resposta: sorteio.nome,
            nomeReal: sorteio.nome
        };

        fs.writeFileSync(userFile, JSON.stringify(dadosSessao, null, 2));

        let texto = `╭━━━〔 ⛩️ *ARENA ACKERMAN* ⛩️ 〕━━━╮\n`;
        texto += `┃\n`;
        texto += `┃ 🏮 *QUEM É O PERSONAGEM?*\n`;
        texto += `┃\n`;
        texto += `┣━━━〔 🕵️ *DICAS* 〕━━━\n`;
        texto += `┃\n`;
        texto += `┃ 🔴 *Nível:* ${sorteio.dificuldade}\n`;
        texto += `┃ ⚔️ 1. ${sorteio.dicas[0]}\n`;
        texto += `┃ ⚔️ 2. ${sorteio.dicas[1]}\n`;
        texto += `┃ ⚔️ 3. ${sorteio.dicas[2]}\n`;
        texto += `┃\n`;
        texto += `┣━━━〔 ⚔️ *REGRAS* 〕━━━\n`;
        texto += `┃\n`;
        texto += `┃ ✅ Responda com: *${prefixo}a [nome]*\n`;
        texto += `┃ 🚫 Erros encerram o jogo.\n`;
        texto += `┃ ⏹️ Pare com: *${prefixo}del-qa*\n`;
        texto += `┃\n`;
        texto += `╰━━━━━〔 🎖️ *ACKERMAN* 🎖️ 〕━━━━━╯`;

        await sock.sendMessage(from, { react: { text: '🕵️', key: msg.key }});
        return reply(texto);
    }
};
