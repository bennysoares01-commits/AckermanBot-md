/**
 * Comando: infoanime ⛩️
 * Descrição: Busca informações de animes com tradução automática.
 * Créditos: Benny ⚔️
 */

const axios = require('axios');
const { translate } = require('google-translate-api-x');

module.exports = {
    name: 'infoanime',
    category: 'diversao',
    description: 'Busca informações de um anime e mostra a sinopse em português.',
    alias: ['anime', 'searchanime'],
    async execute(sock, msg, args, { from, reply, prefixo }) {
        
        const animeNome = args.join(' ');

        if (!animeNome) {
            return reply(`⚠️ Por favor, digite o nome de um anime!\nExemplo: *${prefixo}infoanime Naruto*`);
        }

        // Reação de busca
        await sock.sendMessage(from, { react: { text: '🔍', key: msg.key }});

        try {
            // Busca os dados do anime
            const response = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(animeNome)}&limit=1`);
            const anime = response.data.data[0];

            if (!anime) {
                return reply("❌ Não encontrei nenhum anime com esse nome. Verifique se escreveu corretamente.");
            }

            // Tradução da Sinopse
            let sinopseTraduzida = "Sinopse não disponível.";
            if (anime.synopsis) {
                try {
                    const resTraducao = await translate(anime.synopsis, { to: 'pt' });
                    sinopseTraduzida = resTraducao.text;
                } catch (e) {
                    sinopseTraduzida = anime.synopsis; // Se a tradução falhar, mantém o original
                }
            }

            // Tradução simples de Status
            const statusTraduzido = anime.status === 'Finished Airing' ? 'Finalizado' : 'Em lançamento';
            
            let texto = `*⛩️ INFORMAÇÕES DO ANIME ⛩️*\n\n`;
            texto += `*🎬 Nome:* ${anime.title_english || anime.title}\n`;
            texto += `*⭐ Nota:* ${anime.score || 'Sem nota'}\n`;
            texto += `*📅 Data:* ${anime.aired.string}\n`;
            texto += `*🎞️ Episódios:* ${anime.episodes || 'Ainda saindo'}\n`;
            texto += `*📊 Status:* ${statusTraduzido}\n`;
            texto += `*🎭 Gêneros:* ${anime.genres.map(g => g.name).join(', ')}\n\n`;
            texto += `*📝 Sinopse:*\n${sinopseTraduzida.substring(0, 600)}${sinopseTraduzida.length > 600 ? '...' : ''}\n\n`;
            texto += `*© Ackerman-Bot - Criado por Benny*`;

            // Envia a imagem e o texto
            await sock.sendMessage(from, { 
                image: { url: anime.images.jpg.large_image_url }, 
                caption: texto 
            }, { quoted: msg });

            await sock.sendMessage(from, { react: { text: '✅', key: msg.key }});

        } catch (error) {
            console.log("Erro no comando infoanime:", error);
            reply("❌ Ocorreu um erro ao buscar o anime. Tente novamente mais tarde.");
        }
    }
};
