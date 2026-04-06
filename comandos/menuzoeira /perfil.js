/**
 * Comando: perfil 📊 (Versão Corrigida e Blindada)
 * Pasta: menuzoeira
 * Créditos: Benny ⚔️
 */

const fs = require('fs');

module.exports = {
    name: 'perfil',
    category: 'menuzoeira',
    description: 'Mostra perfil completo com foto, níveis de zoeira e frase motivacional.',
    alias: ['me', 'status', 'level'],
    async execute(sock, msg, args, { from, isGroup, groupMetadata, reply, sender, mentions }) {
        try {
            // --- 🛡️ TRAVA DE SEGURANÇA: MODO ZOEIRA ---
            const dbZoeiraPath = './database/modozoeira.json';
            const dbZoeira = fs.existsSync(dbZoeiraPath) ? JSON.parse(fs.readFileSync(dbZoeiraPath)) : {};

            if (!dbZoeira[from]) {
                await sock.sendMessage(from, { react: { text: '🛡️', key: msg.key }});
                return reply("⚠️ *MODO ZOEIRA NÃO ESTÁ ATIVADO!*");
            }

            await sock.sendMessage(from, { react: { text: '📊', key: msg.key }});

            const mencionado = mentions[0] || msg.message.extendedTextMessage?.contextInfo?.participant || sender;
            const idLimpo = mencionado.split('@')[0];

            // --- 📈 LÓGICA DE SOMA E ATUALIZAÇÃO DE MENSAGENS ---
            const dbPath = './dono/database.json';
            let messageCount = 0;

            if (fs.existsSync(dbPath)) {
                try {
                    let dbGlobal = JSON.parse(fs.readFileSync(dbPath));
                    if (!dbGlobal.users) dbGlobal.users = {};
                    if (!dbGlobal.users[mencionado]) dbGlobal.users[mencionado] = { messageCount: 0 };
                    
                    dbGlobal.users[mencionado].messageCount += 1;
                    messageCount = dbGlobal.users[mencionado].messageCount;
                    
                    fs.writeFileSync(dbPath, JSON.stringify(dbGlobal, null, 2));
                } catch (e) { 
                    console.log("Erro ao atualizar DB:", e);
                }
            }

            // --- 🖼️ LÓGICA DE FOTO DE PERFIL ---
            let fotoPerfil;
            try {
                fotoPerfil = await sock.profilePictureUrl(mencionado, 'image');
            } catch (e) {
                fotoPerfil = 'https://ui-avatars.com/api/?name=Ackerman&background=000&color=fff&size=512'; 
            }
            
            let cargo = "Membro";
            if (isGroup && groupMetadata) {
                const admins = groupMetadata.participants.filter(p => p.admin !== null).map(p => p.id);
                if (admins.includes(mencionado)) cargo = "Administrador 🛠️";
            }

            const pPuta = Math.floor(Math.random() * 101);
            const pHetero = Math.floor(Math.random() * 101);
            const pGado = Math.floor(Math.random() * 101);
            const pCarente = Math.floor(Math.random() * 101);
            const pInteligencia = Math.floor(Math.random() * 101);

            // --- 📜 BANCO DE FRASES ---
            const frases = [
                "O sucesso é a soma de pequenos esforços repetidos dia após dia.", "Não espere por oportunidades, crie-as.", "Grandes batalhas só são dadas a grandes guerreiros.", "O impossível é apenas uma opinião.", "Seja a mudança que você deseja ver no mundo.", "A persistência é o caminho do êxito.", "Sua única limitação é aquela que você impõe em sua própria mente.", "Não pare até se orgulhar de você mesmo.", "Cada dia é uma nova chance de ser melhor que ontem.", "Seja resiliente como um Ackerman em batalha.", "A disciplina é a ponte entre metas e realizações.", "Onde há vontade, há um caminho.", "Se você pode sonhar, você pode realizar.", "Pare de olhar para trás, você não está indo para lá.", "A dor é temporária, o orgulho é eterno.", "Vencer a si mesmo é a maior das vitórias.", "Não conte os dias, faça os dias contarem.", "A vida começa onde sua zona de conforto termina.", "Quem tem um 'porquê' enfrenta qualquer 'como'.", "O medo é uma reação, a coragem é uma decisão.", "Acredite que você pode e você já está no meio do caminho.", "Seja o herói da sua própria história.", "Foco, força e fé.", "Sonhe alto, trabalhe duro e mantenha a humildade.", "A jornada de mil milhas começa com um único passo.", "Atitude é uma pequena coisa que faz uma grande diferença.", "Seja imbatível em sua essência.", "A verdadeira força vem de dentro.", "Domine seus pensamentos ou eles dominarão você.", "A glória exige sacrifício.", "Resiliência é a arte de florescer no deserto.", "A maior vitória é conquistar a si mesmo.", "O limite só existe na sua cabeça.", "Mantenha a postura em qualquer terreno.", "O trabalho duro é o combustível do sonho.", "A sabedoria vem da observação silenciosa.", "Seja o capitão da sua própria alma.", "Seja a lenda."
            ];
            const motivacao = frases[Math.floor(Math.random() * frases.length)];

            let texto = `╭━━━〔 📊 *PERFIL ACKERMAN* 📊 〕━━━╮\n`;
            texto += `┃\n`;
            texto += `┃ 👤 *NOME:* @${idLimpo}\n`;
            texto += `┃ 🎖️ *CARGO:* ${cargo}\n`;
            texto += `┃ 📈 *MENSAGENS:* ${messageCount}\n`;
            texto += `┃\n`;
            texto += `┣━━━〔 🎭 *STATS DE ZOEIRA* 〕━━━\n`;
            texto += `┃\n`;
            texto += `┃ 👠 *Nível Puta:* ${pPuta}%\n`;
            texto += `┃ 🍺 *Nível Hetero:* ${pHetero}%\n`;
            texto += `┃ 🐂 *Nível Gado:* ${pGado}%\n`;
            texto += `┃ 🥺 *Nível Carente:* ${pCarente}%\n`;
            texto += `┃ 🧠 *Inteligência:* ${pInteligencia}%\n`;
            texto += `┃\n`;
            texto += `┣━━━〔 ✨ *MOTIVACIONAL* 〕━━━\n`;
            texto += `┃\n`;
            texto += `┃ 💬 _"${motivacao}"_\n`;
            texto += `┃\n`;
            texto += `╰━━━━〔 🎖️ *ACKERMAN-BOT* 🎖️ 〕━━━━╯`;

            // ENVIO COM TRATAMENTO DE ERRO DE IMAGEM
            try {
                return await sock.sendMessage(from, { 
                    image: { url: fotoPerfil }, 
                    caption: texto, 
                    mentions: [mencionado] 
                }, { quoted: msg });
            } catch (imageErr) {
                return await sock.sendMessage(from, { 
                    text: texto, 
                    mentions: [mencionado] 
                }, { quoted: msg });
            }

        } catch (err) {
            console.log("Erro fatal no comando Perfil:", err);
            return reply("❌ Erro ao processar seu perfil.");
        }
    }
};
