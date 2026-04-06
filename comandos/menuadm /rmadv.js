const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'rmadv',
    category: 'admin',
    async execute(sock, msg, args, { from, reply, isAdmins, isOwner, mentions, quoted }) {
        if (!isAdmins && !isOwner) return reply("❌ COMANDO É APENAS PARA ADM OU MEU DONO");

        let target = mentions[0] || (quoted ? quoted.participant : null);
        if (!target) return reply("⚠️ Marque a mensagem do usuário para perdoar.");

        const usuarioOriginal = target.split('@')[0];
        const idParaDb = usuarioOriginal + '@s.whatsapp.net';

        const dbPath = path.resolve('./database/advertencias.json');
        if (!fs.existsSync(dbPath)) return reply("❌ Ninguém possui advertências registradas.");

        let advs = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
        const inicialLen = advs.length;
        advs = advs.filter(u => !(u.id === idParaDb && u.group === from));

        if (advs.length === inicialLen) return reply("❌ Esta pessoa não possui advertências.");

        fs.writeFileSync(dbPath, JSON.stringify(advs, null, 2));
        await sock.sendMessage(from, { react: { text: '✅', key: msg.key }});

        return sock.sendMessage(from, { 
            text: `*✅ PERDÃO CONCEDIDO! @${usuarioOriginal} ✅*\n\n_As advertências foram removidas._ ⚔️`, 
            mentions: [target] 
        }, { quoted: msg });
    }
};
