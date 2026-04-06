const fs = require('fs');

module.exports = {
    name: 'antiflood',
    category: 'seguranca',
    description: 'Evita spam de mensagens seguidas.',
    async execute(sock, msg, args, { from, isGroup, reply, eDono, db }) {
        if (!isGroup) return reply("❌ Apenas em grupos.");
        
        const groupMetadata = await sock.groupMetadata(from);
        const isAdmin = groupMetadata.participants.find(p => p.id === (msg.key.participant || msg.key.remoteJid))?.admin;
        if (!isAdmin && !eDono) return reply("⚠️ Apenas ADMs ou meu Dono.");

        if (!db.grupos) db.grupos = {};
        if (!db.grupos[from]) db.grupos[from] = {};

        if (args[0] === 'on') {
            db.grupos[from].antiflood = true;
            fs.writeFileSync('./dono/database.json', JSON.stringify(db, null, 2));
            return reply("✅ *ANTIFLOOD ATIVADO!* O bot agora monitora mensagens repetitivas.");
        } else if (args[0] === 'off') {
            db.grupos[from].antiflood = false;
            fs.writeFileSync('./dono/database.json', JSON.stringify(db, null, 2));
            return reply("✅ *ANTIFLOOD DESATIVADO!*");
        } else {
            return reply("❓ Use: *.antiflood on* ou *off*");
        }
    }
};
