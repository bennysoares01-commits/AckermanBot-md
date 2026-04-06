/**
 * Comando: Info BV ℹ️
 * Função: Mostrar as tags de personalização.
 * Créditos: Benny ⚔️
 */

module.exports = {
    name: 'infobv',
    category: 'admin',
    description: 'Mostra como personalizar o texto de boas-vindas.',
    async execute(sock, msg, args, { reply, prefixo }) {
        
        let info = `╭━━━〔 ℹ️ *INFO BOAS-VINDAS* 〕━━━╮\n┃\n`;
        info += `┃ Personalize seu texto usando as tags:\n┃\n`;
        info += `┃ ➤ *#nomedogp#* : Nome do grupo\n`;
        info += `┃ ➤ *#nmrbot#* : Número do bot\n`;
        info += `┃ ➤ *#nmr#* : Menciona o novo membro\n`;
        info += `┃ ➤ *#prefixo#* : Prefixo do bot\n`;
        info += `┃ ➤ *#desc#* : Descrição do grupo\n`;
        info += `┃ ➤ *#time#* : Hora atual (Brasília)\n`;
        info += `┃\n`;
        info += `┃ 📝 *EXEMPLO DE USO:* \n`;
        info += `┃ ${prefixo}legendabv Olá #nmr#, seja bem-vindo ao grupo #nomedogp#! Leia a descrição: #desc#\n`;
        info += `┃\n`;
        info += `╰━━━━━〔 🎖️ *ACKERMAN* 〕━━━━━╯`;
        
        return reply(info);
    }
};
