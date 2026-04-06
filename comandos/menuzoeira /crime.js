/**
 * ACKERMAN-BOT ⚔️
 * Comando: Super Ficha Criminal ⚖️ (200+ Combinações)
 * Créditos: Benny ⚔️
 */

const fs = require('fs');

module.exports = {
    name: 'crime',
    category: 'diversao',
    description: 'Gera uma ficha criminal engraçada e única para o usuário.',
    alias: ['criminal', 'fichacriminal', 'preso', 'policia', 'puxarcrime'],
    async execute(sock, msg, args, { from, sender, isGroup, reply, prefixo }) {
        
        // --- 🛡️ TRAVA MODO ZOEIRA ---
        if (isGroup) {
            const zoeiraPath = './database/modozoeira.json';
            const dbZoeira = fs.existsSync(zoeiraPath) ? JSON.parse(fs.readFileSync(zoeiraPath)) : {};
            if (!dbZoeira[from]) return reply("⚠️ O MODO ZOEIRA ESTÁ DESATIVADO NESTE GRUPO!");
        }

        // Sistema de marcação inteligente
        const quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage ? msg.message.extendedTextMessage.contextInfo.participant : false;
        const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || quoted || sender;
        const user = mentioned.split('@')[0];

        await sock.sendMessage(from, { react: { text: '⚖️', key: msg.key }});

        // --- BANCO DE DADOS CRIMINAL GIGANTE ---
        const crimes = [
            "Roubo de Wi-Fi de vizinho idoso", "Excesso de feiura em local público", "Mandar áudio de 5 minutos sem avisar",
            "Visualizar e não responder a própria mãe", "Prometer o Pix e sumir do mapa", "Iludir 15 pessoas no mesmo bairro",
            "Ser gado(a) profissional com certificado", "Falar que ia dormir e ficar online no TikTok", "Stalkear o ex até o ano de 2012",
            "Comer coxinha começando pela ponta", "Ter um chulé que derruba até Titã", "Ser o motivo do bot ter sido criado",
            "Uso excessivo de filtro do Instagram (Falsidade Ideológica)", "Atentado ao pudor por usar meia com chinelo",
            "Crimes passionais contra o próprio coração", "Venda de curso de como ser fiel sendo infiel", "Porte ilegal de chifres não declarados",
            "Tirar foto no espelho da academia e não treinar", "Postar 'tá pago' após comer um X-Tudo", "Rir de áudio triste",
            "Deixar o grupo no vácuo por mais de 2 horas", "Digitar 'kkk' com a cara séria", "Fingir que não viu o conhecido na rua",
            "Pedir Uber e cancelar na cara do motorista", "Comer o último pedaço de pizza sem perguntar", "Esquecer o aniversário da namorada(o)",
            "Ter figurinha de baixo calão no celular", "Ser mais rodado(a) que pneu de caminhão", "Falar que está chegando e ainda estar no banho",
            "Dar em cima de ex de amigo(a)", "Usar foto de perfil que não é sua", "Falar mal do ADM pelas costas",
            "Ser insuportável no grupo de segunda a sexta", "Postar indireta e apagar 1 minuto depois", "Ter preguiça de respirar",
            "Ser o 'reizinho' das desculpas esfarrapadas", "Achar que o mundo gira em torno do seu umbigo", "Ter ranço gratuito de gente legal",
            "Não lavar a louça e esconder embaixo da pia", "Usar perfume que parece veneno de rato", "Ser viciado em fofoca alheia",
            "Puxar assunto e sumir", "Fazer drama por causa de 2 reais", "Ser o terror dos agiotas", "Andar com o fone de ouvido desplugado",
            "Ter o histórico do navegador mais sujo que o Rio Tietê", "Ser viciado em figurinhas de corno", "Ficar devendo o churrasco",
            "Ser o maior iludido do estado do Pará", "Gostar de quem não presta por esporte", "Ter medo de barata voadora",
            "Comer o recheio do biscoito e guardar a bolacha", "Fingir que está dormindo pra não ceder o lugar", "Falar 'uai' sem ser mineiro",
            "Ser o motivo da humanidade não ter dado certo", "Passar vergonha no crédito e no débito", "Ter a risada mais feia que o pecado",
            "Não dar bom dia no grupo", "Ser o primeiro a pedir print da conversa", "Contar o final do filme (Spoilerista)",
            "Ter o quarto mais bagunçado que o quarto do Levi", "Ser o oficial de justiça do caos", "Pedir nudes e receber bloqueio",
            "Achar que é o Eren Jaeger mas é o Connie", "Ser o último a entender a piada", "Ter um gosto musical duvidoso",
            "Falar que é fitness e comer 3 pastéis", "Ter inveja do bot", "Ser o mestre da procrastinação", "Não limpar o histórico do PC",
            "Falar 'com certeza' sem ter certeza de nada", "Ser o motivo do desequilíbrio mundial", "Ter a audácia de marcar o ADM à toa"
        ];

        const sentencas = [
            "10 anos de vácuo eterno no WhatsApp", "30 dias sem ver um meme sequer", "Prisão perpétua no quarto chorando",
            "Pagar um lanche para todos os membros do grupo", "Casar com o integrante mais feio do grupo", "Ser banido da vida social",
            "Ouvir rádio AM por 48 horas seguidas", "Trabalho escravo lavando a louça de casa", "Internação em um convento isolado",
            "Ser obrigado a usar Nokia Tijolão por 1 ano", "Ficar sem TikTok até a próxima Copa", "Dançar forró com o ADM",
            "Pedir desculpas para o ex em público", "Comer só alface por 15 dias", "Ser bloqueado pelo bot por 24h",
            "Ouvir a mesma música do Pabllo Vittar por 12h", "Limpar o cache do celular de todo mundo", "Andar de burro no meio da cidade",
            "Pagar 100 flexões agora no grupo", "Ficar de castigo sem ver fotos da Bia", "Dormir no sofá por tempo indeterminado",
            "Ser o último a ser escolhido no futebol", "Comprar um presente pro Benny", "Falar 'eu sou gado' 100 vezes no status",
            "Assistir todos os episódios de Peppa Pig sem piscar", "Ser o fiscal de banheiro do grupo"
        ];

        const periculosidade = [
            "🟢 Inofensivo (Quase um anjo)", "🟡 Baixa (Só faz vergonha)", "🟠 Média (Cuidado com ele(a))",
            "🔴 Alta (Nível Chernobyl)", "⚠️ Extrema (Ligue para o exército agora)", "💀 Perigo de Morte (Evite contato)",
            "🛡️ Nível Titã (Só o Levi resolve)", "🔒 Caso Perdido"
        ];

        // Sorteio inteligente
        const crimeSorteado = crimes[Math.floor(Math.random() * crimes.length)];
        const sentencaSorteada = sentencas[Math.floor(Math.random() * sentencas.length)];
        const nivelPerto = periculosidade[Math.floor(Math.random() * periculosidade.length)];
        const idProcesso = Math.floor(Math.random() * 999999);

        let texto = `╭━━━〔 ⚖️ *FICHA CRIMINAL* 〕━━━╮\n┃\n`;
        texto += `┃ 👤 *INDICIADO:* @${user}\n`;
        texto += `┃ ⚖️ *CRIME:* ${crimeSorteado}\n`;
        texto += `┃ ⛓️ *SENTENÇA:* ${sentencaSorteada}\n`;
        texto += `┃ ☢️ *PERIGO:* ${nivelPerto}\n`;
        texto += `┃ 📑 *Nº PROCESSO:* #${idProcesso}\n┃\n`;
        texto += `┃ 🕵️ *DELEGADO:* Benny ⚔️\n`;
        texto += `╰━━━━━〔 🎖️ *ACKERMAN* 〕━━━━━╯\n\n`;
        texto += `*© 2026 ACKERMAN-BOT*`;

        const fotoFicha = "./media/policia.jpg"; 

        if (fs.existsSync(fotoFicha)) {
            await sock.sendMessage(from, { 
                image: { url: fotoFicha }, 
                caption: texto, 
                mentions: [mentioned] 
            }, { quoted: msg });
        } else {
            await sock.sendMessage(from, { text: texto, mentions: [mentioned] }, { quoted: msg });
        }
    }
};
