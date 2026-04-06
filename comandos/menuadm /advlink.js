/**
 * Comando: advlink 🔗
 * Categoria: admin
 * Descrição: Ativa/Desativa o sistema de advertência automática por link.
 * Créditos: Benny ⚔️
 */

const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'advlink',
    category: 'admin',
    description: 'Ativa o sistema de advertência automática por link.',
    alias: ['antilinkadv'],
    async execute(sock, msg, args, { from, reply, isAdmins, isOwner }) {
        
        // 1. Verificação de autoridade usando a variável isAdmins corrigida do handler
        if (!isAdmins && !isOwner) return reply("❌ COMANDO É APENAS PARA ADM OU MEU DONO");

        const dbDir = './database';
        const dbPath = path.resolve(dbDir, 'config_grupos.json');

        // 2. Garante que a pasta e o arquivo existam
        if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir);
        if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, '[]');

        let configs = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

        // 3. Procura a configuração deste QG (Grupo)
        let idx = configs.findIndex(c => c.group === from);
        let status = false;

        if (idx === -1) {
            // Se não existir, ativa por padrão
            configs.push({ group: from, advlink: true });
            status = true;
        } else {
            // Se existir, alterna o estado (Toggle)
            configs[idx].advlink = !configs[idx].advlink;
            status = configs[idx].advlink;
        }

        // 4. Salva a alteração
        fs.writeFileSync(dbPath, JSON.stringify(configs, null, 2));

        // 5. Reação e Resposta
        await sock.sendMessage(from, { react: { text: '🔗', key: msg.key }});
        
        let msgFinal = `*SISTEMA ADV-LINK:* ${status ? '✅ ATIVADO' : '❌ DESATIVADO'}\n\n`;
        msgFinal += status 
            ? `_Agora, membros que enviarem links receberão uma advertência automática no prontuário!_ ⚔️` 
            : `_O sistema de advertência por link foi suspenso neste GRUPO._ 🛡️`;

        return reply(msgFinal);
    }
};
