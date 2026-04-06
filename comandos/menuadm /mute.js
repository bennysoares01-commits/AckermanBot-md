const fs = require('fs');

module.exports = {
    name: 'mute',
    category: 'menuadm',
    description: 'Muta um usuário (bot apaga as mensagens dele).',
    alias: ['calar', 'silenciar'],
    async execute(sock, msg, args, { from, isGroup, isAdmins, reply, eDono }) {
        
        if (!isGroup) return reply("❌ Apenas em grupos.");
        
        // 🛡️ TRAVA DE ADMINISTRADOR
        if (!isAdmins && !eDono) return reply("⚠️ COMANDO É APENAS PARA OS ADMINISTRADORES");

        const quoted = msg.message.extendedTextMessage?.contextInfo?.participant;
        const mencionado = msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        const alvo = mencionado || quoted;

        if (!alvo) return reply("❌ Marque ou mencione quem você deseja mutar.");
        
        // Impede mutar o dono (seu número)
        if (alvo.includes("559181626178")) return reply("❌ Eu não posso mutar o meu Criador.");

        const dbPath = './dono/database.json';
        if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({}));
        let db = JSON.parse(fs.readFileSync(dbPath));

        if (!db.mutados) db.mutados = {};
        if (!db.mutados[from]) db.mutados[from] = [];

        if (db.mutados[from].includes(alvo)) return reply("⚠️ Este soldado já está no silêncio.");

        db.mutados[from].push(alvo);
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

        await sock.sendMessage(from, { react: { text: '🔇', key: msg.key }});
        return reply(`✅ @${alvo.split('@')[0]} foi mutado com sucesso. Suas mensagens serão eliminadas pelo bot.`, { mentions: [alvo] });
    }
};
