const axios = require('axios');

module.exports = {
    name: "pinterest",
    alias: ["pin", "foto"],
    category: "pesquisa",
    description: "Busca imagens no Pinterest via Aka-API",
    async execute(sock, msg, args, { from, reply, prefixo }) {
        
        const query = args.join(" ");
        if (!query) return reply(`⚔️ *MODO DE USO:* \n\nEx: *${prefixo}pinterest Levi Ackerman*`);

        await sock.sendMessage(from, { react: { text: '🔍', key: msg.key }});

        try {
            // Usando uma API de busca com suporte a conexões mobile (mais estável no Termux)
            const res = await axios.get(`https://api.vhtear.com/pinterestvideo?query=${encodeURIComponent(query)}&apikey=SAYH-VHTEAR-9981`, {
                timeout: 10000, // 10 segundos de limite
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
                }
            });

            // Se a primeira falhar por rede, vamos pro Plano B (API alternante)
            const apiLink = `https://api.lolhuman.xyz/api/pinterest?apikey=FREE&query=${encodeURIComponent(query)}`;
            const response = await axios.get(apiLink);
            
            if (!response.data.result) return reply("❌ Não encontrei imagens no radar.");

            const imgUrl = response.data.result;

            await sock.sendMessage(from, { 
                image: { url: imgUrl }, 
                caption: `📌 *Resultado:* ${query}\n⚔️ *Elite Ackerman*` 
            }, { quoted: msg });

        } catch (e) {
            console.log("Erro de Conexão:", e.message);
            
            // PLANO C - TENTATIVA FINAL COM O BING (Sem SSL rigoroso)
            try {
                const bing = await axios.get(`https://www.bing.com/images/search?q=${encodeURIComponent(query + " pinterest")}&format=rss`, {
                    httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }) 
                });
                const match = bing.data.match(/media:content url="(.*?)"/);
                if (match) {
                    return await sock.sendMessage(from, { image: { url: match[1] }, caption: `📌 *Pinterest Result:* ${query}` }, { quoted: msg });
                }
            } catch (err) {}

            reply("⚠️ O sinal do QG está sendo bloqueado. Tente trocar do Wi-Fi para os Dados Móveis (ou vice-versa) e tente de novo!");
        }
    }
};
