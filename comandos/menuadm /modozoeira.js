/**
 * Comando: modozoeira 🎭
 * Descrição: Ativa ou desativa os comandos de zoeira no grupo.
 * Créditos: Benny ⚔️
 */

const fs = require('fs');
const path = './database/modozoeira.json';

module.exports = {
    name: "modozoeira",
    category: "admin",
    description: "Liga/Desliga os comandos de zoeira no grupo.",
    alias: ["zoeira", "fun"],
    async execute(sock, msg, args, { from, reply, sender }) {
        
        // 1. IDENTIFICAÇÃO DO DONO (BENNY)
        const numeroDono = "559181626178"; 
        const souDono = sender.includes(numeroDono);

        if (!from.endsWith('@g.us')) return reply("❌ Este comando só funciona em grupos!");
        
        // 2. VERIFICAÇÃO DE ADMS (FORÇADA PARA NÃO DAR ERRO)
        const groupMetadata = await sock.groupMetadata(from);
        const groupAdmins = groupMetadata.participants
            .filter(p => p.admin !== null)
            .map(p => p.id);
        const souAdm = groupAdmins.includes(sender);

        // SE NÃO FOR DONO E NÃO FOR ADM, BARRA
        if (!souDono && !souAdm) {
            await sock.sendMessage(from, { react: { text: '⚠️', key: msg.key }});
            return reply("⚠️ Apenas administradores ou o meu dono podem alterar o modo zoeira!");
        }

        // 3. GERENCIAMENTO DO BANCO DE DADOS
        if (!fs.existsSync('./database')) fs.mkdirSync('./database');
        const db = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : {};

        const status = args[0]?.toLowerCase();

        if (status === 'on') {
            db[from] = true;
            fs.writeFileSync(path, JSON.stringify(db, null, 2));
            await sock.sendMessage(from, { react: { text: '✅', key: msg.key }});
            return reply("🎭 *MODO ZOEIRA ATIVADO!*\nAgora os comandos de diversão estão liberados.");
        } else if (status === 'off') {
            db[from] = false;
            fs.writeFileSync(path, JSON.stringify(db, null, 2));
            await sock.sendMessage(from, { react: { text: '🛡️', key: msg.key }});
            return reply("🛡️ *MODO ZOEIRA DESATIVADO!*\nComandos de diversão bloqueados.");
        } else {
            return reply(`❓ Use: *modozoeira on* ou *off*`);
        }
    }
};
