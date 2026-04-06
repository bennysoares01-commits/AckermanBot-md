/**
 * Comando: Lembrete ⏰
 * Função: Agendar avisos automáticos lendo data, hora e "amanhã".
 * Sugestão: Beastry 🎖️
 * Créditos: Benny ⚔️
 */

const fs = require('fs');
const moment = require('moment-timezone'); 

module.exports = {
    name: 'lembrete',
    category: 'utilitarios',
    description: 'Agenda um aviso para o bot te marcar no horário definido.',
    alias: ['avisar', 'memo', 'reminder'],
    async execute(sock, msg, args, { from, sender, reply, prefixo }) {
        
        const body = (msg.message?.conversation || msg.message?.extendedTextMessage?.text || "").trim();
        const textoParaAnalise = body.toLowerCase();

        if (!args.length) {
            let tutorial = `╭━━━〔 ⏰ *MENU DE LEMBRETES* 〕━━━╮\n┃\n`;
            tutorial += `┃ 👋 Olá @${sender.split('@')[0]}\n`;
            tutorial += `┃\n`;
            tutorial += `┃ 📝 *COMO USAR:* \n`;
            tutorial += `┃ Digite o assunto, a data e o tempo.\n`;
            tutorial += `┃\n`;
            tutorial += `┃ 💡 *EXEMPLOS:* \n`;
            tutorial += `┃ ➤ ${prefixo}lembrete estudar amanhã as 06:10\n`;
            tutorial += `┃ ➤ ${prefixo}lembrete aula dia 31/03 as 15:30\n`;
            tutorial += `┃ ➤ ${prefixo}lembrete dentista daqui a 2 horas\n`;
            tutorial += `┃\n`;
            tutorial += `╰━━━━━〔 💡 *Sugestão: Beastry* 〕━━━━━╯`;
            
            return reply(tutorial, { mentions: [sender] });
        }

        let dataAlvo = null;
        const agoraMoment = moment().tz('America/Belem');

        // 1. Tenta detectar Data Fixa (Ex: 31/03 as 15:30)
        const dataMatch = textoParaAnalise.match(/(\d{1,2}\/\d{1,2})/); 
        const horarioMatch = textoParaAnalise.match(/(\d{1,2}:\d{2})/); 

        if (dataMatch && horarioMatch) {
            const [dia, mes] = dataMatch[1].split('/');
            const [horas, minutos] = horarioMatch[1].split(':');
            let agendado = moment().tz('America/Belem').set({ 
                date: parseInt(dia),
                month: parseInt(mes) - 1,
                hour: parseInt(horas), 
                minute: parseInt(minutos), 
                second: 0 
            });
            dataAlvo = agendado.valueOf();
        } 
        // 2. Tenta detectar a palavra "amanhã"
        else if (textoParaAnalise.includes('amanhã') && horarioMatch) {
            const [horas, minutos] = horarioMatch[1].split(':');
            let agendado = moment().tz('America/Belem').add(1, 'day').set({ 
                hour: parseInt(horas), 
                minute: parseInt(minutos), 
                second: 0 
            });
            dataAlvo = agendado.valueOf();
        }
        // 3. Lógica para "daqui a X tempo"
        else if (textoParaAnalise.includes('daqui a')) {
            const matchNum = textoParaAnalise.match(/\d+/);
            if (matchNum) {
                const numero = parseInt(matchNum[0]);
                let ms = 0;
                if (textoParaAnalise.includes('minut') || textoParaAnalise.includes('min')) ms = numero * 60 * 1000;
                else if (textoParaAnalise.includes('hora')) ms = numero * 60 * 60 * 1000;
                else if (textoParaAnalise.includes('dia')) ms = numero * 24 * 60 * 60 * 1000;
                if (ms > 0) dataAlvo = Date.now() + ms;
            }
        } 
        // 4. Apenas horário (Se já passou, assume amanhã automaticamente)
        else if (horarioMatch) {
            const [horas, minutos] = horarioMatch[1].split(':');
            let agendado = moment().tz('America/Belem').set({ 
                hour: parseInt(horas), 
                minute: parseInt(minutos), 
                second: 0 
            });
            if (agendado.isBefore(agoraMoment)) agendado.add(1, 'day');
            dataAlvo = agendado.valueOf();
        }

        if (!dataAlvo || isNaN(dataAlvo)) {
            return reply("⚠️ *Não entendi o tempo.*\n\nTente: 'amanhã as 06:10' ou 'dia 31/03 as 06:10'.");
        }

        // --- SALVAMENTO ---
        const dbPath = './dono/lembretes.json';
        if (!fs.existsSync('./dono')) fs.mkdirSync('./dono');
        const lembretes = fs.existsSync(dbPath) ? JSON.parse(fs.readFileSync(dbPath)) : [];
        let mensagemFinal = body.replace(new RegExp(`^\\${prefixo}lembrete`, 'i'), '').trim();

        lembretes.push({
            id: Date.now(),
            from,
            sender,
            mensagem: mensagemFinal,
            data: dataAlvo
        });

        fs.writeFileSync(dbPath, JSON.stringify(lembretes, null, 2));

        const dataFormatada = moment(dataAlvo).tz('America/Belem').format('DD/MM [às] HH:mm');
        await sock.sendMessage(from, { react: { text: '⏰', key: msg.key }});
        
        let confirmacao = `╭━━〔 ✅ *LEMBRETE DEFINIDO* 〕━━╮\n`;
        confirmacao += `┃\n`;
        confirmacao += `┃ 📝 *ASSUNTO:* ${mensagemFinal}\n`;
        confirmacao += `┃ 📅 *DATA/HORA:* ${dataFormatada}\n`;
        confirmacao += `┃\n`;
        confirmacao += `┃ _Eu vou te avisar no horário marcado!_\n`;
        confirmacao += `┃\n`;
        confirmacao += `╰━━━━━〔 💡 *Sugestão: Beastry* 〕━━━━━╯`;

        return reply(confirmacao, { mentions: [sender] });
    }
};
