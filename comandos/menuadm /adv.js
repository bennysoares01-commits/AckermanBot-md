const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'adv',
    category: 'admin',
    async execute(sock, msg, args, { from, reply, isAdmins, isOwner, groupMetadata, mentions, quoted }) {
        if (!isAdmins && !isOwner) return reply("❌ COMANDO É APENAS PARA ADM OU MEU DONO");

        let target = mentions[0] || (quoted ? quoted.participant : null);
        if (!target) return reply("⚠️ Marque uma mensagem ou mencione um membro.");

        // LÓGICA IDÊNTICA AO SEU MENU (Sem limpar os números, apenas split)
        const usuarioOriginal = target.split('@')[0];
        const idParaDb = usuarioOriginal + '@s.whatsapp.net';

        const admins = groupMetadata.participants.filter(v => v.admin !== null).map(v => v.id.split('@')[0] + '@s.whatsapp.net');
        if (admins.includes(idParaDb) && !isOwner) return reply("❌ Negativo! Não posso advertir um Admin.");

        const dbPath = path.resolve('./database/advertencias.json');
        if (!fs.existsSync('./database')) fs.mkdirSync('./database');
        let advs = fs.existsSync(dbPath) ? JSON.parse(fs.readFileSync(dbPath, 'utf-8')) : [];

        let uIdx = advs.findIndex(u => u.id === idParaDb && u.group === from);
        if (uIdx === -1) advs.push({ id: idParaDb, group: from, count: 1 });
        else advs[uIdx].count += 1;

        const total = uIdx === -1 ? 1 : advs[uIdx].count;
        fs.writeFileSync(dbPath, JSON.stringify(advs, null, 2));

        await sock.sendMessage(from, { react: { text: '⚠️', key: msg.key }});

        if (total >= 3) {
            const finalAdvs = advs.filter(u => !(u.id === idParaDb && u.group === from));
            fs.writeFileSync(dbPath, JSON.stringify(finalAdvs, null, 2));
            
            // Envia a mensagem de expulsão
            await sock.sendMessage(from, { 
                text: `*🚫 EXPULSO: @${usuarioOriginal} atingiu 3 advertências! ⚔️*`, 
                mentions: [target] 
            });

            // Executa o banimento (remoção do grupo)
            return await sock.groupParticipantsUpdate(from, [target], 'remove');
        }

        let texto = `*⚠️ ADVERTÊNCIA APLICADA (${total}/3) ⚠️*\n\n`;
        texto += `*Membro: @${usuarioOriginal}*\n`;
        texto += `_Siga as ordens do GRUPO!_ ⚔️`;

        return sock.sendMessage(from, { 
            text: texto, 
            mentions: [target] 
        }, { quoted: msg });
    }
};
