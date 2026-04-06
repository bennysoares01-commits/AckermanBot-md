/**
 * Comando: TikTok Downloader 🎬
 * API: Bronxys Host (Benny_bb2026)
 * Créditos: Benny ⚔️
 */

const axios = require('axios');
const fs = require('fs');

module.exports = {
    name: "tiktok",
    category: 'membros',
    description: 'Baixa vídeos do TikTok sem marca d\'água.',
    aliases: ["tt", "tk"],
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const link = args[0];

        // 📂 Puxa a sua config oficial para pegar a API Key
        const config = JSON.parse(fs.readFileSync('./dono/config.json'));
        const minhaKey = config.apiGeral || "Benny_bb2026";

        if (!link || !link.includes('tiktok.com')) {
            return sock.sendMessage(from, { text: "⚠️ Soldado, cole um link válido do TikTok!" });
        }

        await sock.sendMessage(from, { react: { text: '📥', key: msg.key } });

        try {
            // 🔗 Usando a sua API da Bronxys Host
            const urlApi = `https://api.bronxyshost.com.br/api/tiktok?apikey=${minhaKey}&url=${encodeURIComponent(link)}`;
            const res = await axios.get(urlApi);

            // A Bronxys costuma retornar o link no campo 'resultado' ou 'video'
            // Ajustei para o padrão mais comum deles (video_nowm ou result)
            const videoUrl = res.data.resultado?.video_nowm || res.data.video || res.data.result;

            if (!videoUrl) {
                return sock.sendMessage(from, { text: "❌ Não encontrei o vídeo. Verifique se o perfil é público." });
            }

            await sock.sendMessage(from, { 
                video: { url: videoUrl }, 
                caption: "🎬 *TIKTOK DOWNLOADER*\n\n✅ Vídeo enviado com sucesso!\n🛡️ *API:* Bronxys Host",
                mimetype: 'video/mp4'
            }, { quoted: msg });

            await sock.sendMessage(from, { react: { text: '✅', key: msg.key } });

        } catch (e) {
            console.log("Erro TikTok Bronxys:", e.message);
            await sock.sendMessage(from, { react: { text: '❌', key: msg.key } });
            sock.sendMessage(from, { text: "⚠️ A API Bronxys encontrou um problema ou o link é inválido." });
        }
    }
};
