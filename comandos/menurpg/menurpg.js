/**
 * Comando: Menu RPG 📜
 * Descrição: Lista os comandos da categoria RPG.
 * Créditos: Benny ⚔️
 */

module.exports = {
    name: 'menurpg',
    category: 'menurpg',
    description: 'Lista todos os comandos do sistema de RPG.',
    alias: ['rpghelp', 'comandosrpg'],
    async execute(sock, msg, args, { from, reply, prefixo }) {
        
        let menu = `╭━━━〔 🛡️ *ACKERMAN RPG* 〕━━━╮\n`;
        menu += `│\n`;
        menu += `│ 📜 *COMANDOS DISPONÍVEIS:* \n`;
        menu += `│\n`;
        menu += `│ ⚔️ *${prefixo}st* - Ver seus status.\n`;
        menu+=  `│ 🤕 *${prefixo}curar* - se cure.\n`;
        menu += `│ 🪵 *${prefixo}coletar* - Buscar recursos.\n`;
        menu += `│ 🏹 *${prefixo}cacar* - Enfrentar monstros.\n`;
        menu += `│ 🏪 *${prefixo}loja* - Comprar equipamentos.\n`;
        menu += `│ 🎒 *${prefixo}mochila* - Ver seus itens.\n`;
        menu += `│\n`;
        menu += `│ ✨ _Evolua seu personagem e se torne_\n`;
        menu += `│ _um mestre no sistema Ackerman!_\n`;
        menu += `│\n`;
        menu += `╰━━━━━━━━━━━━━━━━━━━━╯`;

        await sock.sendMessage(from, { react: { text: '📜', key: msg.key }});
        return reply(menu);
    }
};
