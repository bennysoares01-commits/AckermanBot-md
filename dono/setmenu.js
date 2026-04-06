const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const fs = require('fs');

module.exports = {
    name: "setmenu",
    aliases: ["setimg", "mudarfoto"],
    async execute(sock, msg, args, config) {
        const from = msg.key.remoteJid;
        const type = Object.keys(msg.message)[0];
        const sender = msg.key.participant || msg.key.remoteJid;
        
        // --- TRAVA DE SEGURANÇA (DONO) ---
        const isOwner = sender.includes(config.donoNumero);
        if (!isOwner) {
            return sock.sendMessage(from, { text: "🚫 COMANDO É APENAS PARA O MEU DONO" }, { quoted: msg });
        }

        // --- LÓGICA DO COMANDO ---
        const q = args.join(' ').toLowerCase();
        const isImg = type === 'imageMessage' || (type === 'extendedTextMessage' && msg.message.extendedTextMessage.contextInfo?.quotedMessage?.imageMessage);

        if (isImg && q) {
            const targets = ['gay', 'gado', 'corno'];
            if (!targets.includes(q)) {
                return sock.sendMessage(from, { text: "⚠️ Use: .setmenu [gay/gado/corno]" }, { quoted: msg });
            }

            try {
                // Pega a mensagem da imagem (seja direta ou respondida/quoted)
                const msgImg = type === 'imageMessage' ? msg.message.imageMessage : msg.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage;
                
                // Baixa o conteúdo
                const stream = await downloadContentFromMessage(msgImg, 'image');
                let buffer = Buffer.from([]);
                for await(const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk]);
                }

                // Salva na pasta assets que criamos
                const path = `./assets/${q}.jpg`;
                fs.writeFileSync(path, buffer);

                await sock.sendMessage(from, { react: { text: '✅', key: msg.key } });
                await sock.sendMessage(from, { text: `✅ Foto do comando .${q} atualizada com sucesso!` }, { quoted: msg });
            } catch (err) {
                console.log(err);
                await sock.sendMessage(from, { text: "❌ Erro ao salvar a imagem." });
            }
        } else {
            await sock.sendMessage(from, { text: "📸 Responda uma foto com o texto: .setmenu [gay/gado/corno]" }, { quoted: msg });
        }
    }
};
