/**
 * Comando: adotar 🍼
 * Pasta: menuzoeira
 * Versão: 2.0 (Design Clean)
 * Créditos: Benny ⚔️
 */

const fs = require('fs');

module.exports = {
    name: 'adotar',
    category: 'menuzoeira',
    description: 'Adote um membro para sua família.',
    async execute(sock, msg, args, { from, reply, sender }) {
        
        // --- 🛡️ TRAVA DE SEGURANÇA: MODO ZOEIRA ---
        const dbZoeiraPath = './database/modozoeira.json';
        const dbZoeira = fs.existsSync(dbZoeiraPath) ? JSON.parse(fs.readFileSync(dbZoeiraPath)) : {};

        if (!dbZoeira[from]) {
            await sock.sendMessage(from, { react: { text: '🛡️', key: msg.key }});
            return reply("⚠️ *MODO ZOEIRA NÃO ESTÁ ATIVADO!* \n\nPeça para algum administrador ativar.\nPara ativar é só usar: *modozoeira on*");
        }
        // ------------------------------------------

        const dbPath = './dono/casais.json';
        const user = sender;
        const alvo = msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

        if (!alvo) return reply("⚠️ Marque quem você deseja adotar!");
        
        // Reação de processo 🍼
        await sock.sendMessage(from, { react: { text: '🍼', key: msg.key }});

        if (!fs.existsSync(dbPath)) return reply("❌ Ninguém casou ainda no bot.");

        let db = JSON.parse(fs.readFileSync(dbPath));
        const idCasal = Object.keys(db.casais).find(id => id.includes(user));

        if (!idCasal) return reply("❌ Você precisa estar casado para adotar alguém!");

        if (!db.casais[idCasal].filhos) db.casais[idCasal].filhos = [];
        
        if (db.casais[idCasal].filhos.includes(alvo)) {
            return reply("🍼 Este membro já é seu filho!");
        }

        // Salva no banco de dados
        db.casais[idCasal].filhos.push(alvo);
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

        const nomePai = msg.pushName || 'Usuário';
        const nomeFilho = `@${alvo.split('@')[0]}`;

        // --- ⚔️ DESIGN ACKERMAN ⚔️ ---
        let texto = `╭━━━━〔 ⚔️ *ACKERMAN* ⚔️ 〕━━━━╮\n`;
        texto += `┃\n`;
        texto += `┃  🍼 *NOVA ADOÇÃO*\n`;
        texto += `┃\n`;
        texto += `┃  👤 *Pai/Mãe:* ${nomePai}\n`;
        texto += `┃  👶 *Filho(a):* ${nomeFilho}\n`;
        texto += `┃\n`;
        texto += `┣━━━━━━━━━━━━━━━━━━━━━━━\n`;
        texto += `┃\n`;
        texto += `┃  Parabéns! ${nomeFilho} \n`;
        texto += `┃  agora faz parte da família \n`;
        texto += `┃  de ${nomePai}! 🎉\n`;
        texto += `┃\n`;
        texto += `╰━━━━〔 🎖️ *BY BENNY* 🎖️ 〕━━━━╯`;
        // -------------------------------------

        return sock.sendMessage(from, { 
            text: texto, 
            mentions: [alvo, user] 
        }, { quoted: msg });
    }
};
