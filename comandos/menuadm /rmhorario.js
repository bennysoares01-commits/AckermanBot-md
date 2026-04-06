/**
 * Comando: rmhorario 🗑️
 * Categoria: admin
 * Descrição: Remove todos os horários de abertura e fechamento automático do grupo.
 * Créditos: Benny ⚔️
 */
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'rmhorario',
    category: 'admin',
    description: 'Remove os horários automáticos do QG.',
    alias: ['limparhorario', 'delhorario'],
    async execute(sock, msg, args, { from, reply, isAdmins, isOwner }) {
        
        // 1. Verificação de autoridade (Sincronizado com o Handler)
        if (!isAdmins && !isOwner) return reply("❌ COMANDO É APENAS PARA ADM OU MEU DONO");

        const dbPath = path.resolve('./database/horarios_grupo.json');
        
        // 2. Verifica se o arquivo existe antes de tentar ler
        if (!fs.existsSync(dbPath)) {
            return reply("❌ Não há horários agendados para este QG.");
        }

        let horarios = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
        
        // 3. Verifica se o grupo realmente tem algo salvo para não filtrar à toa
        const temHorario = horarios.some(h => h.group === from);
        if (!temHorario) {
            return reply("❌ Este pelotão não possui horários automáticos configurados.");
        }

        // 4. Filtra e remove os horários deste grupo específico
        const novosHorarios = horarios.filter(h => h.group !== from);
        fs.writeFileSync(dbPath, JSON.stringify(novosHorarios, null, 2));

        // 5. Reação e Confirmação
        await sock.sendMessage(from, { react: { text: '🗑️', key: msg.key }});
        
        let msgFinal = `*✅ OPERAÇÃO CONCLUÍDA!* ✅\n\n`;
        msgFinal += `_Todos os agendamentos de abertura e fechamento foram removidos do sistema._ ⚔️`;

        return reply(msgFinal);
    }
};
