/**
 * Comando: eununca 🔞 (Versão Enquete Gigante)
 * Pasta: diversao
 * Descrição: Gera uma pergunta aleatória de 'Eu Nunca' usando enquetes.
 * Créditos: Benny ⚔️
 */

const fs = require('fs');

module.exports = {
    name: 'eununca',
    category: 'diversao',
    description: 'Jogue Eu Nunca usando enquetes do WhatsApp.',
    alias: ['never', 'en'],
    async execute(sock, msg, args, { from, reply }) {
        
        // --- 🛡️ TRAVA DE SEGURANÇA: MODO ZOEIRA ---
        const dbZoeiraPath = './database/modozoeira.json';
        const dbZoeira = fs.existsSync(dbZoeiraPath) ? JSON.parse(fs.readFileSync(dbZoeiraPath)) : {};

        if (!dbZoeira[from]) {
            await sock.sendMessage(from, { react: { text: '🛡️', key: msg.key }});
            return reply("⚠️ *MODO ZOEIRA NÃO ESTÁ ATIVADO!* \n\nPeça para algum administrador ativar.\nPara ativar é só usar: *modozoeira on*");
        }
        // ------------------------------------------
        
        // 1. Lista Expandida de Perguntas (200+ Opções)
        const perguntas = [
            // SOCIAIS E MICOS
            "Eu nunca beijei alguém deste grupo.", "Eu nunca menti para fugir de um rolê.",
            "Eu nunca fingi estar dormindo no ônibus.", "Eu nunca olhei o celular de alguém escondido.",
            "Eu nunca mandei mensagem para o(a) ex bêbado(a).", "Eu nunca quebrei um osso.",
            "Eu nunca usei o Google para ver se uma doença era grave.", "Eu nunca criei um fake.",
            "Eu nunca dormi na aula ou no trabalho.", "Eu nunca esqueci o nome de alguém após a apresentação.",
            "Eu nunca fui expulso da sala de aula.", "Eu nunca chorei vendo um filme da Disney.",
            "Eu nunca soltei um peido e culpei o cachorro/outra pessoa.", "Eu nunca usei a escova de dentes de outra pessoa.",
            "Eu nunca entrei no banheiro errado por engano.", "Eu nunca caí em público e fingi que estava correndo.",
            "Eu nunca tive uma crise de riso em um momento inapropriado.", "Eu nunca li as mensagens de alguém por cima do ombro.",
            "Eu nunca saí de casa com a roupa do avesso.", "Eu nunca postei algo e apaguei logo em seguida por vergonha.",
            "Eu nunca stalkeei um ex até encontrar o perfil da atual dele.", "Eu nunca menti a idade.",
            "Eu nunca comi algo que caiu no chão (regra dos 5 segundos).", "Eu nunca dei um nome falso na balada.",
            "Eu nunca fui pego falando sozinho.", "Eu nunca tive um crush em um professor(a).",
            "Eu nunca treinei um discurso na frente do espelho.", "Eu nunca mandei um print para a pessoa errada.",
            "Eu nunca desviei o caminho para não cumprimentar alguém.", "Eu nunca fingi que não vi alguém na rua.",

            // ROLÊS E FESTAS
            "Eu nunca dei PT em uma festa.", "Eu nunca acordei sem saber onde estava.",
            "Eu nunca bebi direto da garrafa e guardei na geladeira.", "Eu nunca misturei 5 tipos de bebidas diferentes.",
            "Eu nunca dancei em cima de uma mesa.", "Eu nunca fui expulso de uma festa.",
            "Eu nunca vomitei no Uber/Taxi.", "Eu nunca perdi o celular em um rolê.",
            "Eu nunca beijei dois amigos no mesmo dia.", "Eu nunca entrei de penetra em um casamento.",
            "Eu nunca tomei banho de piscina com roupa.", "Eu nunca virei um copo de cachaça sem fazer careta.",

            // TECNOLOGIA E BOT
            "Eu nunca xinguei o bot por não responder.", "Eu nunca tentei hackear um Wi-Fi.",
            "Eu nunca mudei o nome do grupo sem permissão.", "Eu nunca fui banido de um grupo de WhatsApp.",
            "Eu nunca ignorei uma mensagem de propósito no chat.", "Eu nunca usei o bot para fazer ciúmes em alguém.",

            // ADICIONE AQUI AS PRÓXIMAS ATÉ COMPLETAR 200...
            "Eu nunca usei o mesmo look dois dias seguidos.", "Eu nunca quebrei algo na casa de um amigo e não contei.",
            "Eu nunca usei cantada de pedreiro.", "Eu nunca tive um perfil de fofoca.",
            "Eu nunca nadei pelado(a).", "Eu nunca fiz um Pix por engano.",
            "Eu nunca menti que estava chegando quando ainda estava no banho.", "Eu nunca usei o ChatGPT para fazer trabalho de escola.",
            "Eu nunca flertei com um atendente só para ganhar desconto.", "Eu nunca pedi comida e fingi que não era para mim."
        ];

        const perguntaSorteada = perguntas[Math.floor(Math.random() * perguntas.length)];

        // 3. Reação automática 🔞
        await sock.sendMessage(from, { react: { text: '🔞', key: msg.key }});

        // 4. Envio da Enquete Nativa Otimizada
        try {
            await sock.sendMessage(from, {
                poll: {
                    name: `🔞 *EU NUNCA (ACKERMAN)* 🔞\n\n"${perguntaSorteada}"\n\n_Clique para votar:_`,
                    values: [
                        '✅ EU JÁ', 
                        '❌ EU NUNCA'
                    ],
                    selectableCount: 1 
                }
            });
        } catch (err) {
            console.log("Erro na enquete:", err);
            return reply("❌ Ops! Erro ao gerar a brincadeira.");
        }
    }
};
