/**
 * Comando: fatos 📚
 * Função: Envia uma curiosidade aleatória.
 * Créditos: Benny ⚔️
 */

const fatos = require('../../database/fatos');

module.exports = {
    name: 'fatos',
    category: 'membros',
    description: 'Envia um fato curioso sobre o mundo.',
    alias: ['fato', 'curiosidade', 'vocesabia'],
    async execute(sock, msg, args, { from, reply }) {
        
        // Seleciona um fato aleatório da lista
        const fatoAleatorio = fatos[Math.floor(Math.random() * fatos.length)];

        // Reação de emoji conforme sua preferência
        await sock.sendMessage(from, { react: { text: '💡', key: msg.key }});

        const textoFinal = `🤔 *VOCÊ SABIA?*\n\n"_${fatoAleatorio}_"\n\n📚 *AckermanBot - Curiosidades* ⚔️`;

        return reply(textoFinal);
    }
};
