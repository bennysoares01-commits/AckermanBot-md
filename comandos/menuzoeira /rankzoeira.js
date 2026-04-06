/**
 * Comando: Ranks de Zoeira 📊 (Versão Blindada)
 * Créditos: Benny ⚔️
 */

const fs = require('fs');

module.exports = {
    name: 'rankzoeira',
    category: 'diversao',
    description: 'Exibe os maiores do grupo.',
    alias: ['rankgay', 'rankgado', 'rankcorno', 'rankpau', 'rankbct', 'rankbuceta'],
    async execute(sock, msg, args, { from, isGroup, reply }) {
        try {
            if (!isGroup) return reply("❌ Apenas em grupos, soldado!");

            // --- 🛡️ TRAVA DE SEGURANÇA: MODO ZOEIRA ---
            const dbZoeiraPath = './database/modozoeira.json';
            const dbZoeira = fs.existsSync(dbZoeiraPath) ? JSON.parse(fs.readFileSync(dbZoeiraPath)) : {};

            if (!dbZoeira[from]) {
                await sock.sendMessage(from, { react: { text: '🛡️', key: msg.key }});
                return reply("⚠️ *MODO ZOEIRA NÃO ESTÁ ATIVADO!* \n\nPeça para algum administrador ativar com: *modozoeira on*");
            }
            // ------------------------------------------

            // Captura qual comando foi usado pelo nome ou alias
            const comandoUsado = (msg.message?.conversation || 
                                 msg.message?.extendedTextMessage?.text || 
                                 "").toLowerCase();

            const groupMetadata = await sock.groupMetadata(from);
            const participantes = groupMetadata.participants.map(p => p.id);
            const shuffle = (array) => array.sort(() => Math.random() - 0.5);
            const escolhidos = shuffle(participantes).slice(0, 5);
            
            let config = { titulo: "", emoji: "", frases: [] };

            if (comandoUsado.includes('gay')) {
                config = { titulo: "RANK DOS GAYS", emoji: "🏳️‍🌈", frases: ["Nível: Purpurina extrema", "Já nasceu com o brilho", "O orgulho da tropa", "Não esconde de ninguém", "Daria tudo por um batom", "Vira o olho quando vê um bofe", "Rainha do camarote", "Solta a franga no grupo", "Sentou e gostou", "O capitão tá de olho nesse brilho", "Arco-íris humano", "Fã número 1 da Pabllo", "Engole espada no tempo livre", "Sempre o primeiro da fila no desfile", "O verdadeiro significado de 'babado'", "Cuidado: ele morde a fronha", "Ama um canudo grosso", "Já reservou o camarote na parada", "Queima o arroz e a rosca", "Divo absoluto do grupo", "Não pode ver um bofe de farda", "Sua cor favorita é 'todas'", "A fada madrinha do grupo", "Bota a cara no sol, mana", "Expert em maquiagem e bofes", "O rei da passarela", "Sabe o nome de todos os atores", "Diz que é hétero mas o olhar entrega", "Mais rodada que prato de micro-ondas", "O terror dos vestiários"] };
            } else if (comandoUsado.includes('gado')) {
                config = { titulo: "RANK DOS GADOS", emoji: "🐂", frases: ["Muge pro @ da pessoa", "Já comprou o berrante", "Especialista em gafar", "O pasto é o limite", "Não pode ver um 'oi' que já quer casar", "Lambe o chão que ela pisa", "Investe tudo e recebe vácuo", "O rei do gado de 2026", "Escravo de buceta", "Faz o PIX e não ganha nem foto", "Trabalha pra pagar o lanche dela", "O herói que ela ignora", "Vira tapete pra ela passar", "Manda 'bom dia' todo dia no vácuo", "Já foi bloqueado 10 vezes e insiste", "Coração de manteiga e chifre de touro", "O maior fã do OnlyFans dela", "Troca os amigos por 5 min de atenção", "Chora ouvindo sertanejo", "O Uber oficial da cremosa", "Paga a conta e ela sai com outro", "Defende ela até quando ela tá errada", "O verdadeiro 'gado de estimação'", "Mais fiel que cachorro, mais bobo que gado", "Sabe até o CPF dela, mas ela não sabe o nome dele", "O mestre em tomar 'não'", "Sonha com o altar, acorda com o chifre", "Muge quando ela posta foto", "Pede desculpa por ela ter traído", "O pastor do rebanho"] };
            } else if (comandoUsado.includes('corno')) {
                config = { titulo: "RANK DOS CORNOS", emoji: "🤘", frases: ["O chifre arrasta no chão", "Já é sócio da fazenda", "O último a saber", "Não passa na porta", "A testa tá brilhando", "O boi da tropa", "Leva gaia e pede desculpa", "A mulher tá com outro e ele tá no bot", "Cabeça de antena", "Se cair de quatro começa a pastar", "O verdadeiro Touro Bandido", "Leva chifre e agradece", "A mulher diz que é 'primo' e ele acredita", "O chifre é tão grande que pega Wi-Fi", "Usa o chifre pra abrir lata de cerveja", "O corno manso do grupo", "A testa parece um outdoor", "Já mandou o amante dela pro grupo", "A mulher viaja e ele fica feliz", "O chifre é a maior virtude dele", "Corno de elite, missão dada é gaia levada", "Se chover ele não se molha, o chifre serve de guarda-chuva", "O capitão dos cornos", "Não entra em avião pra não furar o teto", "Paga o motel pra ela e pro Ricardão", "O mestre do autoengano", "A testa tá mais pesada que a consciência", "Corno oficial com selo de qualidade", "O boi que fala", "Já decorou o teto do quarto do amante"] };
            } else if (comandoUsado.includes('pau')) {
                config = { titulo: "RANK DO TAMANHO", emoji: "🍆", frases: ["Tão grande que bate na lua", "Assusta até o Titã Colossal", "Na média (ou quase)", "É pequeno mas é trabalhador", "Tão pequeno que nem coça", "Parece uma azeitona com cabinho", "Usa lupa pra achar na hora de mijar", "Anaconda humana", "O terror das novinhas", "Tão fino que parece um macarrão cru", "O apelido é micro-ondas: esquenta mas não entra", "Precisa de um guindaste pra levantar", "É só a cabeça e o resto é pescoço", "Tão grande que precisa de um carrinho de mão", "Dá pra usar como vara de pescar", "O verdadeiro tripé", "Mais murcho que pneu furado", "Pequeno mas com raiva", "O pesadelo do ginecologista", "Dá pra usar de gravata", "Tão pequeno que parece um botão de camisa", "O 'Kid Bengala' do grupo (só que ao contrário)", "Enrola na perna pra caminhar", "Parece um mindinho de bebê", "Tão fino que passa em buraco de agulha", "Dá nó se tentar usar", "O martelo de Thor (versão mini)", "Só serve pra urinar e olhe lá", "O orgulho da microscopia", "Tão mole que parece gelatina"] };
            } else if (comandoUsado.includes('bct') || comandoUsado.includes('buceta')) {
                config = { titulo: "RANK DA CAVERNA", emoji: "🌸", frases: ["Tão profundo que aguenta qualquer um", "Cabe um batalhão inteiro", "Ecoando lá dentro", "O verdadeiro buraco negro", "Aperta igual uma pinça", "Parece um túnel sem fim", "O cara entrou e nunca mais voltou", "Cabe a Muralha Maria aí dentro", "Arrombada de elite", "Tão larga que o vento faz curva", "Dá pra estacionar um caminhão", "O Titanic afundou ali dentro", "Tá mais rodada que pneu de caminhoneiro", "Cuidado com o eco ao falar", "O portal para outra dimensão", "Entra um e sai um bonde", "Parece a garganta do Titã de Ataque", "A bct que engole almas", "Tão frouxa que parece uma cortina", "O túnel de Shiganshina", "Dá pra jogar futebol lá dentro", "O verdadeiro Triângulo das Bermudas", "Aperta menos que mão de político", "Cabe o porão do Grisha inteiro", "A maior cratera de Paradis", "Mais rodada que prato de Buffet", "O terror dos anões", "Dá pra fazer uma festa e sobra espaço", "Tão aberta que o passarinho faz ninho", "A 'caverna do dragão' do grupo"] };
            } else {
                return reply(`⚠️ Use: .rankgay, .rankgado, etc.`);
            }

            let texto = `╭━━━〔 ⚔️ *${config.titulo}* *${config.emoji}* 〕━━━╮\n┃\n┃  🎖️ *ACKERMAN INTELLIGENCE*\n┣━━━━━━━━━━━━━━━━━━━━━━\n`;
            const medalhas = ["🥇", "🥈", "🥉", "🎖️", "🎖️"];
            const frasesSorteio = shuffle([...config.frases]); 

            escolhidos.forEach((jid, index) => {
                texto += `┃  ${medalhas[index]} ┃ @${jid.split('@')[0]}\n┃  ┗⊱ _${frasesSorteio[index]}_\n`;
            });

            texto += `┃\n┣━━━━━━━━━━━━━━━━━━━━━━\n┃\n┃  📜 *AVISO:* _O Capitão Levi não perdoa._\n┃\n╰━━━━〔 🎖️ *ACKERMAN* 🎖️ 〕━━━━╯`;

            await sock.sendMessage(from, { react: { text: config.emoji, key: msg.key }});
            return sock.sendMessage(from, { text: texto, mentions: escolhidos }, { quoted: msg });

        } catch (e) {
            console.log(e);
            return reply("❌ Erro ao processar o ranking.");
        }
    }
};
