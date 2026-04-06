module.exports = {
    name: "casal",
    alias: ["shipparaleatorio", "stcasal"],
    category: "diversao",
    description: "Sorteia um casal aleatório no grupo",
    async execute(sock, msg, args, { from, reply, prefixo, isGroup, groupMetadata }) {
        
        if (!isGroup) return reply("⚠️ Este comando só pode ser usado em grupos!");

        await sock.sendMessage(from, { react: { text: '👩‍❤️‍👨', key: msg.key }});

        const participantes = groupMetadata.participants;
        const soldado1 = participantes[Math.floor(Math.random() * participantes.length)].id;
        let soldado2 = participantes[Math.floor(Math.random() * participantes.length)].id;

        while (soldado1 === soldado2) {
            soldado2 = participantes[Math.floor(Math.random() * participantes.length)].id;
        }

        const porcentagem = Math.floor(Math.random() * 100);
        let veredito = "";

        if (porcentagem < 35) {
            const frasesRuins = [
                "😬 *Credo... melhor nem se olharem hoje.*",
                "🚫 *Essa união foi proibida em 50 países.*",
                "📉 *A química aqui é negativa, chamem o SAMU!*",
                "💩 *Mais chances de eu virar humano do que isso dar certo.*",
                "🤢 *Vou fingir que não vi esse casal horrível.*",
                "🥶 *O clima esfriou tanto que o bot congelou.*",
                "🆘 *Alguém separa esses dois antes que saia briga!*",
                "🗑️ *Direto pro lixo da história esse casal.*",
                "🤡 *O circo tá perdendo esses dois palhaços.*",
                "🥀 *Esse amor nasceu morto e já foi enterrado.*",
                "⚠️ *Perigo biológico detectado nesta união.*",
                "🧐 *Estou procurando a química e não achei nem poeira.*",
                "🤯 *Meus circuitos fritaram tentando entender esse casal.*",
                "🧱 *Uma parede e um tijolo combinam mais que vocês.*",
                "💨 *Corram um do outro enquanto há tempo!*",
                "🔇 *Prefiro ficar calado para não ser preso.*",
                "🧨 *Isso não é amor, é uma bomba prestes a explodir.*",
                "☔ *O único clima entre vocês é de tempestade.*",
                "🗿 *Até essa estátua tem mais sentimento que vocês.*",
                "🧟 *Casal de mortos-vivos, zero vida nessa relação.*",
                "🚷 *Proibido shippar esses dois por falta de noção.*",
                "🧂 *Salgado demais, ninguém aguenta esses dois.*",
                "🕹️ *Deu Game Over antes mesmo de começar.*",
                "🦴 *Só sobrou o osso, porque carne não tem.*",
                "🔦 *Tô procurando a beleza desse casal e não acho.*",
                "🥥 *Cérebro de coco, nenhum dos dois se ajuda.*",
                "🛠️ *Nem com muita manutenção isso funciona.*",
                "🕳️ *Caiu no buraco do esquecimento.*",
                "🧨 *Se encostarem, sai faísca de ódio.*",
                "🙄 *Meus olhos deram 360 graus de tanto ranço.*",
                "👻 *Um casal fantasma: ninguém vê, ninguém acredita.*"
            ];
            veredito = frasesRuins[Math.floor(Math.random() * frasesRuins.length)];
        } else if (porcentagem < 70) {
            const frasesMedias = [
                "🤔 *Dá pra gastar um tempo, mas não comprem alianças.*",
                "⚖️ *Um empurrãozinho e talvez role algo.*",
                "👀 *Estão se olhando no sigilo, eu vi!*",
                "🐢 *Indo devagar, quem sabe em 2030?*",
                "🌥️ *O sol tá tentando sair, mas as nuvens atrapalham.*",
                "☕ *Um café e uma conversa talvez ajudem.*",
                "🛣️ *Caminho longo, mas quem sabe um dia?*",
                "🍃 *Deixa o vento levar, vai que um dia encosta.*"
            ];
            veredito = frasesMedias[Math.floor(Math.random() * frasesMedias.length)];
        } else {
            const frasesBoas = [
                "💖 *Preparem o buffet, o casamento é amanhã!*",
                "💍 *Uma conexão digna da Elite Ackerman!*",
                "🔥 *O clima esquentou tanto que o bot quase reiniciou!*",
                "🌹 *Feitos um para o outro, entreguem seus corações!*",
                "👑 *O Rei e a Rainha do grupo acabam de ser coroados.*",
                "✨ *A química aqui é de outro planeta!*",
                "⚡ *Cuidado! Se encostarem, explode de tanto desejo.*",
                "💌 *Já mandaram fazer os convites de casamento?*",
                "🏹 *Cupido usou uma bazuca agora, não teve erro.*",
                "🌊 *Uma onda de amor que ninguém consegue segurar.*",
                "🌙 *Feitos para brilhar juntos sob o luar.*",
                "🍷 *Um casal fino, elegante e apaixonado.*",
                "🦋 *Sinto borboletas no estômago só de olhar.*",
                "🥇 *Medalha de ouro para o melhor casal do dia!*",
                "🏗️ *Uma relação sólida como as muralhas!*",
                "🎇 *Fogos de artifício explodindo no coração.*",
                "🍭 *Tão doces que me deram até cárie.*",
                "🔮 *O futuro diz que vocês serão felizes para sempre.*",
                "🎸 *Em total sintonia, como uma banda de rock!*",
                "🌈 *Um amor colorido e cheio de vida.*",
                "💣 *Explosão de amor detectada no QG Ackerman!*",
                "🛸 *Um amor de outro mundo, sem explicação.*",
                "🔒 *Feitos um para o outro, a chave e o cadeado.*",
                "🎯 *No alvo! O amor acertou em cheio.*",
                "🍓 *Um casal moranguinho, todo romântico.*",
                "🚁 *Esse amor está decolando rumo ao infinito!*",
                "🌋 *O vulcão da paixão entrou em erupção agora.*",
                "🎭 *O par perfeito para qualquer espetáculo.*",
                "💎 *Um amor raro e precioso como diamante.*",
                "♾️ *Amor infinito, sem prazo de validade.*",
                "🥳 *O grupo todo vai comemorar esse namoro!*"
            ];
            veredito = frasesBoas[Math.floor(Math.random() * frasesBoas.length)];
        }

        let msgCasal = `*╭━〔 👩‍❤️‍👨 CASAL DO DIA 👩‍❤️‍👨 〕━╮*\n\n`;
        msgCasal += `*👤 Ele(a):* @${soldado1.split('@')[0]}\n`;
        msgCasal += `*👤 Ele(a):* @${soldado2.split('@')[0]}\n\n`;
        msgCasal += `*📊 Química:* ${porcentagem}%\n`;
        msgCasal += `*📢 Veredito:* ${veredito}\n\n`;
        msgCasal += `*╰━━━━〔 ⚔️ ACKERMAN 〕━━━━╯*`;

        return sock.sendMessage(from, { 
            text: msgCasal, 
            mentions: [soldado1, soldado2] 
        }, { quoted: msg });
    }
};
