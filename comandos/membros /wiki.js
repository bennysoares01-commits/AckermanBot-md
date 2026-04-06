/**
 * ACKERMAN-BOT ⚔️
 * Comando: Wikipedia 🔍
 * Versão: 6.0 (Totalmente Blindada - Anti-403)
 * Créditos: Benny ⚔️
 */

const axios = require('axios');

module.exports = {
    name: 'wiki',
    category: 'membros',
    description: 'Pesquisa resumos na Wikipedia.',
    alias: ['wikipedia', 'w'],
    async execute(sock, msg, args, { from, reply }) {
        
        // Verifica se o usuário digitou o que pesquisar
        if (args.length === 0) {
            return reply("⚠️ Digite o que deseja pesquisar.\nExemplo: *.wiki Levi Ackerman*");
        }

        // Prepara o termo (substitui espaços por underlines para a API)
        const termo = encodeURIComponent(args.join('_'));
        
        // Reação de busca
        await sock.sendMessage(from, { react: { text: '🔍', key: msg.key }});

        try {
            // Requisição com Cabeçalhos de Navegador Real (Resolve o erro 403)
            const { data } = await axios.get(`https://pt.wikipedia.org/api/rest_v1/page/summary/${termo}`, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                    'Accept': 'application/json'
                }
            });

            // Montagem do Menu de Resposta (Estilo Ackerman)
            let wikiMsg = `╭━━━〔 🔍 *RESULTADO WIKI* 〕━━━╮\n`;
            wikiMsg += `┃\n`;
            wikiMsg += `┃ 📚 *TÍTULO:* ${data.title}\n`;
            wikiMsg += `┃\n`;
            wikiMsg += `┃ 📖 *RESUMO:* \n${data.extract}\n`;
            wikiMsg += `┃\n`;
            wikiMsg += `┃ 🔗 *LINK:* ${data.content_urls.desktop.page}\n`;
            wikiMsg += `┃\n`;
            wikiMsg += `┃ 🎖️ *ACKERMAN-BOT* ⚔️\n`;
            wikiMsg += `╰━━━━━━━━━━━━━━━━━━━━╯`;

            // Se a Wikipedia tiver uma imagem, envia com foto. Se não, envia apenas texto.
            if (data.thumbnail && data.thumbnail.source) {
                await sock.sendMessage(from, { 
                    image: { url: data.thumbnail.source }, 
                    caption: wikiMsg 
                }, { quoted: msg });
            } else {
                return reply(wikiMsg);
            }

        } catch (err) {
            // Tratamento de Erros Silencioso (Para não floodar o Termux)
            if (err.response && err.response.status === 404) {
                return reply("❌ Não encontrei nenhum resultado para essa pesquisa. Tente ser mais específico.");
            }
            
            console.log(`[ACKERMAN WIKI] Erro na requisição: ${err.message}`);
            return reply("❌ O servidor da Wikipedia recusou a conexão ou o termo é inválido. Tente novamente.");
        }
    }
};
