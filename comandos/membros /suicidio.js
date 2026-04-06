module.exports = {
    name: "suicidio",
    alias: ["sair", "mebanir", "suicidar"],
    category: "diversao",
    description: "O usuário se bane do grupo por vontade própria",
    async execute(sock, msg, args, { from, reply, sender, isGroup, isBotAdmin }) {
        
        if (!isGroup) return reply("⚠️ Este comando só pode ser usado em grupos!");
        if (!isBotAdmin) return reply("⚠️ Eu preciso ser administrador para te banir!");

        await sock.sendMessage(from, { react: { text: '💀', key: msg.key }});

        const despedida = [
            "🌹 *Um soldado entregou seu coração... Adeus.*",
            "⚰️ *Foi uma honra lutar ao seu lado.*",
            "💀 *O destino foi cruel, mas a escolha foi sua.*",
            "🚪 *Portas abertas para quem deseja partir.*"
        ];
        
        const frase = despedida[Math.floor(Math.random() * despedida.length)];
        
        await reply(`${frase}\n\n@${sender.split('@')[0]} será removido em 3 segundos...`);

        setTimeout(async () => {
            await sock.groupParticipantsUpdate(from, [sender], "remove");
        }, 3000);
    }
};
