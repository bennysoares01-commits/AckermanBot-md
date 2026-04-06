/**
 * ACKERMAN-BOT ⚔️
 * Comando: Listar Membros VIP 📜
 * Créditos: Benny ⚔️
 */

const fs = require('fs');

module.exports = {
    name: 'listavip',
    category: 'dono',
    description: 'Exibe a lista de todos os usuários com acesso VIP.',
    alias: ['vipslist', 'vervips', 'listvips'],
    async execute(sock, msg, args, { from, sender, reply, isOwner }) {
        
        // --- 🛡️ VERIFICAÇÃO DE DONO (MÉTODO BLINDADO) ---
        const numeroDono = "559181626178";
        const souDono = (sender && sender.includes(numeroDono)) || isOwner;

        if (!souDono) {
            return reply("❌ COMANDO É APENAS PARA O MEU DONO");
        }

        const vipPath = './database/vips.json';
        
        // Verifica se o arquivo existe
        if (!fs.existsSync(vipPath)) {
            return reply("❌ *ERRO:* O banco de dados de VIPs não foi encontrado.");
        }

        const vips = JSON.parse(fs.readFileSync(vipPath));

        // Se a lista estiver vazia
        if (vips.length === 0) {
            return reply("📋 *LISTA VAZIA:* Não há soldados de elite (VIP) recrutados no momento.");
        }

        // Reação de pergaminho/lista
        await sock.sendMessage(from, { react: { text: '📜', key: msg.key }});

        let lista = `╭━━━〔 📜 *DIVISÃO DE ELITE VIP* 〕━━━╮\n`;
        lista += `┃\n`;
        lista += `┃ 💎 *CONTAGEM:* ${vips.length} Membros\n`;
        lista += `┃\n`;
        lista += `┣━━━━━━━━━━━━━━━━━━━━\n`;
        
        // Mapeia os VIPs para a lista
        vips.forEach((v, i) => {
            const num = v.split('@')[0];
            lista += `┃ ${i + 1} ┃ 🎖️ @${num}\n`;
        });
        
        lista += `┣━━━━━━━━━━━━━━━━━━━━\n`;
        lista += `┃\n`;
        lista += `┃ 🎖️ *ACKERMAN-BOT* ⚔️\n`;
        lista += `╰━━━━━━━━━━━━━━━━━━━━╯\n\n`;
        lista += `*© 2026 BENNY - CONTROLE DE ACESSO*`;

        // Envia a lista marcando os usuários
        return reply(lista, { mentions: vips });
    }
};
