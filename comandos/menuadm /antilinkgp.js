/**
 * Comando: antilinkgp 🛡️
 * Função: Ban imediato para links de outros grupos.
 * Créditos: Benny ⚔️
 */

const fs = require('fs');

module.exports = {
    name: 'antilinkgp',
    category: 'seguranca',
    description: 'Ativa/Desativa o ban imediato para links de grupos.',
    async execute(sock, msg, args, { from, isGroup, reply, eDono, db }) {
        if (!isGroup) return reply("❌ Este comando só pode ser usado em grupos.");
        
        // Verifica se o usuário é ADM ou Dono
        const groupMetadata = await sock.groupMetadata(from);
        const isAdmin = groupMetadata.participants.find(p => p.id === (msg.key.participant || msg.key.remoteJid))?.admin;
        if (!isAdmin && !eDono) return reply("⚠️ Apenas Generais (ADMs) ou meu Dono.");

        if (!db.grupos) db.grupos = {};
        if (!db.grupos[from]) db.grupos[from] = {};

        if (args[0] === 'on') {
            db.grupos[from].antilinkgp = true;
            fs.writeFileSync('./dono/database.json', JSON.stringify(db, null, 2));
            return reply("🚀 *ANTILINK-GP ATIVADO!* \n\nA muralha está reforçada. Links de outros grupos resultarão em *BAN IMEDIATO*.");
        } else if (args[0] === 'off') {
            db.grupos[from].antilinkgp = false;
            fs.writeFileSync('./dono/database.json', JSON.stringify(db, null, 2));
            return reply("✅ *ANTILINK-GP DESATIVADO!*");
        } else {
            return reply(`❓ Use: *.antilinkgp on* ou *off*`);
        }
    }
};
