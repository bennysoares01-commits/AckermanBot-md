/**
 * Comando: quiz 📝
 * Função: Pergunta com enquete e sensor de acerto/erro.
 * Créditos: Benny ⚔️
 */

const quizzes = require('../../database/quizzes');

module.exports = {
    name: 'quiz',
    category: 'menuzoeira',
    description: 'Inicia um quiz por enquete.',
    alias: ['pergunta', 'enquetequiz'],
    async execute(sock, msg, args, { from }) {
        
        // Seleciona uma pergunta aleatória
        const item = quizzes[Math.floor(Math.random() * quizzes.length)];
        
        // Envia a Enquete
        const poll = await sock.sendMessage(from, {
            poll: {
                name: `📝 *QUIZ ACKERMAN*\n\n${item.pergunta}\n\n_Apenas o primeiro voto conta!_`,
                values: item.opcoes,
                selectableCount: 1
            }
        });

        // --- REGISTRO GLOBAL (AJUSTADO PARA O SENSOR) ---
        if (!global.quizAtivo) global.quizAtivo = {};
        
        global.quizAtivo[from] = {
            pollId: poll.key.id, 
            correta: item.correta, 
            opcoes: item.opcoes, // Necessário para descriptografar o voto no Index
            respondido: false 
        };

        await sock.sendMessage(from, { react: { text: '❓', key: msg.key }});
    }
};
