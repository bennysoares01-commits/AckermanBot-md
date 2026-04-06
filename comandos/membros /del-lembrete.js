/**
 * Comando: Apagar Lembrete 🗑️
 * Função: Listar e deletar lembretes agendados pelo usuário.
 * Pasta: utilitarios
 * Créditos: Benny ⚔️
 */

const fs = require('fs');

module.exports = {
    name: 'del-lembrete',
    category: 'utilitarios',
    description: 'Apaga um lembrete que você agendou.',
    alias: ['dellerelembrete', 'remlembrete', 'apagarlembrete', 'dell'],
    async execute(sock, msg, args, { from, sender, reply, prefixo }) {
        
        const dbPath = './dono/lembretes.json';
        if (!fs.existsSync(dbPath)) return reply("⚠️ Não há nenhum lembrete agendado no momento.");

        let lembretes = JSON.parse(fs.readFileSync(dbPath));
        
        // Filtra apenas os lembretes que pertencem a quem enviou o comando
        const meusLembretes = lembretes.filter(l => l.sender === sender);

        if (meusLembretes.length === 0) {
            return reply("⚠️ Você não possui nenhum lembrete agendado para apagar.");
        }

        // Se o usuário não passou o número do lembrete, mostra a lista para ele escolher
        if (!args[0]) {
            let lista = `╭━━━〔 🗑️ *MEUS LEMBRETES* 〕━━━╮\n┃\n`;
            meusLembretes.forEach((l, i) => {
                lista += `┃ [ ${i + 1} ] - ${l.mensagem}\n`;
            });
            lista += `┃\n`;
            lista += `┃ 💡 *Para apagar, use:* \n`;
            lista += `┃ ➤ ${prefixo}del-lembrete [número]\n`;
            lista += `╰━━━━━〔 🎖️ *ACKERMAN* 〕━━━━━╯`;
            
            return reply(lista, { mentions: [sender] });
        }

        // Lógica de exclusão
        const indice = parseInt(args[0]) - 1;
        
        // Verifica se o número digitado existe na lista de quem pediu
        if (isNaN(indice) || indice < 0 || indice >= meusLembretes.length) {
            return reply("❌ Número inválido! Verifique a lista e tente novamente.");
        }

        const lembreteParaRemover = meusLembretes[indice];
        
        // Remove da lista geral usando o ID único para não apagar o de outra pessoa por erro
        const novaListaGeral = lembretes.filter(l => l.id !== lembreteParaRemover.id);
        fs.writeFileSync(dbPath, JSON.stringify(novaListaGeral, null, 2));

        await sock.sendMessage(from, { react: { text: '✅', key: msg.key }});
        return reply(`✅ *Lembrete removido com sucesso!* \n\n🗑️ *Mensagem:* ${lembreteParaRemover.mensagem}`);
    }
};
