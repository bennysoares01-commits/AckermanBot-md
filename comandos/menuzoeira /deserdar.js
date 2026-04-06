/**
 * Comando: deserdar ⚔️
 * Pasta: menuzoeira
 * Créditos: Benny ⚔️
 */

const fs = require('fs');

module.exports = {
    name: 'deserdar',
    category: 'menuzoeira',
    description: 'Remova um filho da sua linhagem.',
    async execute(sock, msg, args, { from, reply }) {
        
        // --- 🛡️ TRAVA DE SEGURANÇA: MODO ZOEIRA ---
        const dbZoeiraPath = './database/modozoeira.json';
        const dbZoeira = fs.existsSync(dbZoeiraPath) ? JSON.parse(fs.readFileSync(dbZoeiraPath)) : {};

        if (!dbZoeira[from]) {
            await sock.sendMessage(from, { react: { text: '🛡️', key: msg.key }});
            return reply("⚠️ *MODO ZOEIRA NÃO ESTÁ ATIVADO!* \n\nPeça para algum administrador ativar.\nPara ativar é só usar: *modozoeira on*");
        }
        // ------------------------------------------

        const dbPath = './dono/casais.json';
        const user = msg.key.participant || msg.key.remoteJid;
        const alvo = msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

        if (!alvo) return reply("⚠️ Marque o filho que será deserdado!");
        
        let db = JSON.parse(fs.readFileSync(dbPath));
        const idCasal = Object.keys(db.casais).find(id => id.includes(user));

        if (!idCasal || !db.casais[idCasal].filhos?.includes(alvo)) {
            return reply("❌ Este usuário não consta como seu herdeiro.");
        }

        db.casais[idCasal].filhos = db.casais[idCasal].filhos.filter(f => f !== alvo);
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

        return reply(`⚔️ @${alvo.split('@')[0]} foi removido da linhagem familiar!`, { mentions: [alvo] });
    }
};
