/**
 * Comando: gay 🏳️‍🌈 (Versão com Foto e Porcentagem)
 * Pasta: diversao
 * Créditos: Benny ⚔️
 */

const fs = require('fs');

module.exports = {
    name: 'gay',
    category: 'diversao',
    description: 'Mede a porcentagem de gay de um usuário.',
    alias: ['testegay', 'viado'],
    async execute(sock, msg, args, { from, sender, mentions, reply }) {
        
        // --- 🛡️ TRAVA DE SEGURANÇA: MODO ZOEIRA ---
        const dbZoeiraPath = './database/modozoeira.json';
        const dbZoeira = fs.existsSync(dbZoeiraPath) ? JSON.parse(fs.readFileSync(dbZoeiraPath)) : {};

        if (!dbZoeira[from]) {
            await sock.sendMessage(from, { react: { text: '🛡️', key: msg.key }});
            return reply("⚠️ *MODO ZOEIRA NÃO ESTÁ ATIVADO!* \n\nPeça para algum administrador ativar.\nPara ativar é só usar: *modozoeira on*");
        }
        // ------------------------------------------

        try {
            // Pega o primeiro marcado ou o próprio remetente (auto-teste)
            const alvo = mentions[0] || sender;
            const quemTestou = sender.split('@')[0];
            const alvoNome = alvo.split('@')[0];

            // CONFIGURAÇÃO: Salve sua foto como 'gay.jpg' em ./media/
            const caminhoFoto = "./media/gay.jpg";
            
            // Gera porcentagem aleatória
            const porcentagem = Math.floor(Math.random() * 101);

            // Reação zoeira 🏳️‍🌈
            await sock.sendMessage(from, { react: { text: '🏳️‍🌈', key: msg.key }});

            let texto = `*┏━━〔 🏳️‍🌈 TESTE DE GAY 🏳️‍🌈 〕━━┛*\n\n`;
            
            if (alvo === sender) {
                texto += `👤 @${quemTestou} fez o teste em si mesmo!\n`;
            } else {
                texto += `🎯 @${quemTestou} testou @${alvoNome}!\n`;
            }

            texto += `📊 *RESULTADO:* ${porcentagem}% Gay!\n\n`;
            texto += `_“O bot não mente.”_\n\n`;
            texto += `*┗━━〔 🎖️ ACKERMAN 🎖️ 〕━━┛*`;

            // Verifica se a foto existe para enviar, senão manda só o texto
            if (fs.existsSync(caminhoFoto)) {
                return sock.sendMessage(from, { 
                    image: { url: caminhoFoto }, 
                    caption: texto,
                    mentions: [sender, alvo] 
                }, { quoted: msg });
            } else {
                return sock.sendMessage(from, { 
                    text: texto, 
                    mentions: [sender, alvo] 
                }, { quoted: msg });
            }

        } catch (e) {
            console.log("Erro no comando gay:", e);
        }
    }
};
