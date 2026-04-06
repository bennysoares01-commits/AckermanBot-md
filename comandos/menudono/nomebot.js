/**
 * Comando: nomebot 🤖
 * Pasta: menudono
 */

const fs = require('fs');

module.exports = {
    name: 'nomebot',
    category: 'menudono',
    description: 'Altera o nome do bot no sistema.',
    async execute(sock, msg, args, { from, reply, eDono }) {
        if (!eDono) return reply("⚠️ COMANDO É APENAS PARA O MEU DONO");
        
        const novoNome = args.join(" ");
        if (!novoNome) return reply("❌ Digite o novo nome. Ex: .nomebot Ackerman-MD");

        const configPath = './dono/config.json';
        let config = JSON.parse(fs.readFileSync(configPath));
        
        config.nomeBot = novoNome;
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

        return reply(`🤖 *SISTEMA ATUALIZADO:*\nMeu novo nome agora é: *${novoNome}*`);
    }
};
