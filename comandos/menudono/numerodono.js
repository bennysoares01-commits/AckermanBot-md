const fs = require('fs');

module.exports = {
    name: 'numerodono',
    alias: ['setdono', 'setowner'],
    category: 'menudono',
    execute: async (sock, msg, args, { from, reply, eDono, mentions }) => {
        // Verifica se quem está usando é o Dono ou o próprio Bot (Chave Mestra)
        if (!eDono) return reply("⚠️ COMANDO É APENAS PARA O MEU DONO");

        // Pega o ID de quem foi marcado ou de quem você respondeu a mensagem
        let target = mentions[0] || (msg.message.extendedTextMessage?.contextInfo?.participant);

        if (!target) {
            return reply("❌ Marque alguém ou responda a uma mensagem para definir como novo dono!");
        }

        const configPath = './dono/config.json';
        
        try {
            let config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

            // Salva o número limpo (apenas dígitos)
            config.numeroDono = target.split('@')[0].split(':')[0];
            // Salva o ID bruto (essencial para reconhecer o @lid)
            config.donoLid = target; 

            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

            await sock.sendMessage(from, { react: { text: '✅', key: msg.key }});
            
            return reply(`✅ *NOVO DONO REGISTRADO!* ⚔️\n\n` +
                         `👤 *ID:* ${target}\n` +
                         `📱 *Número:* ${config.numeroDono}\n\n` +
                         `_Agora este número tem acesso total aos comandos do Ackerman-Bot._`);

        } catch (e) {
            console.log(e);
            return reply("❌ Erro ao acessar o arquivo config.json");
        }
    }
};
