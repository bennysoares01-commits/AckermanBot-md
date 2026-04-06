/**
 * Comando: minhadupla 👩‍❤️‍👨
 * Pasta: menuzoeira
 * Créditos: Benny ⚔️
 */

const fs = require('fs');

module.exports = {
    name: 'minhadupla',
    category: 'menuzoeira',
    description: 'Veja os detalhes da sua família de elite.',
    alias: ['casal', 'meuamor', 'familia'],
    async execute(sock, msg, args, { from, reply, sender }) {
        
        // --- 🛡️ TRAVA DE SEGURANÇA: MODO ZOEIRA ---
        const dbZoeiraPath = './database/modozoeira.json';
        const dbZoeira = fs.existsSync(dbZoeiraPath) ? JSON.parse(fs.readFileSync(dbZoeiraPath)) : {};

        if (!dbZoeira[from]) {
            await sock.sendMessage(from, { react: { text: '🛡️', key: msg.key }});
            return reply("⚠️ *MODO ZOEIRA NÃO ESTÁ ATIVADO!* \n\nPeça para algum administrador ativar.\nPara ativar é só usar: *modozoeira on*");
        }
        // ------------------------------------------

        const dbPath = './dono/casais.json';
        if (!fs.existsSync(dbPath)) return reply("❌ Nenhum registro de família encontrado.");
        
        const db = JSON.parse(fs.readFileSync(dbPath));
        const user = sender;
        
        // Busca o ID do casal onde o usuário atual está presente
        const idCasal = Object.keys(db.casais).find(id => id.includes(user));
        if (!idCasal) return reply("🧊 *STATUS:* Sem família registrada. Use .casar @usuario primeiro!");

        const dados = db.casais[idCasal];
        
        // Identifica quem é o parceiro (removendo o ID do usuário atual da chave)
        const parceiro = idCasal.replace(user, '').replace('-', '');
        const filhos = dados.filhos || [];
        
        // --- LÓGICA DE DATA CORRIGIDA ---
        // Se a data estiver em string PT-BR, vamos converter. Se for timestamp, usa direto.
        let dataUnix;
        if (typeof dados.data === 'string' && dados.data.includes('/')) {
            const [dia, mes, ano] = dados.data.split('/');
            dataUnix = new Date(ano, mes - 1, dia).getTime();
        } else {
            dataUnix = dados.data; 
        }

        const dataInicio = new Date(dataUnix);
        const agora = Date.now();
        const diff = agora - dataUnix;
        const dias = Math.floor(diff / (1000 * 60 * 60 * 24));

        let statusTexto = `╭━━━〔 💍 *LINHAGEM ACKERMAN* 💍 〕━━━╮\n`;
        statusTexto += `┃\n`;
        statusTexto += `┃ ❤️ *CASAL:* @${user.split('@')[0]} & @${parceiro.split('@')[0]}\n`;
        statusTexto += `┃ 📅 *UNIÃO:* ${dataInicio.toLocaleDateString('pt-BR')}\n`;
        statusTexto += `┃ ⏳ *TEMPO:* ${dias <= 0 ? 'Recém-casados' : dias + ' dias'} de batalha\n`;
        statusTexto += `┃\n`;
        statusTexto += `┣━━━〔 👨‍👩‍👧‍👦 *DESCENDENTES* 〕━━━\n`;
        
        if (filhos.length === 0) {
            statusTexto += `┃ 🧊 Ninguém foi adotado ainda.\n`;
        } else {
            filhos.forEach((f, i) => {
                statusTexto += `┃ ${i+1}. @${f.split('@')[0]}\n`;
            });
        }
        
        statusTexto += `┃\n`;
        statusTexto += `╰━━━━〔 🎖️ *ACKERMAN-BOT* 🎖️ 〕━━━━╯`;

        await sock.sendMessage(from, { react: { text: '👩‍❤️‍👨', key: msg.key }});

        const mencoes = [user, parceiro, ...filhos];
        return sock.sendMessage(from, { text: statusTexto, mentions: mencoes }, { quoted: msg });
    }
};
