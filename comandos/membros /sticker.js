/**
 * Comando: sticker 🎨 (Versão Suprema com Créditos Injetados)
 * Créditos: Benny ⚔️
 */

const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { exec } = require('child_process');
const fs = require('fs');

module.exports = {
    name: "sticker",
    category: "utilitarios",
    description: "Cria figurinhas quadradas com créditos infalíveis.",
    alias: ["s", "f", "figurinha"],
    async execute(sock, msg, args, { from, reply }) {
        
        const type = Object.keys(msg.message)[0];
        const isQuoted = type === 'extendedTextMessage' && msg.message.extendedTextMessage.contextInfo?.quotedMessage;
        const messageToDownload = isQuoted ? msg.message.extendedTextMessage.contextInfo.quotedMessage : msg.message;
        const mediaType = Object.keys(messageToDownload)[0];

        if (!/imageMessage|videoMessage/.test(mediaType)) {
            return reply("⚠️ Marque uma imagem ou vídeo curto!");
        }

        if (mediaType === 'videoMessage' || (isQuoted && messageToDownload.videoMessage)) {
            const videoDuration = isQuoted ? messageToDownload.videoMessage.seconds : msg.message.videoMessage.seconds;
            if (videoDuration > 9) return reply("❌ Vídeo muito longo! Máximo 9s.");
        }

        await sock.sendMessage(from, { react: { text: '🎨', key: msg.key } });

        try {
            const nomeUsuario = msg.pushName || "Usuário";
            const groupMetadata = from.endsWith('@g.us') ? await sock.groupMetadata(from) : null;
            const nomeGrupo = groupMetadata ? groupMetadata.subject : "Ackerman Chat";

            // Metadados que serão injetados
            const packName = `⚔️ ACKERMAN-BOT ⚔️\n👥 GRUPO: ${nomeGrupo}`;
            const authorName = `👤 AUTOR: ${nomeUsuario}\n👑 DONO: Benny`;

            const stream = await downloadContentFromMessage(
                messageToDownload[mediaType],
                mediaType === 'imageMessage' ? 'image' : 'video'
            );
            
            let buffer = Buffer.from([]);
            for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

            const inputPath = `./in_${Date.now()}.${mediaType === 'imageMessage' ? 'jpg' : 'mp4'}`;
            const cleanWebp = `./clean_${Date.now()}.webp`;
            const exifFile = `./temp_${Date.now()}.exif`;
            const finalWebp = `./final_${Date.now()}.webp`;

            fs.writeFileSync(inputPath, buffer);

            // 1. FFmpeg: Corte Quadrado e Limpeza
            const filter = `scale=512:512:force_original_aspect_ratio=increase,crop=512:512`;
            const ffmpegCmd = mediaType === 'imageMessage' 
                ? `ffmpeg -i ${inputPath} -vcodec libwebp -filter:v "${filter}" -lossless 1 ${cleanWebp}`
                : `ffmpeg -i ${inputPath} -vcodec libwebp -filter:v "${filter},fps=15" -loop 0 -preset default -an -vsync 0 -s 512:512 ${cleanWebp}`;

            exec(ffmpegCmd, (err) => {
                if (err) return reply("❌ Erro no FFmpeg.");

                // 2. Criando o Esqueleto EXIF (JSON)
                const json = { 
                    "sticker-pack-id": `ackerman-${Date.now()}`, 
                    "sticker-pack-name": packName, 
                    "sticker-pack-publisher": authorName, 
                    "emojis": ["⚔️"] 
                };
                const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
                const jsonBuffer = Buffer.from(JSON.stringify(json), 'utf-8');
                const exif = Buffer.concat([exifAttr, jsonBuffer]);
                exif.writeUIntLE(jsonBuffer.length, 14, 4);
                fs.writeFileSync(exifFile, exif);

                // 3. Webpmux: Injeção Final
                exec(`webpmux -set exif ${exifFile} ${cleanWebp} -o ${finalWebp}`, async (err2) => {
                    if (!err2 && fs.existsSync(finalWebp)) {
                        await sock.sendMessage(from, { sticker: fs.readFileSync(finalWebp) }, { quoted: msg });
                    }

                    // Limpeza Total
                    [inputPath, cleanWebp, exifFile, finalWebp].forEach(p => { if (fs.existsSync(p)) fs.unlinkSync(p); });
                });
            });

        } catch (e) {
            console.log(e);
            reply("❌ Erro crítico.");
        }
    }
};
