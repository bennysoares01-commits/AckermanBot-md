/**
 * Comando: Informações do Bot 🤖
 * Função: Detalhes técnicos e homenagem ao Capitão Levi.
 * Pasta: membros
 * Créditos: Benny ⚔️
 */

module.exports = {
    name: 'infobot',
    category: 'membros',
    description: 'Mostra informações detalhadas sobre o Ackerman-Bot.',
    alias: ['botinfo', 'ackerman', 'sobre'],
    async execute(sock, msg, args, { from, reply, prefixo }) {
        
        // --- CÁLCULO DE UPTIME (Tempo Online) ---
        const segundos = process.uptime();
        const dias = Math.floor(segundos / (24 * 3600));
        const horas = Math.floor((segundos % (24 * 3600)) / 3600);
        const minutos = Math.floor((segundos % 3600) / 60);
        const uptime = `${dias}d ${horas}h ${minutos}m`;

        // --- DESIGN DO MENU ---
        let info = `╭━━━〔 🤖 *ACKERMAN-BOT* ⚔️ 〕━━━╮\n┃\n`;
        info += `┃ 🎖️ *PROJETO:* Ackerman-Bot-md\n`;
        info += `┃ 📅 *CRIADO EM:* 10 de Dezembro de 2025\n`;
        info += `┃ 👤 *CRIADOR:* Benny ⚔️\n`;
        info += `┃ ⚡ *TEMPO ATIVO:* ${uptime}\n`;
        info += `┃\n`;
        info += `┣━━━〔 🛡️ *O CAPITÃO* 〕━━━\n`;
        info += `┃\n`;
        info += `┃  *Levi Ackerman* é o soldado mais forte\n`;
        info += `┃  da humanidade. Líder do Esquadrão de\n`;
        info += `┃  Operações Especiais, ele é conhecido\n`;
        info += `┃  por sua frieza em combate, agilidade\n`;
        info += `┃  surpreendente e lealdade aos seus.\n`;
        info += `┃\n`;
        info += `┣━━━〔 📜 *INSPIRAÇÃO* 〕━━━\n`;
        info += `┃\n`;
        info += `┃  Este bot foi criado porque *AOT* é o\n`;
        info += `┃  anime favorito do Benny, e o Levi é\n`;
        info += `┃  seu personagem preferido. A eficiência\n`;
        info += `┃  e a precisão do Capitão são a base\n`;
        info += `┃  para o funcionamento deste sistema.\n`;
        info += `┃\n`;
        info += `┣━━━〔 🗡️ *DISCIPLINA* 〕━━━\n`;
        info += `┃\n`;
        info += `┃ ⚔️ *Arsenal:* ${global.commands.size} comandos prontos\n`;
        info += `┃ 🗂️ *Categorias:* Administradores, Membros e Jogos\n`;
        info += `┃ 🛡️ *Objetivo:* Trazer ordem e diversão aos grupos\n`;
        info += `┃\n`;
        info += `╰━━━━━〔 🎖️ *ACKERMAN* 🎖️ 〕━━━━━╯\n\n`;
        info += `💬 _"A única coisa que nos é permitida fazer é acreditar que não nos arrependeremos da escolha que fizemos."_`;

        await sock.sendMessage(from, { react: { text: '🎖️', key: msg.key }});
        return reply(info);
    }
};
