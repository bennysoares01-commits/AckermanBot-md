/**
 * Comando: closegp 🔒
 * Categoria: admin
 * Descrição: Define o horário para o fechamento automático do grupo.
 * Créditos: Benny ⚔️
 */
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'closegp',
    category: 'admin',
    description: 'Define o horário de fechamento automático.',
    alias: ['fechargp', 'setclose'],
    async execute(sock, msg, args, { from, reply, isAdmins, isOwner, prefixo, groupMetadata }) {
        
        if (!isAdmins && !isOwner) return reply("❌ COMANDO É APENAS PARA ADM OU MEU DONO");
        
        const horario = args[0]; 
        if (!horario || !horario.includes(':')) {
            return reply(`⚠️ *FORMA INCORRETA!*\n\nUse: *${prefixo}closegp 22:00*\n_Formato de 24 horas obrigatório._ ⚔️`);
        }

        // Obtém o nome do grupo atual
        const nomeGrupo = groupMetadata?.subject || "Não identificado";

        const dbDir = './database';
        const dbPath = path.resolve(dbDir, 'horarios_grupo.json');

        if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir);
        if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, '[]');

        let horarios = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

        let idx = horarios.findIndex(h => h.group === from);
        if (idx === -1) {
            horarios.push({ group: from, close: horario, open: null });
        } else {
            horarios[idx].close = horario;
        }

        fs.writeFileSync(dbPath, JSON.stringify(horarios, null, 2));
        await sock.sendMessage(from, { react: { text: '🔒', key: msg.key }});
        
        let msgFinal = `*🔒 FECHAMENTO AGENDADO!* 🔒\n\n`;
        msgFinal += `*GRUPO:* ${nomeGrupo}\n`;
        msgFinal += `*HORÁRIO:* ${horario}\n\n`;
        msgFinal += `_O portão será trancado automaticamente neste horário._ ⚔️`;

        return reply(msgFinal);
    }
};
