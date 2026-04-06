const fs = require('fs');

module.exports = {
    name: "setapi",
    async execute(sock, msg, args, config) {
        const from = msg.key.remoteJid;

        // --- AQUI ESTÁ A CHAVE: Ele usa o eDono que o handler enviou ---
        if (!config.eDono) {
            return sock.sendMessage(from, { text: "❌ COMANDO É APENAS PARA O MEU DONO" });
        }

        const novaApi = args[0];

        if (!novaApi) {
            return sock.sendMessage(from, { text: "⚠️ Digite a nova API!\nExemplo: *.setapi https://api.exemplo.com*" });
        }

        try {
            const configPath = './dono/config.json';
            const configData = JSON.parse(fs.readFileSync(configPath));

            // Atualiza o valor no arquivo
            configData.apiGeral = novaApi;

            fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));

            await sock.sendMessage(from, { react: { text: '⚙️', key: msg.key } });
            await sock.sendMessage(from, { text: `✅ API Geral atualizada com sucesso!\n\nNovo valor: ${novaApi}` });

        } catch (e) {
            console.log(e);
            await sock.sendMessage(from, { text: "❌ Erro ao salvar a nova API no config.json" });
        }
    }
};
