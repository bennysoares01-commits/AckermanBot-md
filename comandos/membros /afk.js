module.exports = {
    name: "afk",
    async execute(sock, msg, args, config) {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const motivo = args.join(' ') || 'Sem motivo informado';

        // Inicializa o objeto global de AFK se não existir
        if (!global.afkData) global.afkData = {};

        global.afkData[sender] = {
            motivo: motivo,
            tempo: Date.now(),
            ativo: true
        };

        await sock.sendMessage(from, { 
            text: `💤 *SISTEMA AFK ATIVADO*\n\nO usuário @${sender.split('@')[0]} agora está AFK.\n*Motivo:* ${motivo}`,
            mentions: [sender]
        });
        
        // Reação de sono
        await sock.sendMessage(from, { react: { text: '💤', key: msg.key } });
    }
};
