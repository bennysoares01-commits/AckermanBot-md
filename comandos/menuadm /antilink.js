/**
 * Comando: antilink 🔗
 * Categoria: admin
 * Descrição: Ativa/Desativa o banimento imediato para quem enviar links.
 */

const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'antilink',
    category: 'admin',
    description: 'Ativa/Desativa o banimento automático por link.',
    async execute(sock, msg, args, { from, reply, isGroupAdmins, isOwner }) {
        
        // 🛡️ Verificação de Permissão
        if (!isGroupAdmins && !isOwner) return reply("❌ COMANDO É APENAS PARA ADM OU MEU DONO");

        const dbPath = path.resolve('./database/config_grupos.json');
        
        // Cria o arquivo se não existir
        if (!fs.existsSync(dbPath)) {
            if (!fs.existsSync('./database')) fs.mkdirSync('./database');
            fs.writeFileSync(dbPath, '[]');
        }

        let configs = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
        let idx = configs.findIndex(c => c.group === from);
        let status = false;

        if (idx === -1) {
            configs.push({ group: from, antilink: true });
            status = true;
        } else {
            // Inverte o status atual (Toggle)
            configs[idx].antilink = !configs[idx].antilink;
            status = configs[idx].antilink;
        }

        fs.writeFileSync(dbPath, JSON.stringify(configs, null, 2));

        // Reação de confirmação 🔗
        await sock.sendMessage(from, { react: { text: '🔗', key: msg.key }});

        const msgStatus = status ? '✅ ATIVADO (Banimento Imediato)' : '❌ DESATIVADO';
        return reply(`*SISTEMA ANTI-LINK:* ${msgStatus}\n\n_Soldados que enviarem links serão expulsos do pelotão sem aviso prévio!_ ⚔️`);
    }
};
