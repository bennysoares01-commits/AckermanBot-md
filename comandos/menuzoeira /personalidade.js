/**
 * Comando: Personalidade 🎭 (Versão Megapack de Frases)
 * Pasta: diversao
 * Descrição: Analisa o perfil do usuário com um banco de dados gigante.
 * Créditos: Benny ⚔️
 */

const fs = require('fs');

module.exports = {
    name: 'personalidade',
    category: 'diversao',
    description: 'Analisa o perfil e a personalidade de um usuário.',
    alias: ['analise', 'diagnostico', 'carater'],
    async execute(sock, msg, args, { from, isGroup, reply, sender, mentions }) {
        try {
            if (!isGroup) return reply("❌ Este comando só pode ser usado em grupos!");

            // --- 🛡️ TRAVA DE SEGURANÇA: MODO ZOEIRA ---
            const dbZoeiraPath = './database/modozoeira.json';
            const dbZoeira = fs.existsSync(dbZoeiraPath) ? JSON.parse(fs.readFileSync(dbZoeiraPath)) : {};

            if (!dbZoeira[from]) {
                await sock.sendMessage(from, { react: { text: '🛡️', key: msg.key }});
                return reply("⚠️ *MODO ZOEIRA NÃO ESTÁ ATIVADO!* \n\nPeça para algum administrador ativar com: *modozoeira on*");
            }
            // ------------------------------------------

            await sock.sendMessage(from, { react: { text: '🧐', key: msg.key }});

            const alvoJid = mentions[0] || sender;
            const numeroAlvo = alvoJid.split('@')[0];

            let fotoPerfil = null;
            try {
                fotoPerfil = await sock.profilePictureUrl(alvoJid, 'image');
            } catch (error) {
                console.log(`[ACKERMAN] Sem foto para @${numeroAlvo}`);
            }

            // --- BANCO DE DADOS EXPANDIDO ---
            const profissoes = ["Empresário", "Estudante", "Trabalhador Autônomo", "Dorminhoco Profissional", "Degustador de Lanches", "Crítico de Séries", "Técnico em Informática", "Desempregado de Luxo", "Fiscal de Wi-Fi", "CEO de ser Corno", "Especialista em Vácuo", "Dublê de Rico", "Segurança de Formiga", "Vendedor de curso de como ser Gado", "Coach de sono", "Técnico em Gambiarra"];
            const temperaturas = ["Gelo Ártico", "Clima de Deserto", "Ar-condicionado no 18°C", "Morno", "Frio", "Quente", "Lava de Vulcão", "Fogo no Rabo"];
            const sexualidades = ["Hétero", "Gay", "Lésbica", "Bissexual", "Panssexual", "Assexual", "Hétero Flex", "Gay de Elite", "Sapatônica", "Não Definido"];
            const estilosMusica = ["Funk", "Rock", "Pop", "Sertanejo", "Gospel", "Pagode", "Eletrônica", "Rap", "Trap", "MPB", "K-Pop", "Lo-fi"];
            const horarios = ["Madrugada", "Manhã", "Tarde", "Noite"];
            const gostaDe = ["Dormir o dia todo", "Comer bastante", "Ficar no celular", "Assistir filmes", "Sair com os amigos", "Jogar videogame", "Comer reboco de parede", "Mandar mensagem pro ex", "Falar sozinho no banho", "Gastar dinheiro que não tem", "Criticar a vida alheia", "Ficar olhando pro teto", "Mandar áudio de 5 minutos"];
            const frasesEngracadas = ["A minha paciência é igual ao meu dinheiro: acaba rápido.", "Trabalho duro para ter a vida que eu mereço.", "Se a beleza fosse crime, eu seria inocente.", "Não sou preguiçoso, estou apenas descansando para o futuro.", "A vida é curta, mas o meu sono é longo.", "A minha paciência é igual ao meu saldo bancário: não existe.", "Se beleza fosse imposto, você estaria com o nome limpo.", "Não sou fofoqueiro, sou apenas um historiador da vida alheia.", "Nasci para ser rico, mas o destino me fez lindo e pobre.", "O meu cupido deve usar drogas, não é possível.", "Minha bateria social está em 1% desde 2015.", "Errar é humano, mas persistir no erro é a minha cara.", "Trabalho duro para que meus vizinhos pensem que sou herdeiro.", "Se a vida te der limões, faça uma limonada e jogue no olho de quem te irrita.", "Não sou preguiçoso, estou em modo de economia de energia.", "Minha vida é um grande 'eita atrás de eita'.", "Felicidade de pobre é encontrar dinheiro na calça suja.", "Sempre faço o que o meu coração manda, e ele só manda comer.", "Se o mundo acabar hoje, espero que seja depois do meu lanche.", "A meta era ser fitness, mas a vida me fez viciado em coxinha.", "Onde eu clico para cancelar a assinatura dessa vida adulta?", "Procura-se: Motivação. Recompensa: Um 'muito obrigado'."];

            const random = (array) => array[Math.floor(Math.random() * array.length)];
            const porcentagem = () => Math.floor(Math.random() * 101);

            let texto = `*┏━━〔 🎭 ACKERMAN ANALYTICS 🎭 〕━━┛*\n\n`;
            texto += `👤 *USUÁRIO:* @${numeroAlvo}\n`;
            texto += `_“O diagnóstico que você não pediu.”_\n\n`;
            texto += `*▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬*\n`;
            texto += `*👤 PERFIL GERAL*\n`;
            texto += `*━━━━━━━━━━━━━━━━━━━━━━*\n`;
            texto += `💼 *Profissão:* ${random(profissoes)}\n`;
            texto += `🌡️ *Clima Favorito:* ${random(temperaturas)}\n`;
            texto += `🌈 *Sexualidade:* ${random(sexualidades)}\n`;
            texto += `🎸 *Estilo Musical:* ${random(estilosMusica)}\n`;
            texto += `⏰ *Horário Preferido:* ${random(horarios)}\n`;
            texto += `😋 *Gosta de:* ${random(gostaDe)}\n\n`;
            texto += `*📊 STATUS ATUAIS*\n`;
            texto += `*━━━━━━━━━━━━━━━━━━━━━━*\n`;
            texto += `🤯 *Nível de Estresse:* ${porcentagem()}%\n`;
            texto += `🚫 *Chance de levar Ban:* ${porcentagem()}%\n\n`;
            texto += `*📜 FRASE DO DIA*\n`;
            texto += `*━━━━━━━━━━━━━━━━━━━━━━*\n`;
            texto += `_“${random(frasesEngracadas)}”_\n\n`;
            texto += `*┗━━〔 🎖️ ACKERMAN 🎖️ 〕━━┛*`;

            if (fotoPerfil) {
                return sock.sendMessage(from, { image: { url: fotoPerfil }, caption: texto, mentions: [alvoJid]}, { quoted: msg });
            } else {
                return sock.sendMessage(from, { text: texto, mentions: [alvoJid] }, { quoted: msg });
            }
        } catch (e) {
            console.log("Erro Personalidade:", e);
            return reply("❌ Ocorreu um erro crítico ao gerar a análise.");
        }
    }
};
