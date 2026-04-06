/**
 * Comando: rename ✏️ (Versão Metadata JSON - Corrigida)
 * Créditos: Benny ⚔️
 */

const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { exec } = require('child_process');
const fs = require('fs');

module.exports = {
    name: "rename",
    category: "utilitarios",
    description: "Muda os créditos injetando o JSON que o WhatsApp exige.",
    alias: ["renomear", "wm"],
    async execute(sock, msg, args, { from, reply, prefixo }) {
        
        const type = Object.keys(msg.message)[0];
        const isQuotedSticker = type === 'extendedTextMessage' && msg.message.extendedTextMessage.contextInfo?.quotedMessage?.stickerMessage;

        if (!isQuotedSticker) return reply(`⚠️ Responda a uma figurinha!\nEx: *${prefixo}rename Pack / Autor*`);

        const texto = args.join(" ");
        if (!texto.includes("/")) return reply(`⚠️ Use a barra!\nEx: *${prefixo}rename MeuPack / Benny*`);

        const [novoPack, novoAutor] = texto.split("/");
        const quotedSticker = msg.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage;

        await sock.sendMessage(from, { react: { text: '✏️', key: msg.key } });

        try {
            const stream = await downloadContentFromMessage(quotedSticker, 'sticker');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

            const tempWebp = `./temp_${Date.now()}.webp`;
            const exifFile = `./temp_${Date.now()}.exif`;
            const finalWebp = `./final_${Date.now()}.webp`;

            fs.writeFileSync(tempWebp, buffer);

            // --- CRIANDO O ESQUELETO EXIF (JSON) ---
            const json = { 
                "sticker-pack-id": `ackerman-${Date.now()}`, 
                "sticker-pack-name": novoPack.trim(), 
                "sticker-pack-publisher": novoAutor.trim(), 
                "emojis": ["⚔️"] 
            };
            
            const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
            const jsonBuffer = Buffer.from(JSON.stringify(json), 'utf-8');
            const exif = Buffer.concat([exifAttr, jsonBuffer]);
            exif.writeUIntLE(jsonBuffer.length, 14, 4);
            fs.writeFileSync(exifFile, exif);

            // --- INJETANDO NA MARRA ---
            exec(`webpmux -set exif ${exifFile} ${tempWebp} -o ${finalWebp}`, async (err) => {
                if (err) {
                    console.log(err);
                    return reply("❌ Erro ao usar webpmux. Verifique se instalou 'pkg install libwebp'.");
                }

                if (fs.existsSync(finalWebp)) {
                    const finalBuffer = fs.readFileSync(finalWebp);
                    await sock.sendMessage(from, { sticker: finalBuffer }, { quoted: msg });
                }

                // Limpeza de arquivos temporários
                if (fs.existsSync(tempWebp)) fs.unlinkSync(tempWebp);
                if (fs.existsSync(exifFile)) fs.unlinkSync(exifFile);
                if (fs.existsSync(finalWebp)) fs.unlinkSync(finalWebp);
            });

        } catch (e) {
            console.log(e);
            reply("❌ Erro crítico no processo.");
        }
    }
};
