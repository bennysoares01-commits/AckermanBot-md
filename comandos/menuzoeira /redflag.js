/**
 * ACKERMAN-BOT ⚔️
 * Comando: Red Flag / Termômetro de Toxicidade
 * Versão: Atualizada com comando delrf
 * Créditos: Benny ⚔️
 */

const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'redflag',
    category: 'diversao',
    description: 'Mede o seu nível de toxicidade e Red Flags.',
    alias: ['toxic', 'perigo', 'flag', 'delrf', 'deletarredflag'],
    async execute(sock, msg, args, { from, sender, isGroup, reply, prefixo, db, command }) {
        
        const rfDir = './dono/redflag_quiz';
        if (!fs.existsSync(rfDir)) fs.mkdirSync(rfDir, { recursive: true });
        const userFile = path.join(rfDir, `${sender.split('@')[0]}.json`);

        // --- 🗑️ LÓGICA PARA DELETAR REDFLAG (delrf) ---
        if (command === 'delrf' || command === 'deletarredflag') {
            if (fs.existsSync(userFile)) {
                fs.unlinkSync(userFile);
                await sock.sendMessage(from, { react: { text: '🗑️', key: msg.key }});
                return reply("✅ *SESSÃO ENCERRADA!* Seu progresso no teste Red Flag foi deletado com sucesso.");
            } else {
                return reply("❌ Você não tem nenhum teste em andamento para deletar.");
            }
        }
        
        // --- 🛡️ TRAVA MODO ZOEIRA ---
        if (isGroup) {
            const zoeiraPath = './database/modozoeira.json';
            const dbZoeira = fs.existsSync(zoeiraPath) ? JSON.parse(fs.readFileSync(zoeiraPath)) : {};
            
            if (!dbZoeira[from]) return reply("⚠️ O MODO ZOEIRA ESTÁ DESATIVADO NESTE GRUPO!");
        }

        // Carrega ou inicia o progresso do usuário
        let progress = fs.existsSync(userFile) ? JSON.parse(fs.readFileSync(userFile)) : { stage: 0, points: 0, originGroup: "" };

        // --- LÓGICA DE MIGRAÇÃO GRUPO -> PRIVADO ---
        if (isGroup) {
            progress.originGroup = from; 
            fs.writeFileSync(userFile, JSON.stringify(progress));
            
            await reply("🚩 *RECRUTA!* Vou analisar seu histórico no *privado* para não expor seus podres no grupo agora.");
            await sock.sendMessage(sender, { text: `🚩 Digite *${prefixo}redflag* para começar o seu teste de perfil!\n\n💡 Caso queira parar, digite *${prefixo}delrf*` });
            return;
        }

        // --- BANCO DE PERGUNTAS ---
        const perguntas = [
            { p: "1️⃣ Você costuma olhar o celular do parceiro(a) escondido?", o: ["Nunca, confio 100%", "Só se ele(a) der mole", "Sempre, é meu direito", "Eu sou o próprio espião"] },
            { p: "2️⃣ Quando você erra em uma briga, você:", o: ["Peço desculpas na hora", "Mudo de assunto", "Inverto a culpa", "Me faço de vítima até o outro pedir desculpa"] },
            { p: "3️⃣ Seu amigo(a) sai sem te avisar. O que você faz?", o: ["Nada, ele é livre", "Fico com um pouco de ranço", "Ligo 50 vezes e cobro", "Posto indireta pesada no status"] },
            { p: "4️⃣ Você já criou perfil fake para stalkear alguém?", o: ["Jamais", "Uma vez por curiosidade", "Tenho 3 ativos agora", "Sou o mestre do stalk digital"] },
            { p: "5️⃣ Se alguém termina com você, você:", o: ["Sigo minha vida", "Bloqueio em tudo", "Vou atrás tirar satisfação", "Prometo vingança eterna"] }
        ];

        // --- PROCESSAMENTO DE RESPOSTA ---
        if (args.length > 0 && !isNaN(args[0])) {
            const resp = parseInt(args[0]);
            if (resp < 1 || resp > 4) return reply("⚠️ Escolha uma opção de 1 a 4!");

            // Pontuação: Opção 1 (0 pts) até Opção 4 (25 pts por pergunta)
            progress.points += (resp - 1) * 8.34; 
            progress.stage++;

            if (progress.stage < perguntas.length) {
                fs.writeFileSync(userFile, JSON.stringify(progress));
                return mandarPergunta(sock, sender, perguntas[progress.stage], progress.stage);
            } else {
                // --- FINALIZAÇÃO E RESULTADO ---
                await reply("📊 *Analisando suas respostas e calculando o nível de perigo...*");

                const dbPath = './dono/redflag_database.json';
                if (!fs.existsSync(dbPath)) return reply("❌ Erro: Database de Red Flags não encontrada!");
                
                const niveis = JSON.parse(fs.readFileSync(dbPath));
                const totalPct = Math.min(Math.round(progress.points), 100); 
                
                // Busca o nível correspondente na database gigante
                const match = niveis.find(n => totalPct >= n.range[0] && totalPct <= n.range[1]) || niveis[niveis.length - 1];

                const target = progress.originGroup || sender;
                
                let res = `╭━━━〔 🚩 *AVALIAÇÃO DE PERFIL* 〕━━━╮\n┃\n`;
                res += `┃ 👤 *RECRUTA:* @${sender.split('@')[0]}\n`;
                res += `┃ ☢️ *PONTUAÇÃO:* ${totalPct}%\n`;
                res += `┃ 🏆 *STATUS:* ${match.nivel}\n┃\n`;
                res += `┃ 📝 *ANÁLISE:* ${match.desc}\n┃\n`;
                res += `┃ 💡 *CONSELHO:* ${match.conselho}\n┃\n`;
                res += `╰━━━━━〔 🎖️ *BY BENNY* 〕━━━━━╯`;

                const fotoPath = './media/redflag.jpg';
                
                if (fs.existsSync(fotoPath)) {
                    await sock.sendMessage(target, { image: fs.readFileSync(fotoPath), caption: res, mentions: [sender] });
                } else {
                    await sock.sendMessage(target, { text: res, mentions: [sender] });
                }

                if (progress.originGroup) {
                    await reply("✅ *Avaliação finalizada!* O resultado foi enviado diretamente para o grupo.");
                }

                if (fs.existsSync(userFile)) fs.unlinkSync(userFile); 
                return;
            }
        }

        // --- INÍCIO DO TESTE ---
        progress.stage = 0;
        progress.points = 0;
        fs.writeFileSync(userFile, JSON.stringify(progress));
        mandarPergunta(sock, sender, perguntas[0], 0);
    }
};

async function mandarPergunta(sock, to, p, i) {
    let m = `╭━━〔 🚩 *TESTE RED FLAG* 🚩 〕━━╮\n┃\n`;
    m += `┃ 📝 *PERGUNTA ${i+1} de 5*\n┃\n`;
    m += `┃ 👉 *${p.p}*\n┃\n`;
    p.o.forEach((opt, idx) => m += `┃ ${idx+1}. ${opt}\n`);
    m += `┃\n┃ ⚙️ *Responda apenas o número da opção.*\n`;
    m += `╰━━━━━〔 🎖️ 〕━━━━━╯`;
    await sock.sendMessage(to, { text: m });
}
