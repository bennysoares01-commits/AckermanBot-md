module.exports = {
    name: "ping",
    async execute(sock, msg, args, config) {
        const from = msg.key.remoteJid;
        await sock.sendMessage(from, { react: { text: '⚡', key: msg.key } });
        await sock.sendMessage(from, { text: `⚡ *Pong!* ${config.nomeBot} está ativo.` }, { quoted: msg });
    }
};
