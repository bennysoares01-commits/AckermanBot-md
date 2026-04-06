const fs = require('fs');

// Configurações do Benny
const criador = "Benny";

/**
 * Função principal de eventos (Boas-vindas/Saída)
 * @param {import('@whiskeysockets/baileys').WASocket} sock 
 */
async function eventsHandler(sock) {
    sock.ev.on('group-participants.update', async (anu) => {
        try {
            const metadata = await sock.groupMetadata(anu.id);
            const participants = anu.participants;
            const rodape = `\n\n__________________________\n👨‍💻 *Criador:* ${criador}`;

            for (let num of participants) {
                let text = '';
                
                // Evento: Alguém entrou no grupo
                if (anu.action == 'add') {
                    text = `✨ *BEM-VINDO(A)!* ✨\n\nOlá @${num.split('@')[0]},\nSeja muito bem-vindo(a) ao grupo:\n*${metadata.subject}*!${rodape}`;
                } 
                // Evento: Alguém saiu ou foi banido
                else if (anu.action == 'remove') {
                    text = `👋 *ADEUS!*\n\nO membro @${num.split('@')[0]} saiu do grupo ou foi removido.${rodape}`;
                }

                if (text) {
                    await sock.sendMessage(anu.id, { 
                        text: text, 
                        mentions: [num] 
                    });
                }
            }
        } catch (e) {
            console.log("Erro no Event Handler (main.js): ", e);
        }
    });
}

module.exports = { eventsHandler };
