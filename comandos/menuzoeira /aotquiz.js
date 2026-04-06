const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'aotquiz',
    category: 'diversao',
    description: 'Descubra quem você seria em Shingeki no Kyojin.',
    alias: ['tropa', 'shingeki', 'aot'],
    async execute(sock, msg, args, { from, sender, isGroup, reply, prefixo, db }) {
        
        // Trava Modo Zoeira (Padrão Benny)
        if (isGroup) {
            const gruposPath = './dono/grupos.json';
            if (fs.existsSync(gruposPath)) {
                const grupos = JSON.parse(fs.readFileSync(gruposPath));
                if (grupos[from]?.modozoeira === false) return reply("⚠️ MODO ZOEIRA OFF!");
            }
        }

        const aotDir = './dono/aot_quiz';
        if (!fs.existsSync(aotDir)) fs.mkdirSync(aotDir, { recursive: true });

        const userFile = path.join(aotDir, `${sender.split('@')[0]}.json`);
        let progress = fs.existsSync(userFile) ? JSON.parse(fs.readFileSync(userFile)) : { stage: 0, answers: [], originGroup: "" };

        if (isGroup) {
            progress.originGroup = from;
            fs.writeFileSync(userFile, JSON.stringify(progress));
            await reply("⚔️ *Recruta!* Teste de aptidão física e mental no *privado*. Vá agora!");
            await sock.sendMessage(sender, { text: `⚔️ Digite *${prefixo}aotquiz* para iniciar o recrutamento!` });
            return;
        }

        const perguntas = [
            { p: "1️⃣ Qual sua maior motivação?", o: ["Disciplina/Dever", "Liberdade Absoluta", "Proteger alguém", "Entender o mundo"] },
            { p: "2️⃣ Diante de um Titã de 15 metros, o que você faz?", o: ["Ataco os tendões", "Vou direto na nuca", "Espero ordens", "Crio uma armadilha"] },
            { p: "3️⃣ O que é necessário para mudar o mundo?", o: ["Liderança forte", "Poder destrutivo", "Sacrifício pessoal", "Conhecimento técnico"] },
            { p: "4️⃣ Como você lida com a perda de um companheiro?", o: ["Limpo a lâmina e sigo", "Entro em fúria", "Me culpo eternamente", "Analiso o erro para não repetir"] },
            { p: "5️⃣ Qual sua comida favorita na tropa?", o: ["Chá", "Carne", "Pão", "Batata"] }
        ];

        if (args.length > 0 && !isNaN(args[0])) {
            const resp = parseInt(args[0]);
            if (resp < 1 || resp > 4) return reply("⚠️ Escolha de 1 a 4!");

            progress.answers.push(resp);
            progress.stage++;

            if (progress.stage < perguntas.length) {
                fs.writeFileSync(userFile, JSON.stringify(progress));
                return mandarAot(sock, sender, perguntas[progress.stage], progress.stage);
            } else {
                await reply("🥁 *Processando resultados da Tropa de Exploração...*");
                
                const dbPath = './dono/aot_database.json';
                if (!fs.existsSync(dbPath)) return reply("❌ Erro: Database AOT sumiu!");
                const characters = JSON.parse(fs.readFileSync(dbPath));
                
                let scores = {};
                characters.forEach(c => scores[c.id] = 0);
                
                // Lógica de Peso
                characters.forEach(c => {
                    if (c.perfil === progress.answers[0]) scores[c.id] += 10;
                    if (c.valor === progress.answers[2]) scores[c.id] += 5;
                });

                let winID = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
                let match = characters.find(c => c.id === winID);

                const target = progress.originGroup || sender;
                let res = `╭━━━〔 ⚔️ *RESULTADO DA TROPA* 〕━━━╮\n┃\n`;
                res += `┃ 🎖️ *RECRUTA:* @${sender.split('@')[0]}\n`;
                res += `┃ 👤 *PERSONAGEM:* ${match.nome}\n┃\n`;
                res += `┃ 📜 *PERFIL:* ${match.sinopse}\n┃\n`;
                res += `┃ 💡 *PORQUE:* ${match.porque}\n┃\n`;
                res += `╰━━━━━〔 🎖️ *ACKERMAN* 〕━━━━━╯`;

                const foto = `./media/aot/${match.id}.jpg`;
                if (fs.existsSync(foto)) {
                    await sock.sendMessage(target, { image: { url: foto }, caption: res, mentions: [sender] });
                } else {
                    await sock.sendMessage(target, { text: res, mentions: [sender] });
                }

                fs.unlinkSync(userFile);
                return;
            }
        }

        progress.stage = 0;
        progress.answers = [];
        fs.writeFileSync(userFile, JSON.stringify(progress));
        mandarAot(sock, sender, perguntas[0], 0);
    }
};

async function mandarAot(sock, to, p, i) {
    let m = `╭━━〔 ⚔️ *AOT QUIZ* ⚔️ 〕━━╮\n┃\n`;
    m += `┃ 📝 *TESTE ${i+1} de 5*\n┃\n`;
    m += `┃ 👉 *${p.p}*\n┃\n`;
    p.o.forEach((opt, idx) => m += `┃ ${idx+1}. ${opt}\n`);
    m += `┃\n┃ ⚙️ *Responda apenas o número.*\n`;
    m += `╰━━━━━〔 🎖️ 〕━━━━━╯`;
    await sock.sendMessage(to, { text: m });
}
