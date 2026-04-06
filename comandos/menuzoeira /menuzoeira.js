/**
 * Comando: menuzoeira 🤡
 * Versão: 6.2 (Layout Listado Vertical)
 * Ajuste: Correção de caminhos e alinhamento de texto
 * Créditos: Benny ⚔️
 */

const fs = require('fs');

module.exports = {
    name: 'menuzoeira',
    category: 'menuzoeira',
    description: 'Comandos de descontração e zoeira com acesso inteligente.',
    alias: ['zoeira', 'brincadeiras', 'fun'],
    async execute(sock, msg, args, { from, prefixo, sender }) {
        
        // --- SISTEMA DE ACESSO INTELIGENTE ---
        const numeroDono = "559181626178";
        const souDono = sender.includes(numeroDono) || msg.key.fromMe;

        const isGroup = from.endsWith('@g.us');
        let souAdm = false;

        if (isGroup) {
            try {
                const groupMetadata = await sock.groupMetadata(from);
                const groupAdmins = groupMetadata.participants
                    .filter(p => p.admin !== null)
                    .map(p => p.id);
                souAdm = groupAdmins.includes(sender);
            } catch (e) {
                souAdm = false;
            }
        }

        // Garante que a pasta e o arquivo existam para não dar erro de leitura
        if (!fs.existsSync('./database')) fs.mkdirSync('./database');
        const dbPath = './database/modozoeira.json';
        if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({}));

        const dbZoeira = JSON.parse(fs.readFileSync(dbPath));

        // Bloqueia se o modo zoeira estiver off e quem chamou não for dono ou adm
        if (isGroup && !dbZoeira[from] && !souDono && !souAdm) {
            await sock.sendMessage(from, { react: { text: '🛡️', key: msg.key }});
            return sock.sendMessage(from, { 
                text: "⚠️ *MODO ZOEIRA ESTÁ DESATIVADO!*\n\nPeça para um administrador ativar utilizando:\n*modozoeira on*" 
            }, { quoted: msg });
        }
        // ---------------------------------------

        await sock.sendMessage(from, { react: { text: '🤡', key: msg.key }});
        
        const fotoMenu = "./media/menu.jpg"; 
        const numeroUsuario = sender.split('@')[0];

        let texto = `╭━━━〔 ⚔️ *MENU ZOEIRA* ⚔️ 〕━━━╮\n`;
        texto += `┃\n`;
        texto += `┃  👤 *USUÁRIO:* @${numeroUsuario}\n`;
        texto += `┃\n`;
        texto += `┣━━━〔 🎭 *PERFIL & STATUS* 〕\n`;
        texto += `┃  🎭 ┃ ${prefixo}personalidade\n`;
        texto += `┃  🎲 ┃ ${prefixo}chance\n`;
        texto += `┃  📢 ┃ ${prefixo}fake\n`;
        texto += `┃  🔮 ┃ ${prefixo}vidente\n`;
        texto += `┃  🧠 ┃ ${prefixo}qi\n`;
        texto += `┃\n`;
        texto += `┣━━━〔 👊 *INTERAÇÃO* 〕\n`;
        texto += `┃  👊 ┃ ${prefixo}tapa\n`;
        texto += `┃  🫂 ┃ ${prefixo}abraçar\n`;
        texto += `┃  🔫 ┃ ${prefixo}atirar\n`;
        texto += `┃  ☁️ ┃ ${prefixo}cafune\n`;
        texto += `┃  💋 ┃ ${prefixo}beijo\n`;
        texto += `┃  ❤️ ┃ ${prefixo}amor\n`;
        texto += `┃\n`;
        texto += `┣━━━〔 💍 *CASAMENTO & FAMÍLIA* 〕\n`;
        texto += `┃  💍 ┃ ${prefixo}casar\n`;
        texto += `┃  💔 ┃ ${prefixo}divorciar\n`;
        texto += `┃  👩‍❤️‍👨 ┃ ${prefixo}minhadupla\n`;
        texto += `┃  🍼 ┃ ${prefixo}adotar\n`;
        texto += `┃  ⚔️ ┃ ${prefixo}deserdar\n`;
        texto += `┃  🚶 ┃ ${prefixo}sair_familia\n`;
        texto += `┃  💥 ┃ ${prefixo}deletar_familia\n`;
        texto += `┃\n`;
        texto += `┣━━━〔 🎲 *TESTES ZOEIRA* 〕\n`;
        // Alinhado corretamente agora
        texto += `┃  ✂️ ┃ ${prefixo}ppt\n`;
        texto += `┃  ✨ ┃ ${prefixo}lindo\n`;
        texto += `┃  ✨ ┃ ${prefixo}linda\n`;
        texto += `┃  🔥 ┃ ${prefixo}gostoso\n`;
        texto += `┃  🔥 ┃ ${prefixo}gostosa\n`;
        texto += `┃  👺 ┃ ${prefixo}feio\n`;
        texto += `┃  👺 ┃ ${prefixo}feia\n`;
        texto += `┃  🏳️‍🌈 ┃ ${prefixo}gay\n`;
        texto += `┃  🏳️‍🌈 ┃ ${prefixo}lesbica\n`;
        texto += `┃  🗿 ┃ ${prefixo}hetero\n`;
        texto += `┃  🔞 ┃ ${prefixo}puta\n`;
        texto += `┃  🌸 ┃ ${prefixo}buceta\n`;
        texto += `┃  🐂 ┃ ${prefixo}gado\n`;
        texto += `┃  🤘 ┃ ${prefixo}corno\n`;
        texto += `┃  🤘 ┃ ${prefixo}corna\n`;
        texto += `┃  💖 ┃ ${prefixo}ship\n`;
        texto += `┃\n`;
        texto += `┣━━━〔 🎮 *JOGOS & CAOS* 〕\n`;
        texto += `┃  🧩 ┃ ${prefixo}anagrama\n`;
        texto += `┃  🔓 ┃ ${prefixo}revelar\n`;
        texto += `┃  🚩 ┃ ${prefixo}redflag\n`;
        texto += `┃  🫪 ┃ ${prefixo}quiz\n`;
        texto += `┃  🎖️ ┃ ${prefixo}aotquiz\n`;
        texto += `┃  ⚡ ┃ ${prefixo}hpquiz\n`;
        texto += `┃  🍥 ┃ ${prefixo}quemanime\n`;
        texto += `┃  🩺 ┃ ${prefixo}laudo\n`;
        texto += `┃  ⚽ ┃ ${prefixo}futp\n`;
        texto += `┃  😵 ┃ ${prefixo}forca\n`;
        texto += `┃  🗑️ ┃ ${prefixo}delforca\n`;
        texto += `┃  ❌ ┃ ${prefixo}velha\n`;
        texto += `┃  🧹 ┃ ${prefixo}delvelha\n`;
        texto += `┃  🔞 ┃ ${prefixo}eununca\n`;
        texto += `┃\n`;
        texto += `┣━━━〔 📊 *RANKS* 〕\n`;
        texto += `┃  ✨ ┃ ${prefixo}ranklindo\n`;
        texto += `┃  🌸 ┃ ${prefixo}ranklinda\n`;
        texto += `┃  🔥 ┃ ${prefixo}rankgostoso\n`;
        texto += `┃  💎 ┃ ${prefixo}rankgostosa\n`;
        texto += `┃  🏳️‍🌈 ┃ ${prefixo}rankgay\n`;
        texto += `┃  🐂 ┃ ${prefixo}rankgado\n`;
        texto += `┃  🤘 ┃ ${prefixo}rankcorno\n`;
        texto += `┃  🍆 ┃ ${prefixo}rankpau\n`;
        texto += `┃  🌸 ┃ ${prefixo}rankbct\n`;
        texto += `┃  📈 ┃ ${prefixo}rankativo\n`;
        texto += `┃\n`;
        texto += `╰━━━━〔 🎖️ *ACKERMAN* 🎖️ 〕━━━━╯\n\n`;
        texto += `*© 2026 ACKERMAN-BOT - BY BENNY*`;

        // Verifica a imagem e envia com as menções corretas
        if (fs.existsSync(fotoMenu)) {
            await sock.sendMessage(from, { 
                image: { url: fotoMenu }, 
                caption: texto, 
                mentions: [sender] 
            }, { quoted: msg });
        } else {
            await sock.sendMessage(from, { text: texto, mentions: [sender] }, { quoted: msg });
        }
    }
};
