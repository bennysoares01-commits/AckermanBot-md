/**
 * Comando: adivinha 🖼️
 * Estilo: Quiz com Revelação (Blur -> Original)
 * Créditos: Benny ⚔️
 */

const fs = require('fs');
const path = require('path');

// Armazena o quiz ativo por grupo
let quizAtivo = {}; 

module.exports = {
    name: 'adivinha',
    category: 'membros',
    description: 'Adivinhe o personagem e veja a imagem original!',
    alias: ['quem-e', 'quizfoto'],
    async execute(sock, msg, args, { from, prefixo, reply, sender, isGroup }) {
        
        if (!isGroup) return reply("❌ Use este comando em um grupo!");

        const dbPath = path.resolve('./database/respostas_quiz.json');
        if (!fs.existsSync(dbPath)) return reply("❌ Database de respostas não encontrada.");
        
        const listaPersonagens = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

        // --- MODO 1: INICIAR NOVO QUIZ ---
        if (args.length === 0) {
            const sorteado = listaPersonagens[Math.floor(Math.random() * listaPersonagens.length)];
            
            // Caminho da foto embaçada
            const fotoBlur = path.resolve(`./media/quiz/blur/${sorteado.id}.jpg`);

            if (!fs.existsSync(fotoBlur)) {
                return reply(`⚠️ Erro: Foto blur ${sorteado.id}.jpg não encontrada.`);
            }

            quizAtivo[from] = sorteado;

            let legenda = `*🖼️ QUEM É ESSE PERSONAGEM? 🖼️*\n\n`;
            legenda += `O alvo está camuflado! Consegue identificar?\n\n`;
            legenda += `*RESPOSTA:* \`${prefixo}adivinha [nome]\``;

            return sock.sendMessage(from, { 
                image: { url: fotoBlur }, 
                caption: legenda 
            }, { quoted: msg });
        }

        // --- MODO 2: VERIFICAR RESPOSTA ---
        if (!quizAtivo[from]) return reply(`❌ Nenhum quiz ativo! Digite \`${prefixo}adivinha\` para começar.`);

        const tentativa = args.join(' ').toLowerCase().trim();
        const personagemCerto = quizAtivo[from];
        const nomeCorreto = personagemCerto.nome.toLowerCase();

        // Verificação inteligente (se a resposta do user contém a certa ou vice-versa)
        if (tentativa.includes(nomeCorreto) || nomeCorreto.includes(tentativa)) {
            
            // Reação de Sucesso
            await sock.sendMessage(from, { react: { text: '🎯', key: msg.key }});

            // Caminho da foto ORIGINAL (Sem Blur)
            const fotoOriginal = path.resolve(`./media/quiz/original/${personagemCerto.id}.jpg`);
            
            let vitoria = `*🎯 ALVO IDENTIFICADO! 🎯*\n\n`;
            vitoria += `Parabéns @${sender.split('@')[0]}!\n`;
            vitoria += `O personagem era: *${personagemCerto.nome}*\n\n`;
            vitoria += `_A imagem foi revelada com sucesso!_ ⚔️🛡️`;

            // Envia a imagem original para "revelar" o segredo
            if (fs.existsSync(fotoOriginal)) {
                await sock.sendMessage(from, { 
                    image: { url: fotoOriginal }, 
                    caption: vitoria, 
                    mentions: [sender] 
                }, { quoted: msg });
            } else {
                await reply(vitoria);
            }

            // Limpa o quiz do grupo para poder começar outro
            delete quizAtivo[from];
            
        } else {
            // ERRO
            await sock.sendMessage(from, { react: { text: '❌', key: msg.key }});
            return reply(`*ERRADO!* 🤡\nTente novamente, a camuflagem te enganou!`);
        }
    }
};
