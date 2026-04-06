/**
 * Comando: opengp 🔓
 * Categoria: admin
 * Descrição: Define o horário para a abertura automática do grupo.
 * Créditos: Benny ⚔️
 */
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'opengp',
    category: 'admin',
    description: 'Define o horário de abertura automática.',
    alias: ['abrirgp', 'setopen'],
    async execute(sock, msg, args, { from, reply, isAdmins, isOwner, prefixo, groupMetadata }) {
        
        // 1. Verificação de autoridade
        if (!isAdmins && !isOwner) return reply("❌ COMANDO É APENAS PARA ADM OU MEU DONO");
        
        // 2. Validação do argumento de horário
        const horario = args[0]; 
        if (!horario || !horario.includes(':')) {
            return reply(`⚠️ *FORMA INCORRETA!*\n\nUse: *${prefixo}opengp 08:00*\n_Formato de 24 horas obrigatório._ ⚔️`);
        }

        // 3. Obtém o nome real do grupo
        const nomeGrupo = groupMetadata?.subject || "Não identificado";

        const dbDir = './database';
        const dbPath = path.resolve(dbDir, 'horarios_grupo.json');

        // 4. Garante que a pasta e o arquivo existam
        if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir);
        if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, '[]');

        let horarios = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

        // 5. Procura ou cria a configuração do grupo
        let idx = horarios.findIndex(h => h.group === from);
        if (idx === -1) {
            horarios.push({ group: from, close: null, open: horario });
        } else {
            horarios[idx].open = horario;
        }

        // 6. Salva e confirma
        fs.writeFileSync(dbPath, JSON.stringify(horarios, null, 2));
        await sock.sendMessage(from, { react: { text: '🔓', key: msg.key }});
        
        let msgFinal = `*🔓 ABERTURA AGENDADA!* 🔓\n\n`;
        msgFinal += `*GRUPO:* ${nomeGrupo}\n`;
        msgFinal += `*HORÁRIO:* ${horario}\n\n`;
        msgFinal += `_O portão será aberto automaticamente neste horário._ ⚔️`;

        return reply(msgFinal);
    }
};
