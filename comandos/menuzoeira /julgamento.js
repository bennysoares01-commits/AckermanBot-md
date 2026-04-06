/**
 * Comando: julgamento ⚖️
 * Pasta: membros
 * Créditos: Benny ⚔️
 * Estilo: Sobrevivência com Base de Dados Externa
 */

const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'julgamento',
    category: 'membros',
    description: 'Responda corretamente ou seja humilhado perante as muralhas.',
    alias: ['sobreviver', 'tribunal'],
    async execute(sock, msg, args, { from, prefixo, reply, sender, isGroup }) {
        
        if (!isGroup) return reply("❌ Este comando deve ser usado em grupos.");

        // --- CAMINHO PARA A DATABASE NA RAIZ ---
        const dbPath = path.resolve('./database/perguntas_julgamento.json');
        
        if (!fs.existsSync(dbPath)) {
            return reply("❌ Erro: A database de perguntas não foi encontrada na raiz.");
        }

        const perguntas = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
        const usuario = sender.split('@')[0];

        // MENSAGEM INICIAL (INSTRUÇÃO)
        if (args.length === 0) {
            await sock.sendMessage(from, { react: { text: '⚖️', key: msg.key }});
            
            const quest = perguntas[Math.floor(Math.random() * perguntas.length)];
            
            let instrucao = `*⚖️ TRIBUNAL DAS MURALHAS ⚖️*\n\n`;
            instrucao += `Usuario @${usuario}, sua honra está em jogo!\n\n`;
            instrucao += `*PERGUNTA:* ${quest.p}\n\n`;
            instrucao += `*COMO RESPONDER:* Digite \`${prefixo}julgamento [sua resposta]\`\n`;
            instrucao += `_Punição por erro: Humilhação pública!_`;

            return sock.sendMessage(from, { text: instrucao, mentions: [sender] }, { quoted: msg });
        }

        // LÓGICA DE RESPOSTA
        const respostaUsuario = args.join(' ').toLowerCase().trim();
        
        // Verifica se a resposta está correta na base de dados
        const acerto = perguntas.find(q => {
            const respostaCerta = q.r.toLowerCase();
            return respostaUsuario.includes(respostaCerta) || respostaCerta.includes(respostaUsuario);
        });

        if (acerto) {
            await sock.sendMessage(from, { react: { text: '🛡️', key: msg.key }});
            let vitoria = `*✅ SENTENÇA: INOCENTE!* \n\n`;
            vitoria += `Parabéns @${usuario}, sua inteligência salvou sua pele! ⚔️🛡️`;
            return sock.sendMessage(from, { text: vitoria, mentions: [sender] }, { quoted: msg });
        } else {
            await sock.sendMessage(from, { react: { text: '💀', key: msg.key }});

            const zombarias = [
                `@${usuario} errou! Você não duraria 5 segundos fora das muralhas. 🤡`,
                `Que vergonha, @${usuario}... Até um Titã Puro sabe isso! 🧠❌`,
                `SENTENÇA: MORTE! @${usuario} falhou no teste básico de sobrevivência. 🩸💀`,
                `Soldado @${usuario}, sua burrice é uma ameaça à humanidade! ⚔️🚫`,
                `@${usuario}, volte para a escola antes de tentar se tornar um soldado! 🚔`
            ];

            const fraseZoeira = zombarias[Math.floor(Math.random() * zombarias.length)];
            let derrota = `*❌ SENTENÇA DE MORTE! ❌*\n\n`;
            derrota += `${fraseZoeira}`;
            
            return sock.sendMessage(from, { text: derrota, mentions: [sender] }, { quoted: msg });
        }
    }
};
