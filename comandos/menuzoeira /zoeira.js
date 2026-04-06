/**
 * Comando: zoeira.js 💥
 * Versão: Final com Trava + Atributos Reais (Ajuste Profundidade BCT)
 * Créditos: Benny ⚔️
 */

const fs = require('fs');

module.exports = {
    name: 'zoeira',
    category: 'menuzoeira',
    description: 'Comandos de zoeira com medições, notas e trava de grupo.',
    alias: ['hetero', 'lesbica', 'lésbica', 'puta', 'bct'],
    async execute(sock, msg, args, { from, reply, sender, command }) {
        
        // --- 🛡️ VERIFICAÇÃO DO MODO ZOEIRA ---
        const dbZoeiraPath = './database/modozoeira.json';
        let dbZoeira = {};
        
        if (fs.existsSync(dbZoeiraPath)) {
            dbZoeira = JSON.parse(fs.readFileSync(dbZoeiraPath));
        }

        if (!dbZoeira[from]) {
            await sock.sendMessage(from, { react: { text: '⚠️', key: msg.key }});
            return reply("🚫 *MODO ZOEIRA DESATIVADO*\nEste grupo é sério no momento. Peça a um ADM para ativar com: *.modozoeira on*");
        }

        // --- 📂 CARREGAMENTO DAS FRASES ---
        const frasesPath = './database/frases_zoeira.json';
        if (!fs.existsSync(frasesPath)) return reply("❌ Erro: Arquivo 'frases_zoeira.json' não encontrado na pasta database!");
        const db = JSON.parse(fs.readFileSync(frasesPath));

        const cmd = (command || "").toLowerCase();
        const mencao = msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || sender;
        const nomeAlvo = `@${mencao.split('@')[0]}`;
        const porcentagem = Math.floor(Math.random() * 101);

        let config = { titulo: '', emoji: '', extra: '', nota: '', mostrarPorcentagem: true };

        // --- LÓGICA DE ATRIBUTOS ---
        switch (cmd) {
            case 'bct':
                const larg = (Math.random() * (15 - 2) + 2).toFixed(1);
                const prof = (Math.random() * (20 - 5) + 5).toFixed(1); // Gera profundidade de 5 a 20cm
                let descLarg = larg < 5 ? db.bct.largura_frases[0] : larg < 9 ? db.bct.largura_frases[1] : db.bct.largura_frases[4];
                config.titulo = 'TESTE BCT 🔥'; config.emoji = '🍑';
                config.mostrarPorcentagem = false; // Remove a porcentagem apenas aqui
                config.extra = `┃  📐 *Largura:* ${larg}cm\n┃  🕳️ *Profundidade:* ${prof}cm\n┃  🗣️ *Definição:* ${descLarg}\n┃  👥 *Já visitaram:* ${Math.floor(Math.random() * 40)} pessoas`;
                config.nota = db.bct.notas[Math.floor(Math.random() * db.bct.notas.length)];
                break;

            case 'puta':
                const km = Math.floor(Math.random() * 1000);
                const descExp = km < 250 ? db.puta.experiencia_frases[0] : db.puta.experiencia_frases[2];
                config.titulo = 'TESTE PUTA 💋'; config.emoji = '😈';
                config.extra = `┃  🏩 *Km Rodado:* ${km}km\n┃  🏆 *Experiência:* ${descExp}\n┃  💳 *Cachê:* R$ ${Math.floor(Math.random() * 450)}`;
                config.nota = db.puta.notas[Math.floor(Math.random() * db.puta.notas.length)];
                break;

            case 'hetero':
                const gaySide = 100 - porcentagem;
                config.titulo = 'TESTE HÉTERO ♂️'; config.emoji = '⚔️';
                config.extra = `┃  💪 *Postura:* ${db.hetero.postura_frases[Math.floor(Math.random() * db.hetero.postura_frases.length)]}\n┃  💅 *Lado Gay:* ${gaySide}%\n┃  🥛 *Testosterona:* ${Math.floor(Math.random() * 100)}%`;
                config.nota = db.hetero.notas[Math.floor(Math.random() * db.hetero.notas.length)];
                break;

            case 'lesbica':
            case 'lésbica':
                config.titulo = 'TESTE LÉSBICA 🌈'; config.emoji = '🌈';
                config.extra = `┃  💘 *Vibe:* ${db.lesbica.vibe_frases[Math.floor(Math.random() * db.lesbica.vibe_frases.length)]}\n┃  ✂️ *Habilidade:* Nível ${Math.floor(Math.random() * 10)}\n┃  🍭 *Sedução:* ${porcentagem}%`;
                config.nota = db.lesbica.notas[Math.floor(Math.random() * db.lesbica.notas.length)];
                break;
        }

        // --- LAYOUT ---
        let texto = `╭━━━━〔 ⚔️ *ACKERMAN* ⚔️ 〕━━━━╮\n`;
        texto += `┃\n`;
        texto += `┃  ${config.emoji} *${config.titulo}*\n`;
        texto += `┃\n`;
        texto += `┃  👤 *Alvo:* ${nomeAlvo}\n`;
        if (config.mostrarPorcentagem) {
            texto += `┃  📊 *Resultado:* ${porcentagem}%\n`;
        }
        texto += `${config.extra}\n`;
        texto += `┃\n`;
        texto += `┣━━━━━━━━━━━━━━━━━━━━━━━\n`;
        texto += `┃\n`;
        texto += `┃  📝 *NOTA:* \n`;
        texto += `┃  _"${config.nota}"_\n`;
        texto += `┃\n`;
        texto += `╰━━━━〔 🎖️ *BY BENNY* 🎖️ 〕━━━━╯`;

        await sock.sendMessage(from, { react: { text: config.emoji, key: msg.key }});
        return sock.sendMessage(from, { text: texto, mentions: [mencao] }, { quoted: msg });
    }
};
