/**
 * Comando: idade 🎂
 * Descrição: Calcula idade exata e estimativas de vida
 */

module.exports = {
    name: "idade",
    alias: ["tempo", "nascimento"],
    category: "utilitario",
    description: "Calcula sua idade e curiosidades de tempo de vida",
    async execute(sock, msg, args, { reply, prefixo }) {
        
        const dataNasc = args.join(" ");
        if (!dataNasc) return reply(`⚔️ *MODO DE USO:*\n\nEx: *${prefixo}idade 15/05/2000*`);

        // Validação simples de formato DD/MM/AAAA
        const partes = dataNasc.split('/');
        if (partes.length !== 3) return reply("❌ Formato inválido! Use DD/MM/AAAA");

        const nasc = new Date(`${partes[2]}-${partes[1]}-${partes[0]}`);
        const hoje = new Date();
        
        if (isNaN(nasc.getTime())) return reply("❌ Data inválida. Verifique o dia, mês e ano.");

        // Cálculo da idade
        let diff = hoje - nasc;
        const anos = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
        const meses = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
        const dias = Math.floor((diff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
        
        // Conversões para curiosidades
        const totalHoras = Math.floor(diff / (1000 * 60 * 60));
        const totalMinutos = Math.floor(diff / (1000 * 60));
        
        // Estimativas (Médias biológicas)
        const respirações = totalMinutos * 16; // Média 16 respirações/min
        const batimentos = totalMinutos * 72;  // Média 72 batimentos/min
        const risadas = anos * 365 * 2;        // Estimativa simples
        const choro = totalHoras * 0.05;       // Estimativa de tempo de choro (aprox)

        const resultado = `🎂 *CRONÔMETRO DE VIDA*\n\n` +
            `📅 *Idade:* ${anos} anos, ${meses} meses e ${dias} dias.\n\n` +
            `⏱️ *Tempo total em minutos:* ${totalMinutos.toLocaleString()}\n` +
            `🫁 *Você já respirou aprox:* ${respirações.toLocaleString()} vezes.\n` +
            `❤️ *Seu coração já bateu:* ${batimentos.toLocaleString()} vezes.\n` +
            `😂 *Já deu risadas estimadas em:* ${risadas.toLocaleString()} vezes.\n` +
            `💧 *Tempo de choro (estimado):* ${Math.floor(choro)} horas.\n\n` +
            `⚔️ *AckermanBot - Protegendo sua história.*`;

        await sock.sendMessage(msg.key.remoteJid, { react: { text: '🎂', key: msg.key }});
        await reply(resultado);
    }
};
