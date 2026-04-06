/**
 * Comando: hpquiz ⚡
 * Categoria: Diversão
 * Sistema: Trava Modo Zoeira 🤡
 * Créditos: Benny ⚔️
 */

const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'hpquiz',
    category: 'diversao',
    description: 'Descubra com qual personagem de Harry Potter você se parece.',
    alias: ['hp', 'chapeuseletor'],
    async execute(sock, msg, args, { from, sender, isGroup, reply, prefixo }) {
        
        const hpQuizDir = './dono/hp_quiz';
        const dbPath = './dono/hp_database.json';
        const gruposPath = './dono/grupos.json';

        // --- 🛡️ TRAVA MODO ZOEIRA ---
        if (isGroup) {
            const dbZoeiraPath = './database/modozoeira.json'; // Ajustado para seguir seu padrão de outros comandos
            const dbZoeira = fs.existsSync(dbZoeiraPath) ? JSON.parse(fs.readFileSync(dbZoeiraPath)) : {};
            
            if (!dbZoeira[from]) {
                await sock.sendMessage(from, { react: { text: '🛡️', key: msg.key }});
                return reply("⚠️ O *MODO ZOEIRA* está desativado! Peça a um administrador para ativar.");
            }
        }

        if (!fs.existsSync(hpQuizDir)) fs.mkdirSync(hpQuizDir, { recursive: true });

        const userFile = path.join(hpQuizDir, `${sender.split('@')[0]}.json`);
        let userProgress = fs.existsSync(userFile) ? JSON.parse(fs.readFileSync(userFile)) : { stage: 0, answers: [], originGroup: "" };

        // --- 🛡️ REGISTRO DE ORIGEM & REDIRECIONAMENTO ---
        if (isGroup) {
            userProgress.originGroup = from; 
            fs.writeFileSync(userFile, JSON.stringify(userProgress));
            
            await sock.sendMessage(from, { react: { text: '⚡', key: msg.key }});
            reply("⚡ *Recruta!* O Chapéu Seletor precisa de privacidade. Te chamei no *privado* para as perguntas!");
            await sock.sendMessage(sender, { text: `👋 Olá! Vamos começar o teste de 10 perguntas? Digite *${prefixo}hpquiz* aqui no privado!` });
            return;
        }

        // --- 📝 10 PERGUNTAS SELECIONADAS ---
        const perguntas = [
            { p: "Qual Casa de Hogwarts você escolheria?", o: ["Grifinória", "Sonserina", "Corvinal", "Lufa-Lufa"] },
            { p: "Como você reagiria a uma injustiça?", o: ["Lutaria de frente", "Esperaria o momento certo", "Analisaria a lógica", "Ajudaria em silêncio"] },
            { p: "O que você mais valoriza em um amigo?", o: ["Coragem", "Ambição", "Inteligência", "Lealdade"] },
            { p: "Qual seu maior medo?", o: ["Fracassar", "Ser comum", "Ignorância", "Perder quem amo"] },
            { p: "Qual sua aula favorita em Hogwarts?", o: ["Defesa Contra Artes das Trevas", "Poções", "Adivinhação", "Trato de Criaturas Mágicas"] },
            { p: "Se visse um animal ferido na Floresta Proibida, você:", o: ["Iria salvar sem pensar", "Veria se ele tem algo valioso", "Analisaria a espécie", "Cuidaria dele com carinho"] },
            { p: "Qual posição você jogaria no Quadribol?", o: ["Apanhador", "Batedor", "Artilheiro", "Goleiro"] },
            { p: "Como você quer ser lembrado pela história?", o: ["Como um herói bravo", "Como alguém poderoso", "Como um gênio sábio", "Como uma pessoa boa"] },
            { p: "Em um duelo, qual sua estratégia?", o: ["Atacar com tudo", "Usar astúcia e defesa", "Estratégia calculada", "Proteger meus amigos"] },
            { p: "Qual objeto mágico você mais queria?", o: ["Espada de Gryffindor", "Varinha das Varinhas", "Capa da Invisibilidade", "Pedra da Ressurreição"] }
        ];

        // --- 🧪 PROCESSAR RESPOSTAS ---
        if (args.length > 0 && !isNaN(args[0])) {
            const resp = parseInt(args[0]);
            if (resp < 1 || resp > perguntas[userProgress.stage].o.length) return reply("⚠️ Opção inválida!");

            userProgress.answers.push(resp);
            userProgress.stage++;

            if (userProgress.stage < perguntas.length) {
                fs.writeFileSync(userFile, JSON.stringify(userProgress));
                return mandarMsg(sock, sender, perguntas[userProgress.stage], userProgress.stage);
            } else {
                await reply("🔮 *O Chapéu Seletor terminou a análise. O resultado será anunciado no grupo agora!*");
                
                if (!fs.existsSync(dbPath)) return reply("❌ Erro: Database de personagens não encontrada.");
                const characters = JSON.parse(fs.readFileSync(dbPath));
                
                let scores = {};
                characters.forEach(c => scores[c.id] = 0);
                const ans = userProgress.answers;
                
                // Lógica de pontuação simplificada para o veredito
                characters.forEach(c => {
                    if (c.casa === ans[0]) scores[c.id] += 20; // Peso maior para a escolha da casa
                    if (c.caracteristica === ans[2]) scores[c.id] += 10;
                    if (c.medo === ans[3]) scores[c.id] += 5;
                });

                let winID = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
                let match = characters.find(c => c.id === winID);

                const targetChat = userProgress.originGroup || sender;
                
                let res = `╭━━━〔 🔮 *VEREDITO DO CHAPÉU* 〕━━━╮\n┃\n`;
                res += `┃ 🧙‍♂️ *BRUXO:* @${sender.split('@')[0]}\n`;
                res += `┃ 🏆 *PERSONAGEM:* ${match.nome}\n┃\n`;
                res += `┃ 📝 *SINOPSE:* ${match.sinopse}\n┃\n`;
                res += `┃ 🤝 *PORQUE:* ${match.porque}\n┃\n`;
                res += `╰━━━━━〔 🎖️ *ACKERMAN* 〕━━━━━╯`;

                const foto = `./media/hp/${match.id}.jpg`;
                
                if (fs.existsSync(foto)) {
                    await sock.sendMessage(targetChat, { image: { url: foto }, caption: res, mentions: [sender] });
                } else {
                    await sock.sendMessage(targetChat, { text: res, mentions: [sender] });
                }

                if (fs.existsSync(userFile)) fs.unlinkSync(userFile);
                return;
            }
        }

        // Reinicia se o comando for dado sem argumentos
        userProgress.stage = 0;
        userProgress.answers = [];
        fs.writeFileSync(userFile, JSON.stringify(userProgress));
        mandarMsg(sock, sender, perguntas[0], 0);
    }
};

async function mandarMsg(sock, to, p, i) {
    let m = `╭━━〔 ⚡ *HP QUIZ* ⚡ 〕━━╮\n┃\n`;
    m += `┃ 📝 *PERGUNTA ${i+1} de 10*\n┃\n`; // Agora marcando "de 10"
    m += `┃ 👉 *${p.p}*\n┃\n`;
    p.o.forEach((opt, idx) => m += `┃ ${idx+1}. ${opt}\n`);
    m += `┃\n┃ ⚙️ *Responda apenas o número.*\n`;
    m += `╰━━━━━〔 🎖️ 〕━━━━━╯`;
    await sock.sendMessage(to, { text: m });
}
