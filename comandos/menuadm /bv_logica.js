/**
 * Lógica Interna: Disparo de Boas-Vindas ⚔️
 * Função: Processar e enviar a saudação com MENÇÃO REAL (@usuario).
 * Créditos: Benny ⚔️
 */

const moment = require('moment-timezone');

module.exports = {
    name: 'bv_logica', 
    category: 'sistema',
    description: 'Execução automática de boas-vindas.',
    async execute(sock, anu, metadata, config) {
        try {
            if (!anu || !anu.id) return;

            const { id, participants } = anu;
            const time = moment().tz('America/Belem').format('HH:mm:ss');

            for (let num of participants) {
                // 🛠️ LIMPEZA TOTAL DO ID
                let jid = typeof num === 'string' ? num : (num.id || String(num));
                
                if (!jid || jid.includes('[object') || jid.length < 5) continue;

                const numeroPuro = jid.split('@')[0];
                
                // Pega a legenda configurada
                let texto = config.legenda || "👋 Olá @#nmr#, seja bem-vindo(a) ao grupo *#nomedogp#*! ⚔️";

                // ✨ AJUSTE NA SUBSTITUIÇÃO: 
                // Se o usuário escreveu @#nmr# ou apenas #nmr#, nós garantimos que vire a menção correta.
                texto = texto.replace('#nomedogp#', metadata.subject || "Grupo");
                texto = texto.replace('#nmrbot#', sock.user.id.split(':')[0]);
                texto = texto.replace('#nmr#', `${numeroPuro}`); // Substitui a tag pelo número
                texto = texto.replace('#desc#', metadata.desc || "Sem descrição.");
                texto = texto.replace('#time#', time);
                texto = texto.replace('#prefixo#', '/');

                // Envia a mensagem garantindo as menções no array 'mentions'
                await sock.sendMessage(id, { 
                    text: texto, 
                    mentions: [jid] // Isso aqui é o que faz o @numero virar @nome_do_contato
                });
            }
        } catch (e) {
            console.log("❌ Erro no disparo de BV:", e.message);
        }
    }
};
