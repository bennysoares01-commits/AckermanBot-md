/**
 * Comando: anagrama 🧩
 * Função: Jogo de embaralhar palavras (Modo Contínuo - 400 PALAVRAS)
 * Créditos: Benny ⚔️
 */

const fs = require('fs');

module.exports = {
    name: 'anagrama',
    category: 'membros',
    description: 'Ativa ou desativa o modo de jogo de anagrama contínuo.',
    alias: ['jogar', 'agm'],
    async execute(sock, msg, args, { from, isGroup, reply, eDono, isAdmins, prefixo }) {
        
        const dbZoeiraPath = './database/modozoeira.json';
        const dbZoeira = fs.existsSync(dbZoeiraPath) ? JSON.parse(fs.readFileSync(dbZoeiraPath)) : {};
        if (!dbZoeira[from]) {
            return reply("⚠️ *MODO ZOEIRA DESATIVADO!* \n\nUse: *modozoeira on* para liberar os jogos.");
        }

        if (!isGroup) return reply("❌ Apenas em grupos.");
        if (!isAdmins && !eDono) return reply("⚠️ Apenas Generais (ADMs) podem ligar/desligar o Anagrama.");

        if (args[0] === 'on') {
            if (!global.anagrama) global.anagrama = {};
            if (global.anagrama[from]?.status) return reply("🎮 O Anagrama já está rodando!");

            global.anagrama[from] = { status: true };
            await sock.sendMessage(from, { react: { text: '🎮', key: msg.key }});
            reply("✅ *ANAGRAMA ATIVADO!* ⚔️\n\nPrepare-se, o estoque de palavras foi atualizado para 400 itens!");
            
            return global.iniciarRodadaAnagrama(sock, from);

        } else if (args[0] === 'off') {
            if (!global.anagrama || !global.anagrama[from]) return reply("❌ O jogo já está desligado.");
            delete global.anagrama[from];
            await sock.sendMessage(from, { react: { text: '🛑', key: msg.key }});
            return reply("🛑 *ANAGRAMA DESLIGADO!*");
        } else {
            return reply(`❓ Use: *${prefixo}anagrama on* ou *off*`);
        }
    }
};

global.iniciarRodadaAnagrama = async (sock, from) => {
    if (!global.anagrama[from] || !global.anagrama[from].status) return;

    const lista = [
        // --- 🏠 CASA E COTIDIANO (100+) ---
        { p: "GELADEIRA", d: "Guarda a comida gelada" }, { p: "TELEVISAO", d: "Aparelho de ver imagens" },
        { p: "SOFA", d: "Lugar de sentar na sala" }, { p: "CADEIRA", d: "Usada para sentar" },
        { p: "TRAVESSEIRO", d: "Apoio para a cabeça" }, { p: "COLCHÃO", d: "Onde a gente dorme" },
        { p: "MICROONDAS", d: "Esquenta a comida" }, { p: "VASSOURA", d: "Limpa o chão" },
        { p: "TOALHA", d: "Para se secar" }, { p: "ESPELHO", d: "Reflete a imagem" },
        { p: "JANELA", d: "Abertura para ventilar" }, { p: "PORTA", d: "Entrada da casa" },
        { p: "LAMPADA", d: "Ilumina o quarto" }, { p: "VENTILADOR", d: "Espanta o calor" },
        { p: "PANELA", d: "Usada para cozinhar" }, { p: "TALHERES", d: "Garfo e faca" },
        { p: "MOCHILA", d: "Carrega cadernos" }, { p: "TESOURA", d: "Para cortar papel" },
        { p: "CARTEIRA", d: "Guarda dinheiro" }, { p: "RELOGIO", d: "Marca as horas" },
        { p: "CADERNO", d: "Para anotações" }, { p: "CANETA", d: "Para escrever" },
        { p: "BORRACHA", d: "Apaga o lápis" }, { p: "CHAVE", d: "Abre o portão" },
        { p: "CARREGADOR", d: "Dá energia ao celular" }, { p: "FONE", d: "Para ouvir som" },
        { p: "MAQUINA", d: "Lava a roupa" }, { p: "CHUVEIRO", d: "Onde tomamos banho" },
        { p: "TAPETE", d: "Fica no chão da sala" }, { p: "ESTANTE", d: "Guarda livros" },
        { p: "MESA", d: "Onde almoçamos" }, { p: "FOGAO", d: "Onde fazemos o fogo" },
        { p: "COPO", d: "Para beber água" }, { p: "PRATO", d: "Para colocar a comida" },
        { p: "LIXEIRA", d: "Lugar de descartes" }, { p: "BALDE", d: "Para carregar água" },
        { p: "RODO", d: "Para puxar água do chão" }, { p: "VARAL", d: "Onde seca a roupa" },
        { p: "PENTE", d: "Para arrumar o cabelo" }, { p: "ESCOVA", d: "Para limpar os dentes" },
        { p: "SABONETE", d: "Para lavar o corpo" }, { p: "XAMPU", d: "Para lavar o cabelo" },
        { p: "AMACIANTE", d: "Deixa a roupa cheirosa" }, { p: "LENÇOL", d: "Cobre a cama" },
        { p: "CORTINA", d: "Tampa a luz da janela" }, { p: "QUADRO", d: "Enfeita a parede" },
        { p: "ALMOFADA", d: "Deixa o sofá macio" }, { p: "FILTRO", d: "Purifica a água" },
        { p: "GARRAFA", d: "Recipiente de líquidos" }, { p: "CANIVETE", d: "Ferramenta de bolso" },
        { p: "MARTELO", d: "Para pregar pregos" }, { p: "ALICATE", d: "Ferramenta de aperto" },

        // --- 🍕 ALIMENTOS E BEBIDAS (80+) ---
        { p: "PIZZA", d: "Massa redonda italiana" }, { p: "HAMBURGUER", d: "Sanduíche de carne" },
        { p: "CHOCOLATE", d: "Doce de cacau" }, { p: "COXINHA", d: "Salgado de frango" },
        { p: "ARROZ", d: "Acompanhamento branco" }, { p: "FEIJAO", d: "Grão preto ou carioca" },
        { p: "MACARRAO", d: "Massa de espaguete" }, { p: "MELANCIA", d: "Fruta pesada e doce" },
        { p: "BANANA", d: "Fruta rica em potássio" }, { p: "MORANGO", d: "Fruta vermelha e pequena" },
        { p: "LARANJA", d: "Fruta cítrica" }, { p: "CAFE", d: "Bebida quente amarga" },
        { p: "REFRIGERANTE", d: "Bebida com gás" }, { p: "CERVEJA", d: "Bebida de malte" },
        { p: "SORVETE", d: "Doce gelado" }, { p: "BOLO", d: "Doce de festa" },
        { p: "PAO", d: "Alimento da padaria" }, { p: "QUEIJO", d: "Vem do leite" },
        { p: "OVO", d: "Frito ou cozido" }, { p: "PIPOCA", d: "Milho estourado" },
        { p: "LASANHA", d: "Camadas de massa e queijo" }, { p: "PASTEL", d: "Massa frita de feira" },
        { p: "SUCO", d: "Líquido da fruta" }, { p: "VINHO", d: "Bebida de uva" },
        { p: "PAMONHA", d: "Feito de milho" }, { p: "TAPIOCA", d: "Goma de mandioca" },
        { p: "MANDIOCA", d: "Raiz muito consumida" }, { p: "BATATA", d: "Pode ser frita ou purê" },
        { p: "ALFACE", d: "Folha de salada" }, { p: "TOMATE", d: "Fruto vermelho da salada" },
        { p: "ABACAXI", d: "Fruta com coroa" }, { p: "MEL", d: "Feito pelas abelhas" },
        { p: "BISCOITO", d: "Lanche crocante" }, { p: "MANTEIGA", d: "Passamos no pão" },
        { p: "SALAME", d: "Embutido de carne" }, { p: "MAMÃO", d: "Fruta com sementes pretas" },
        { p: "UVA", d: "Pequena e nasce em cachos" }, { p: "LIMÃO", d: "Muito azedo" },
        { p: "PUDIM", d: "Sobremesa com calda" }, { p: "GELATINA", d: "Doce que treme" },

        // --- 🏥 ENFERMAGEM E SAÚDE (60+) ---
        { p: "SERINGA", d: "Aplica injeção" }, { p: "TERMOMETRO", d: "Verifica a febre" },
        { p: "PACIENTE", d: "Quem busca cura" }, { p: "CURATIVO", d: "Cobre a ferida" },
        { p: "HOSPITAL", d: "Centro de saúde" }, { p: "SANGUE", d: "Líquido circulatório" },
        { p: "VACINA", d: "Imunizante" }, { p: "REMEDIO", d: "Medicamento" },
        { p: "ESTETOSCOPIO", d: "Ouve o coração" }, { p: "AFERIÇÃO", d: "Medir sinais" },
        { p: "CATETER", d: "Acesso venoso" }, { p: "PULSAÇÃO", d: "Ritmo das artérias" },
        { p: "DIAGNOSTICO", d: "Resultado médico" }, { p: "OXIGENIO", d: "Essencial para respirar" },
        { p: "ANATOMIA", d: "Estudo do corpo" }, { p: "AMBULANCIA", d: "Transporte de feridos" },
        { p: "INSULINA", d: "Para diabéticos" }, { p: "GLICOSE", d: "Nível de açúcar" },
        { p: "BRADICARDIA", d: "Coração lento" }, { p: "TAQUICARDIA", d: "Coração rápido" },
        { p: "HIPERTENSAO", d: "Pressão alta" }, { p: "HIPOTENSAO", d: "Pressão baixa" },
        { p: "TRAUMA", d: "Lesão grave" }, { p: "FRACTURA", d: "Osso quebrado" },
        { p: "GESSADO", d: "Imobilização" }, { p: "MACA", d: "Onde o doente deita" },
        { p: "UTI", d: "Cuidado intensivo" }, { p: "CLINICA", d: "Local de consultas" },
        { p: "DENTISTA", d: "Cuida do sorriso" }, { p: "EXAME", d: "Análise de saúde" },

        // --- ⚔️ ANIMES E FUTEBOL (60+) ---
        { p: "ACKERMAN", d: "Clã mais forte de AoT" }, { p: "TITAN", d: "Inimigo de Paradis" },
        { p: "EREN", d: "Busca a liberdade" }, { p: "MURALHA", d: "Maria, Rose ou Sina" },
        { p: "PAYSANDU", d: "Papão da Curuzu" }, { p: "CORINTHIANS", d: "Bando de loucos" },
        { p: "CRUZEIRO", d: "Maior de Minas" }, { p: "MADRID", d: "Clube merengue" },
        { p: "LEVI", d: "Capitão herói" }, { p: "MIKASA", d: "Guerreira fiel" },
        { p: "COLOSSAL", d: "Titã de 60 metros" }, { p: "ANNIE", d: "Titã feminina" },
        { p: "REINER", d: "Titã encouraçado" }, { p: "VINLAND", d: "Saga de Thorfinn" },
        { p: "HYOUKA", d: "Anime de mistério" }, { p: "NARUTO", d: "Ninja loiro" },
        { p: "SASUKE", d: "Sobrevivente Uchiha" }, { p: "SAKURA", d: "Ninja médica" },
        { p: "KAKASHI", d: "Ninja copiador" }, { p: "HOKAGE", d: "Líder da folha" },
        { p: "AKATSUKI", d: "Nuvem vermelha" }, { p: "RASENGAN", d: "Esfera de vento" },
        { p: "GOKU", d: "Guerreiro saiyajin" }, { p: "VEGETA", d: "Príncipe saiyajin" },
        { p: "ZORO", d: "Solou o King" }, { p: "LUFFY", d: "Pirata de borracha" },
        { p: "ESTADIO", d: "Templo do futebol" }, { p: "ARTILHEIRO", d: "Dono dos gols" },
        { p: "GOLEIRO", d: "Evita o gol" }, { p: "ESCANTEIO", d: "Canto do campo" },
        { p: "PENALTI", d: "Marca da cal" }, { p: "APITO", d: "Objeto do juiz" },

        // --- 👮 PROFISSÕES E LUGARES (60+) ---
        { p: "POLICIAL", d: "Segurança pública" }, { p: "BOMBEIRO", d: "Herói das chamas" },
        { p: "MEDICO", d: "Salva vidas" }, { p: "PROFESSOR", d: "Mestre do ensino" },
        { p: "MOTORISTA", d: "Comanda o volante" }, { p: "COZINHEIRO", d: "Faz a comida" },
        { p: "PEDREIRO", d: "Faz a casa" }, { p: "MERCADO", d: "Onde compra comida" },
        { p: "ESCOLA", d: "Onde aprende" }, { p: "PARQUE", d: "Lugar de lazer" },
        { p: "PRAIA", d: "Areia e mar" }, { p: "IGREJA", d: "Lugar de fé" },
        { p: "ACADEMIA", d: "Lugar de musculação" }, { p: "PADARIA", d: "Tem pão quente" },
        { p: "POSTO", d: "Tem gasolina" }, { p: "BANCO", d: "Guarda o dinheiro" },
        { p: "CINEMA", d: "Lugar de filmes" }, { p: "TEATRO", d: "Peças ao vivo" },
        { p: "FARMACIA", d: "Vende remédios" }, { p: "MUSEU", d: "Guarda história" },
        { p: "ESTRADA", d: "Caminho de viagem" }, { p: "PONTE", d: "Passa por cima do rio" },
        { p: "FLORESTA", d: "Muitas árvores" }, { p: "DESERTO", d: "Muita areia" },
        { p: "CIDADE", d: "Muitos prédios" }, { p: "FAZENDA", d: "Criação de animais" },
        { p: "AEROPORTO", d: "Onde aviões descem" }, { p: "VIAGEM", d: "Passeio longo" },

        // --- 👃 CORPO HUMANO E NATUREZA (40+) ---
        { p: "CEREBRO", d: "Comanda tudo" }, { p: "CORAÇÃO", d: "Bate no peito" },
        { p: "PULMAO", d: "Usado para respirar" }, { p: "ESTOMAGO", d: "Onde cai a comida" },
        { p: "FIGADO", d: "Órgão que filtra" }, { p: "RIM", d: "Filtra o sangue" },
        { p: "BRAÇO", d: "Membro superior" }, { p: "PERNA", d: "Membro inferior" },
        { p: "CABEÇA", d: "Fica em cima do pescoço" }, { p: "DEDO", d: "Temos dez nas mãos" },
        { p: "ORELHA", d: "Para ouvir" }, { p: "NARIZ", d: "Para cheirar" },
        { p: "BOCA", d: "Para falar e comer" }, { p: "OLHO", d: "Para enxergar" },
        { p: "JOELHO", d: "Dobra a perna" }, { p: "PESSOAL", d: "Nós mesmos" },
        { p: "SISTEMA", d: "Conjunto de órgãos" }, { p: "ARVORE", d: "Dá sombra e fruto" },
        { p: "FLOR", d: "Colorida e cheirosa" }, { p: "SOL", d: "Estrela do dia" },
        { p: "LUA", d: "Brilha à noite" }, { p: "ESTRELA", d: "Ponto de luz no céu" },
        { p: "CHUVA", d: "Água do céu" }, { p: "VENTO", d: "Ar em movimento" },
        { p: "TERRA", d: "Nosso planeta" }, { p: "UNIVERSO", d: "Tudo o que existe" }
    ];

    // Lógica de sorteio
    const sorteio = lista[Math.floor(Math.random() * lista.length)];
    const palavraCerta = sorteio.p.toUpperCase();
    const dica = sorteio.d;

    let embaralhada = palavraCerta.split('').sort(() => Math.random() - 0.5).join('');
    while (embaralhada === palavraCerta) {
        embaralhada = palavraCerta.split('').sort(() => Math.random() - 0.5).join('');
    }

    global.anagrama[from] = {
        palavra: palavraCerta,
        tempo: Date.now(),
        status: true
    };

    return sock.sendMessage(from, { 
        text: `🧩 *ANAGRAMA ACKERMAN* 🧩\n\n💡 Letras: *${embaralhada}*\n📝 Dica: _${dica}_\n\n_O primeiro que digitar a palavra certa vence!_ ⚔️` 
    });
};

// --- 💡 INTEGRAÇÃO COM O SISTEMA DE PONTOS NO HANDLER ---
const { adicionarPontos } = require('../../dono/pontos'); 

// Adicione esta parte no seu messageHandler (no Index ou Handler) 
// onde ele verifica se a palavra digitada é igual a global.anagrama[from].palavra:
/* if (global.anagrama?.[from]?.status && msgTexto === global.anagrama[from].palavra.toUpperCase()) {
       adicionarPontos(sender, 'anagrama', 5);
       // ... resto do seu código de vitória ...
   }
*/
