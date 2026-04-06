/**
 * Comando: Laudo Médico 🩺
 * Pasta: menuzoeira
 * Função: Simulação de consulta dinâmica lendo /database/clinica.json
 * Créditos: Benny ⚔️💉
 */

const fs = require('fs');
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = {
    name: 'laudo',
    category: 'menuzoeira',
    description: 'Realiza uma consulta médica e gera um laudo do membro.',
    alias: ['diagnostico', 'exame', 'consulta'],
    async execute(sock, msg, args, { from, reply }) {
        
        // Caminho da sua database na raiz conforme a imagem 📁
        const dbPath = './database/clinica.json';
        
        if (!fs.existsSync(dbPath)) {
            return reply("❌ Erro: O arquivo database/clinica.json não foi encontrado.");
        }
        
        const clinica = JSON.parse(fs.readFileSync(dbPath));
        
        // Identifica o paciente (marcado ou quem enviou)
        const alvo = msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || msg.sender;
        const numeroLimpo = alvo.split('@')[0];

        // Sorteia os textos da database
        const triagemMsg = clinica.triagem[Math.floor(Math.random() * clinica.triagem.length)].replace('#nmr#', numeroLimpo);
        const processandoMsg = clinica.processando[Math.floor(Math.random() * clinica.processando.length)];
        const laudoFinal = clinica.laudos[Math.floor(Math.random() * clinica.laudos.length)];

        // --- 🏥 PASSO 1: TRIAGEM ---
        await sock.sendMessage(from, { 
            text: triagemMsg,
            mentions: [alvo]
        });

        await delay(3000); // Aguarda 3 segundos para o próximo passo

        // --- 🧪 PASSO 2: LABORATÓRIO ---
        await sock.sendMessage(from, { 
            text: processandoMsg,
            mentions: [alvo]
        });

        await delay(4000); // Aguarda 4 segundos para o resultado

        // --- 📋 PASSO 3: LAUDO FINAL ---
        let mensagemFinal = `📋  ━━━〔 *LAUDO MÉDICO FINAL* 〕━━━  📋\n\n`;
        mensagemFinal += `👤 *PACIENTE:* @${numeroLimpo}\n`;
        mensagemFinal += `🩺 *RESULTADO:* ${laudoFinal}\n\n`;
        mensagemFinal += `👨‍⚕️ *RESPONSÁVEL:* Dr. Benny (Estudante de Enfermagem)\n`;
        mensagemFinal += `⚔️  ━━━━━━━━━━━━━━━━━━━━━━━  ⚔️`;

        await sock.sendMessage(from, { 
            text: mensagemFinal, 
            mentions: [alvo] 
        });
    }
};
