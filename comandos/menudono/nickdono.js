/**
 * Comando: nickdono 👤
 * Pasta: menudono
 * Créditos: Benny ⚔️
 */

const fs = require('fs');

module.exports = {
    name: 'nickdono',
    category: 'menudono',
    description: 'Altera o seu nick no banco de dados do bot.',
    alias: ['setnick', 'meunome'],
    async execute(sock, msg, args, { from, reply, eDono }) {
        
        // Verificação de Segurança 👑
        if (!eDono) {
            return reply("⚠️ COMANDO É APENAS PARA O MEU DONO");
        }

        const novoNick = args.join(" ");
        if (!novoNick) return reply("❌ *ERRO:* Digite seu novo nick após o comando.\n\nEx: .nickdono Comandante Benny");

        // Reação de perfil atualizado
        await sock.sendMessage(from, { react: { text: '👤', key: msg.key }});

        const configPath = './dono/config.json';
        
        try {
            let config = JSON.parse(fs.readFileSync(configPath));
            
            // Atualiza o nick do dono no JSON
            config.donoNick = novoNick; 
            
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

            return reply(`👤 *PERFIL ATUALIZADO, CAPITÃO!*\n\nDe agora em diante, você será reconhecido como: *${novoNick}* ⚔️`);
        } catch (err) {
            console.log("Erro ao salvar nickdono:", err);
            return reply("❌ Ocorreu um erro ao acessar o arquivo de configuração.");
        }
    }
};
