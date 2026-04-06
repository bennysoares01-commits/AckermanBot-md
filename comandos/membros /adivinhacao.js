/**
 * ACKERMAN-BOT ⚔️
 * Comando: Adivinhação 🎮
 * Créditos: Benny ⚔️
 */

const fs = require('fs');

module.exports = {
    name: 'advinha',
    category: 'membros',
    description: 'Tente adivinhar o número que o bot pensou.',
    alias: ['game', 'chute'],
    async execute(sock, msg, args, { from, reply }) {
        
        await sock.sendMessage(from, { react: { text: '🧩', key: msg.key }});

        if (!args[0] || isNaN(args[0])) {
            return reply("❓ Soldado, chute um número de 1 a 10.\n\nExemplo: *.advinha 5*");
        }

        const chute = parseInt(args[0]);

        if (chute < 1 || chute > 10) {
            return reply("⚠️ O número deve estar entre 1 e 10!");
        }

        const segredo = Math.floor(Math.random() * 10) + 1;

        if (chute === segredo) {
            await sock.sendMessage(from, { react: { text: '🎉', key: msg.key }});
            return reply(`🌟 *PARABÉNS!* Você acertou em cheio! O número era ${segredo}.`);
        } else {
            return reply(`❌ *ERROU!* Eu pensei no número ${segredo}.\nMais sorte na próxima missão!`);
        }
    }
};
