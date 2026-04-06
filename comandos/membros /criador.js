/**
 * Comando: criador ⚔️
 * Pasta: info
 * Créditos: Benny ⚔️
 */

const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'criador',
    category: 'info',
    description: 'Mostra as informações do desenvolvedor do bot.',
    alias: ['dono', 'developer', 'benny'],
    async execute(sock, msg, args, { from, reply }) {
        
        // Reação de respeito ao criador
        await sock.sendMessage(from, { react: { text: '⚔️', key: msg.key }});

        // Caminho da foto do criador (opcional, se você tiver uma sua na pasta media)
        const fotoCriador = path.resolve('./media/criador.jpg'); 

        let texto = `*╭━〔 ⚔️ ACKERMAN CREATOR ⚔️ 〕━╮*\n\n`;
        texto += `Olá! Eu sou o *Ackerman-Bot*. 🤖\n\n`;
        texto += `O gênio por trás dos meus comandos e da minha inteligência se chama *Benny*. 👨‍💻\n\n`;
        texto += `Ele é um desenvolvedor focado em criar experiências únicas no WhatsApp. Se você curtiu o meu desempenho, quer fazer novas amizades ou tem interesse em adquirir um bot personalizado como eu para o seu grupo, o Benny é o cara certo! 🚀\n\n`;
        
        texto += `*📌 CONTATOS OFICIAIS:* \n`;
        texto += `*📱 WhatsApp:* +55 91 8162-6178\n`;
        texto += `*📸 Instagram:* @bennysuarezzz\n\n`;
        
        texto += `*💡 Por que falar com ele?*\n`;
        texto += `• Comprar bots exclusivos 🤖\n`;
        texto += `• Tirar dúvidas técnicas 🛠️\n`;
        texto += `• Parcerias e amizades 🤝\n\n`;
        
        texto += `*╰━━〔 🎖️ ACKERMAN ELITE 🎖️ 〕━━╯*\n\n`;
        texto += `_“A força não vem da capacidade física, mas de uma vontade indomável.”_`;

        // Se existir uma foto sua, ele envia com a legenda. Se não, envia só o texto.
        if (fs.existsSync(fotoCriador)) {
            return sock.sendMessage(from, { 
                image: { url: fotoCriador }, 
                caption: texto,
                mentions: ['559181626178@s.whatsapp.net']
            }, { quoted: msg });
        } else {
            return reply(texto, { mentions: ['559181626178@s.whatsapp.net'] });
        }
    }
};
