/**
 * Comando: cantada / cantadas 💖
 * Pasta: diversao
 * Créditos: Benny ⚔️
 */

const fs = require('fs');

module.exports = {
    name: 'cantada',
    category: 'diversao',
    description: 'Envia uma cantada aleatória (fofa, romântica ou quente).',
    alias: ['cantadas', 'xaveco', 'romance'],
    async execute(sock, msg, args, { from, reply }) {
        
        // --- 🛡️ TRAVA DE SEGURANÇA: MODO ZOEIRA ---
        const dbZoeiraPath = './database/modozoeira.json';
        const dbZoeira = fs.existsSync(dbZoeiraPath) ? JSON.parse(fs.readFileSync(dbZoeiraPath)) : {};

        if (!dbZoeira[from]) {
            await sock.sendMessage(from, { react: { text: '🛡️', key: msg.key }});
            return reply("⚠️ *MODO ZOEIRA NÃO ESTÁ ATIVADO!* \n\nPeça para algum administrador ativar.\nPara ativar é só usar: *modozoeira on*");
        }
        // ------------------------------------------
        
        // Reação automática 💖
        await sock.sendMessage(from, { react: { text: '💖', key: msg.key }});

        const listaCantadas = [
            // --- FOFAS & ROMÂNTICAS ---
            "Se as estrelas fossem tão lindas quanto você, eu passaria a noite inteira olhando para o céu.",
            "Não sou astrônomo, mas juro que vi o céu inteiro no seu olhar.",
            "Me chama de tabela periódica e diz que rola uma química entre nós.",
            "Você não é Wi-Fi, mas sinto uma conexão forte aqui.",
            "Seu nome é Wi-Fi? Porque eu estou sentindo uma conexão.",
            "O seu sorriso é o meu papel de parede favorito.",
            "Se beleza fosse crime, você pegaria prisão perpétua.",
            "Eu não sou o Google, mas tenho tudo o que você procura.",
            "Você é o ovo que faltava na minha marmita.",
            "Me chama de imposto de renda e se declara pra mim.",
            "Você tem um mapa? Me perdi no brilho dos seus olhos.",
            "Não sou o gênio da lâmpada, mas posso realizar todos os seus desejos.",
            "A minha felicidade tem 10 letras: V-O-C-Ê E E-U.",
            "O meu plano era te conquistar, mas você me conquistou primeiro.",
            "A sorte do dia é: você vai receber um beijo meu, resta saber quando.",
            "Eu não sou plano de saúde, mas posso cuidar de você.",
            "Você não é GPS, mas me dá o norte da minha vida.",
            "Não sou cartomante, mas vejo um futuro lindo ao seu lado.",
            "Você é a vírgula que faltava no meu ponto final.",
            "Se você fosse um sanduíche, seu nome seria X-Princesa.",
            "Você não é cardiologista, mas mexe com o meu coração.",
            "Meu amor por você é igual ao Wi-Fi da vizinha: não tem senha, mas todo mundo quer.",
            "O que o seu coração não sente, o meu sente por nós dois.",
            "Você não é o Itaú, mas foi feita para mim.",
            "Aposto um beijo que você me dá um fora. E aí, aceita?",
            "Você é tão linda que parece que foi esculpida pelos anjos.",
            "Eu não sou meteorologista, mas previ um clima entre a gente.",
            "Seu pai é mecânico? Porque você é uma graxinha.",
            "Você é o 'confirmar' que faltava no meu 'aceitar'.",
            "A minha vontade de te beijar é maior que a memória do meu celular.",
            "Você não é o sol, mas ilumina meu dia inteiro.",
            "Eu queria ser um gato para ter sete vidas e amar você em todas elas.",
            "Me chama de sedex que eu te entrego tudo o que você quiser.",
            "Você não é dicionário, mas deu sentido à minha vida.",
            "Seu olhar é o meu verso favorito.",
            "Você não é chocolate, mas é um doce de pessoa.",
            "Queria ser um computador para ter um teclado e poder te dar um 'Esc' da solidão.",
            "Você não é nota musical, mas é a harmonia do meu dia.",
            "O meu cupido deve estar de férias, porque ele me acertou e esqueceu de você.",
            "Você é o motivo do meu sorriso no meio da tarde.",
            "Se amar for pecado, eu estou pronto para ir pro inferno.",
            "O meu coração é um aeroporto e você é a única autorizada a pousar.",
            "Você não é remédio, mas é a cura para a minha tristeza.",
            "A minha vida era um quebra-cabeça e você era a peça que faltava.",
            "Você é o verso mais lindo que a vida já escreveu.",
            "Eu não sou café, mas posso te deixar acordado a noite toda.",
            "Você não é o mar, mas eu morreria afogado na sua beleza.",
            "O seu nome deveria ser 'perfeição' no dicionário.",
            "Se você fosse uma música, eu te ouviria no repeat para sempre.",
            "A minha maior meta é fazer você se apaixonar por mim todo dia.",

            // --- QUENTES & JOVENS ---
            "Se eu fosse um gato, queria passar minhas sete vidas no seu colo.",
            "Não sou o Homem de Ferro, mas posso te levar para as nuvens.",
            "Gata, você não é o Batman, mas deixou meu mundo de cabeça para baixo.",
            "Você não é a Netflix, mas eu passaria o fim de semana inteiro assistindo você.",
            "Eu não sou o Free Fire, mas quero te dar um capa de amor.",
            "O meu quarto está com frio, você não quer vir aqui aquecer?",
            "Você não é o Spotify, mas é o meu hit favorito.",
            "O meu beijo não é wifi, mas a conexão é garantida.",
            "Gata, me chama de Uber e deixa eu te levar pro meu coração.",
            "Seu corpo é o paraíso que eu queria habitar.",
            "Você não é o TikTok, mas eu não consigo parar de te olhar.",
            "Minha boca e a sua têm um assunto pendente, vamos resolver?",
            "A língua é o chicote do corpo, quer vir me dar uma surra?",
            "Você não é o iPhone 15, mas eu faria de tudo para ter você.",
            "Se eu te dar um beijo e você não gostar, você me devolve?",
            "Eu não sou o Thanos, mas com um estalo eu te faço minha.",
            "Você não é o Harry Potter, mas fez mágica no meu coração.",
            "Gata, me chama de sinal e deixa eu te deixar 'on'.",
            "O seu beijo é o único vício que eu quero ter.",
            "Se você fosse um app, eu nunca te desinstalaria.",
            "Você não é o 5G, mas a velocidade que você me ganhou foi rápida.",
            "Me chama de carregador e deixa eu te dar a energia que você precisa.",
            "Você é o bug que eu nunca quero consertar no meu sistema.",
            "Não sou o Neymar, mas quero bater um bolão com você.",
            "Seu sorriso é o filtro que eu quero usar pro resto da vida.",
            "Gata, você não é o Instagram, mas eu curto tudo o que você faz.",
            "O meu lençol está sentindo a sua falta.",
            "Você não é a Marvel, mas é a minha heroína favorita.",
            "Me chama de link e clica em mim.",
            "Se beleza fosse energia, você iluminaria o mundo sozinha.",
            "Você não é o YouTube, mas eu te daria todo o meu tempo de tela.",
            "O meu abraço é o melhor carregador que você vai encontrar.",
            "Você não é o WhatsApp, mas eu não paro de checar se você respondeu.",
            "Me chama de figurinha e me cola no seu álbum.",
            "Você é o 'skip ad' que eu nunca apertaria.",
            "Não sou o Coringa, mas você me deixa louco.",
            "Seu perfume é o melhor som que meus olhos já ouviram.",
            "Você não é o PIX, mas é tudo o que eu preciso agora.",
            "Minha cama é grande demais sem você aqui.",
            "Gata, você não é o Google Maps, mas me deixa sem rumo.",
            "Você é o meu 'trending topic' favorito.",
            "Seu beijo é o download mais esperado da minha vida.",
            "Não sou o Homem-Aranha, mas você me prendeu na sua teia.",
            "Você é o crossover mais perfeito que a vida já fez.",
            "Me chama de fone de ouvido e me deixa sussurrar no seu ouvido.",
            "Você não é o modo noturno, mas eu te usaria a noite toda.",
            "Gata, você é o motivo do meu processador travar.",
            "Sua boca parece um lugar legal, será que a minha pode visitar?",
            "Você não é o Carnaval, mas eu te espero o ano inteiro.",
            "Gata, você é o 'enter' que faltava na minha vida."
        ];

        // Sorteia uma cantada da lista
        const cantadaSorteada = listaCantadas[Math.floor(Math.random() * listaCantadas.length)];

        // Envia a resposta
        return reply(`✨ *CANTADA DO ACKERMAN* ✨\n\n"${cantadaSorteada}"\n\n_Usa com sabedoria!_ 😉`);
    }
};
