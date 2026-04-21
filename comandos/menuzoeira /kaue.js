/**
 * ACKERMAN-BOT ⚔️
 * Comando: Homenagem ao Kauê (Zoeira Nível Hard) 😂
 * Créditos: Benny ⚔️
 */

module.exports = {
    name: 'kaue',
    category: 'diversao',
    description: 'Exibe a ficha técnica atualizada do Kauê.',
    alias: ['kauê', 'infokaue', 'recrutakaue'],
    async execute(sock, msg, args, { from, reply }) {
        
        await sock.sendMessage(from, { react: { text: '🤡', key: msg.key }});

        // --- BANCO DE DADOS DE ZOEIRA (VOCABULÁRIO ATUAL) ---
        const statusVida = [
            "Gado de premium, mas o coração é de bronze 🐮",
            "Tentando ser 'low profile' mas ninguém procura 👤❌",
            "Atleta de levantamento de copo 🍺",
            "Especialista em levar vácuo no chat 📱💨",
            "Mestre em se apaixonar por quem não presta 🤡",
            "Status: Em um relacionamento sério com a derrota 📉",
            "Procurando um neurônio que não seja de Wi-Fi 🧠📶",
            "Pensando em virar coach de como ser trouxa 💸",
            "Nível de carisma: Planta de plástico 🪴",
            "Esperando o Pix da sorte que nunca cai 🤡💸",
            "Fiel... à solteirice forçada 🔒",
            "Dando aula de como ser emocionado 🥺❤️",
            "Vivendo de baseada em fatos que ele inventou 🤥",
            "O inimigo da moda e do bom senso 👕❌"
        ];

        const frasesDeZoeira = [
            "Se o Kauê fosse um app, seria o que trava no login.",
            "O único homem que consegue ser corno sem nem namorar.",
            "Deus disse 'haja luz', mas pro Kauê ele esqueceu de ligar o disjuntor.",
            "O Kauê é igual feriado: todo mundo gosta, mas ninguém quer trabalhar com ele.",
            "Se beleza fosse imposto, o Kauê estaria recebendo restituição do governo.",
            "Ele não é burro, só tem um raciocínio que viaja de internet discada.",
            "Kauê é tipo Wi-Fi de rodoviária: até conecta, mas não serve pra nada.",
            "O cérebro dele é igual apartamento novo: tá vazio e pronto pra morar.",
            "Se burrice desse dinheiro, o Kauê já tinha comprado o WhatsApp.",
            "O shape dele é de quem treina fuga de responsabilidade.",
            "Kauê é o motivo pelo qual o shampoo vem com manual de instrução.",
            "Ele é a prova viva de que o Darwin errou em algum lugar da evolução.",
            "Se o Kauê fosse um herói, o super-poder dele seria passar vergonha.",
            "A única coisa que ele pega no grupo é ranço dos adm."
        ];

        const estatisticas = [
            { label: "🐮 Nível Gado", valor: Math.floor(Math.random() * 101) + "%" },
            { label: "🧠 QI Estimado", valor: (Math.random() * 10).toFixed(1) },
            { label: "🤘 Chifres", valor: Math.floor(Math.random() * 50) },
            { label: "🤡 Chance de ser Trouxa", valor: "99.9%" },
            { label: "💸 Saldo na Conta", valor: "R$ 0,15 e um sonho" },
            { label: "💍 Noiva do Ano", valor: "Sim (em delírio)" }
        ];

        // Sorteios
        const status = statusVida[Math.floor(Math.random() * statusVida.length)];
        const frase = frasesDeZoeira[Math.floor(Math.random() * frasesDeZoeira.length)];
        const est = estatisticas[Math.floor(Math.random() * estatisticas.length)];
        const est2 = estatisticas[Math.floor(Math.random() * estatisticas.length)];

        let homenagem = `╭━━━〔 ⚔️ *FICHA DE RECRUTA* ⚔️ 〕━━━╮\n`;
        homenagem += `┃\n`;
        homenagem += `┃ 👤 *NOME:* Kauê (O Inimitável)\n`;
        homenagem += `┃ 🎖️ *PATENTE:* O mais gay do grupo\n`;
        homenagem += `┃ 📊 *STATUS:* ${status}\n`;
        homenagem += `┃\n`;
        homenagem += `┣━━━〔 📈 *ESTATÍSTICAS* 〕\n`;
        homenagem += `┃\n`;
        homenagem += `┃ 📊 ${est.label}: [${est.valor}]\n`;
        homenagem += `┃ 📊 ${est2.label}: [${est2.valor}]\n`;
        homenagem += `┃\n`;
        homenagem += `┣━━━〔 💡 *PENSAMENTO* 〕\n`;
        homenagem += `┃\n`;
        homenagem += `┃ _"${frase}"_\n`;
        homenagem += `┃\n`;
        homenagem += `┃ 🎖️ *ACKERMAN-BOT* ⚔️\n`;
        homenagem += `╰━━━━━━━━━━━━━━━━━━━━╯\n\n`;
        homenagem += `*BY: BENNY*`;

        return reply(homenagem);
    }
};
