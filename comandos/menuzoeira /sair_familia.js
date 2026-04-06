/**
 * Comandos: Gestão de Família (Sair/Deletar) 🚶💥
 * Pasta: menuzoeira
 * Créditos: Benny ⚔️
 */

const fs = require('fs');

module.exports = {
    name: 'familia_gestao', // Nome base para o módulo
    category: 'menuzoeira',
    description: 'Comandos para abandonar ou destruir uma linhagem familiar.',
    alias: ['sair_familia', 'deletar_familia'],
    async execute(sock, msg, args, { from, reply }) {
        
        // --- 🛡️ TRAVA DE SEGURANÇA: MODO ZOEIRA ---
        const dbZoeiraPath = './database/modozoeira.json';
        const dbZoeira = fs.existsSync(dbZoeiraPath) ? JSON.parse(fs.readFileSync(dbZoeiraPath)) : {};

        if (!dbZoeira[from]) {
            await sock.sendMessage(from, { react: { text: '🛡️', key: msg.key }});
            return reply("⚠️ *MODO ZOEIRA NÃO ESTÁ ATIVADO!* \n\nPeça para algum administrador ativar com: *modozoeira on*");
        }
        // ------------------------------------------

        const dbPath = './dono/casais.json';
        if (!fs.existsSync(dbPath)) return reply("❌ Nenhum registro de família encontrado no banco de dados.");
        
        const user = msg.key.participant || msg.key.remoteJid;
        const comando = (msg.message?.conversation || msg.message?.extendedTextMessage?.text || "").toLowerCase();
        let db = JSON.parse(fs.readFileSync(dbPath));

        // --- LÓGICA: SAIR DA FAMÍLIA (FILHO) ---
        if (comando.includes('sair_familia')) {
            let saiu = false;
            Object.keys(db.casais).forEach(id => {
                if (db.casais[id].filhos?.includes(user)) {
                    db.casais[id].filhos = db.casais[id].filhos.filter(f => f !== user);
                    saiu = true;
                }
            });

            if (!saiu) return reply("🧊 Você não pertence a nenhuma família para poder sair.");
            
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
            await sock.sendMessage(from, { react: { text: '🚶', key: msg.key }});
            return reply("🚶 Você abandonou sua família e agora segue um caminho solo.");
        }

        // --- LÓGICA: DELETAR FAMÍLIA (CASAL) ---
        if (comando.includes('deletar_familia')) {
            const idCasal = Object.keys(db.casais).find(id => id.includes(user));

            if (!idCasal) return reply("❌ Você não possui uma linhagem/família para deletar.");

            delete db.casais[idCasal];
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
            await sock.sendMessage(from, { react: { text: '💥', key: msg.key }});
            return reply("💥 A linhagem foi destruída. Todos agora são estranhos novamente.");
        }
    }
};
