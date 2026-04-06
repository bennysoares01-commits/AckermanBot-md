const fs = require('fs');

module.exports = {
    name: 'desmute',
    category: 'menuadm',
    description: 'Remove o silenciamento de um usuário.',
    alias: ['falar', 'desilenciar'],
    async execute(sock, msg, args, { from, isGroup, reply, eDono }) {
        
        if (!isGroup) return reply("❌ Apenas em grupos.");
        
        const quoted = msg.message.extendedTextMessage?.contextInfo?.participant;
        const mencionado = msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        const alvo = mencionado || quoted;

        if (!alvo) return reply("❌ Mencione quem deseja desmutar.");

        const dbPath = './dono/database.json';
        let db = JSON.parse(fs.readFileSync(dbPath));

        if (!db.mutados || !db.mutados[from]) return reply("⚠️ Não há ninguém mutado neste grupo.");

        db.mutados[from] = db.mutados[from].filter(jid => jid !== alvo);
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

        await sock.sendMessage(from, { react: { text: '🔊', key: msg.key }});
        return reply(`✅ @${alvo.split('@')[0]} pode falar novamente.`, { mentions: [alvo] });
    }
};
