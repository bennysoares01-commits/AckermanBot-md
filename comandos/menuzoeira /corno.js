/**
 * Comando: corno 🤘 (Versão com Foto e Porcentagem)
 * Pasta: diversao
 * Créditos: Benny ⚔️
 */

const fs = require('fs');

module.exports = {
    name: 'corno',
    category: 'diversao',
    description: 'Mede a porcentagem de corno de um usuário.',
    alias: ['chifre', 'testecorno'],
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
            const alvo = mentions[0] || sender;
            const quemTestou = sender.split('@')[0];
            const alvoNome = alvo.split('@')[0];

            // CONFIGURAÇÃO: Salve sua foto como 'corno.jpg' em ./media/
            const caminhoFoto = "./media/corno.jpg";
            const porcentagem = Math.floor(Math.random() * 101);

            await sock.sendMessage(from, { react: { text: '🤘', key: msg.key }});

            let texto = `*┏━━〔 🤘 TESTE DE CORNO 🤘 〕━━┛*\n\n`;
            texto += `🎯 @${quemTestou} verificou se @${alvoNome} é corno!\n`;
            texto += `📊 *RESULTADO:* ${porcentagem}% Corno!\n\n`;
            texto += `_“O peso na cabeça não mente.”_\n\n`;
            texto += `*┗━━〔 🎖️ ACKERMAN 🎖️ 〕━━┛*`;

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
            console.log("Erro no comando corno:", e);
        }
    }
};
