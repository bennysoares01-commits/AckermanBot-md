/**
 * Comando: suicidio 💀
 * Pasta: diversao
 * Créditos: Benny ⚔️
 */

module.exports = {
    name: "suicidio",
    alias: ["sair", "mebanir", "suicidar"],
    category: "diversao",
    description: "O usuário se bane do grupo por vontade própria",
    async execute(sock, msg, args, { from, reply, sender, isGroup }) {
        
        if (!isGroup) return reply("❌ Este comando só pode ser usado em grupos.");

        // 🛡️ BUSCA DADOS REAIS DO GRUPO
        const groupMetadata = await sock.groupMetadata(from);
        
        // 🤖 PEGA O ID DO BOT E LIMPA (IGUAL AO PROMOVER/REBAIXAR)
        const botId = sock.user.id.includes(':') ? sock.user.id.split(':')[0] + '@s.whatsapp.net' : sock.user.id;
        
        // 🔎 VERIFICAÇÃO MANUAL NA LISTA DE PARTICIPANTES
        const participants = groupMetadata.participants;
        const botData = participants.find(p => p.id.replace(/:.*@/, '@') === botId.replace(/:.*@/, '@'));
        const isBotAdmin = botData && (botData.admin === 'admin' || botData.admin === 'superadmin');

        if (!isBotAdmin) {
            return reply("⚠️ O Capitão (Bot) precisa ser Administrador para autorizar sua saída!");
        }

        // 💥 REAÇÃO E DESPEDIDA
        await sock.sendMessage(from, { react: { text: '💀', key: msg.key }});

        const frases = [
            "🌹 *Um soldado entregou seu coração... Adeus.*",
            "⚰️ *Foi uma honra lutar ao seu lado.*",
            "💀 *O destino foi cruel, mas a escolha foi sua.*",
            "🚪 *Saindo do QG por vontade própria...*"
        ];
        
        const frase = frases[Math.floor(Math.random() * frases.length)];
        
        await reply(`${frase}\n\n@${sender.split('@')[0]} será removido em 3 segundos...`, { mentions: [sender] });

        // 🚀 EXECUÇÃO DA REMOÇÃO
        setTimeout(async () => {
            try {
                await sock.groupParticipantsUpdate(from, [sender], "remove");
            } catch (err) {
                console.log("Erro ao remover soldado:", err);
                // Se der erro aqui, o problema é permissão do WhatsApp, não do código
            }
        }, 3000);
    }
};
