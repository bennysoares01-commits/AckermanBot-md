/**
 * Comando: atirar 🔫 (Versão Design de Elite)
 * Pasta: diversao
 * Créditos: Benny ⚔️
 */

const fs = require('fs');

module.exports = {
    name: 'atirar',
    category: 'diversao',
    description: 'Dá um tiro de brincadeira em um usuário.',
    alias: ['tiro', 'shoot'],
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
            const quemAtirou = sender.split('@')[0];
            const alvoNome = alvo.split('@')[0];

            // Caminho da sua foto
            const caminhoFoto = "./media/atirar.jpg";

            const resultados = [
                "Acertou em cheio! 💀", 
                "Errou feio! 💨", 
                "A arma travou! 🛠️", 
                "Pegou de raspão! 🩸",
                "O alvo desviou como um ninja! 🥷"
            ];
            const sorte = resultados[Math.floor(Math.random() * resultados.length)];

            // Reação 🔫
            await sock.sendMessage(from, { react: { text: '🔫', key: msg.key }});

            // --- ⚔️ DESIGN ACKERMAN ⚔️ ---
            let texto = `╭━━━━〔 ⚔️ *ACKERMAN* ⚔️ 〕━━━━╮\n`;
            texto += `┃\n`;
            texto += `┃  🔫 *DISPARO REALIZADO*\n`;
            texto += `┃\n`;
            texto += `┃  👤 *De:* @${quemAtirou}\n`;
            texto += `┃  🎯 *Alvo:* @${alvoNome}\n`;
            texto += `┃\n`;
            texto += `┣━━━━━━━━━━━━━━━━━━━━━━━\n`;
            texto += `┃\n`;
            texto += `┃  💥 *RESULTADO:* \n`;
            texto += `┃  ${sorte}\n`;
            texto += `┃\n`;
            texto += `╰━━━━〔 🎖️ *BY BENNY* 🎖️ 〕━━━━╯`;
            // -------------------------------------

            if (fs.existsSync(caminhoFoto)) {
                const fotoBuffer = fs.readFileSync(caminhoFoto);
                
                return sock.sendMessage(from, { 
                    image: fotoBuffer, 
                    caption: texto,
                    mentions: [sender, alvo] 
                }, { quoted: msg });
            } else {
                return sock.sendMessage(from, { 
                    text: texto + "\n\n⚠️ _Foto 'atirar.jpg' não encontrada na pasta media._", 
                    mentions: [sender, alvo] 
                }, { quoted: msg });
            }

        } catch (e) {
            console.log("❌ Erro ao enviar imagem no comando atirar:", e);
            return sock.sendMessage(from, { text: "❌ Ocorreu um erro ao processar a imagem no servidor." });
        }
    }
};
