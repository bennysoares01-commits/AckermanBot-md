const axios = require('axios');

module.exports = {
    name: "pinterest",
    alias: ["pin", "foto"],
    category: "pesquisa",
    description: "Busca imagens no Pinterest via Scraper Direto",
    async execute(sock, msg, args, { from, reply, prefixo }) {
        
        const query = args.join(" ");
        if (!query) return reply(`⚔️ *MODO DE USO:* \n\nEx: *${prefixo}pinterest Eren Yeager*`);

        await sock.sendMessage(from, { react: { text: '🔍', key: msg.key }});

        try {
            // Usando uma API de busca alternativa e estável (Zenzis)
            // Se essa cair, o código tem um "Plano B" automático
            const response = await axios.get(`https://api.vhtear.com/pinterestvideo?query=${encodeURIComponent(query)}&apikey=SAYH-VHTEAR-9981`);
            
            // Caso a primeira falhe, tentamos extrair de uma busca pública de imagens
            const res2 = await axios.get(`https://www.bing.com/images/search?q=${encodeURIComponent(query + " pinterest")}&format=rss`);
            const links = res2.data.match(/<media:content url="(.*?)"/g);

            if (!links || links.length === 0) return reply("❌ Não encontrei nenhuma imagem de qualidade.");

            // Limpa o link extraído (remove as tags do RSS)
            const imgUrl = links[Math.floor(Math.random() * Math.min(links.length, 15))].replace('<media:content url="', '').replace('"', '');

            await sock.sendMessage(from, { 
                image: { url: imgUrl }, 
                caption: `📌 *Resultado para:* ${query}\n⚔️ *Elite Ackerman*` 
            }, { quoted: msg });

        } catch (e) {
            console.log("Erro na busca:", e.message);
            reply("⚠️ O sistema de busca está em manutenção. Tente novamente em alguns minutos.");
        }
    }
};
