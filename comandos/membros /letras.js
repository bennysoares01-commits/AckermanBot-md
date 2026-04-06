/**
 * ACKERMAN-BOT ⚔️
 * Comando: Buscar Letra de Música 🎵
 * Créditos: Benny ⚔️
 */

const axios = require('axios');
const fs = require('fs');

module.exports = {
    name: 'letra',
    category: 'membros',
    description: 'Busca a letra de uma música específica.',
    alias: ['lyrics', 'lyric', 'letrademusica'],
    async execute(sock, msg, args, { from, reply, prefixo }) {
        
        // Verifica se o usuário passou o nome da música
        if (args.length === 0) return reply(`❓ *RECRUTA!* Como vou buscar se você não me deu o nome da música?\n\nExemplo: *${prefixo}letra Linkin Park Numb*`);

        const query = args.join(' ');
        
        // Reação de busca
        await sock.sendMessage(from, { react: { text: '🔍', key: msg.key }});

        try {
            // Usando a API do Lyrics.ovh para busca direta
            // Nota: Para resultados mais precisos, o ideal é o usuário digitar "Artista Musica"
            const response = await axios.get(`https://api.lyrics.ovh/suggest/${encodeURIComponent(query)}`);
            const musica = response.data.data[0];

            if (!musica) return reply("❌ *ERRO:* Não encontrei nenhuma música com esse nome. Verifique se escreveu corretamente.");

            const artista = musica.artist.name;
            const titulo = musica.title;
            const capa = musica.album.cover_medium;

            // Busca a letra real agora
            const lyricResponse = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(artista)}/${encodeURIComponent(titulo)}`);
            const letra = lyricResponse.data.lyrics;

            if (!letra) return reply(`😔 Encontrei a música *${titulo}*, mas ela não possui letra disponível na base de dados.`);

            let res = `╭━━━〔 🎵 *LETRA DE MÚSICA* 〕━━━╮\n┃\n`;
            res += `┃ 🎸 *ARTISTA:* ${artista}\n`;
            res += `┃ 🎶 *MÚSICA:* ${titulo}\n┃\n`;
            res += `┃ 📝 *LETRA:* \n\n${letra}\n┃\n`;
            res += `┃ 🎖️ *ACKERMAN-BOT* ⚔️\n`;
            res += `╰━━━━━〔 🎖️ 〕━━━━━╯`;

            // Envia com a capa do álbum se existir
            if (capa) {
                await sock.sendMessage(from, { image: { url: capa }, caption: res }, { quoted: msg });
            } else {
                await sock.sendMessage(from, { text: res }, { quoted: msg });
            }

            await sock.sendMessage(from, { react: { text: '✅', key: msg.key }});

        } catch (error) {
            console.error("Erro no comando letra:", error);
            return reply("❌ *ERRO:* Ocorreu um problema ao conectar com o servidor de letras. Tente novamente mais tarde.");
        }
    }
};
