const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason, 
    fetchLatestBaileysVersion, 
    makeInMemoryStore, 
    Browsers
} = require("@whiskeysockets/baileys");
const fs = require('fs');
const pino = require('pino');
const path = require('path'); 
const { messageHandler } = require('./handler');

// --- 🛡️ TRAVA DE CRÉDITOS DO BENNY ---
try {
    const pkg = JSON.parse(fs.readFileSync('./package.json'));
    if (pkg.author !== "Benny") {
        console.log('\x1b[31m\n[!] ERRO FATAL: CRÉDITOS VIOLADOS!\x1b[0m');
        process.exit();
    }
} catch (e) {}

const ciano = '\x1b[36m';
const rosa = '\x1b[38;5;205m';
const amarelo = '\x1b[33m';
const verde = '\x1b[32m';
const branco = '\x1b[37m';
const reset = '\x1b[0m';

const logger = pino({ level: 'silent' });
let storeFunc;
try {
    storeFunc = makeInMemoryStore || require("@whiskeysockets/baileys/lib/Store").makeInMemoryStore || require("@whiskeysockets/baileys").makeInMemoryStore;
} catch (e) {
    storeFunc = () => ({ bind: () => {}, loadMessage: () => null });
}
const store = storeFunc({ logger });

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false, 
        auth: state,
        browser: Browsers.ubuntu("Chrome"),
        syncFullHistory: false,
        getMessage: async (key) => {
            if (store) {
                const msg = await store.loadMessage(key.remoteJid, key.id);
                return msg?.message || undefined;
            }
            return undefined;
        }
    });

    store.bind(sock.ev);

    if (!sock.authState.creds.registered) {
        console.clear();
        console.log(ciano + `     [ INFO ] - O bot está desconectado. Como deseja conectar?` + reset);
        console.log(rosa + `  ╔══════════════════════════════════════════════════════╗` + reset);
        console.log(rosa + `  ║` + amarelo + `          ⚔️  ACKERMAN SYSTEM - MENU INICIAL  ⚔️         ` + rosa + `║` + reset);
        console.log(rosa + `  ╠══════════════════════════════════════════════════════╣` + reset);
        console.log(rosa + `  ║` + branco + `                                                      ` + rosa + `║` + reset);
        console.log(rosa + `  ║` + rosa + `   ➔ ` + branco + `( ` + ciano + `1` + branco + ` ) ` + verde + `Código de Emparelhamento` + branco + `                 ` + rosa + `║` + reset);
        console.log(rosa + `  ║` + rosa + `   ➔ ` + branco + `( ` + ciano + `2` + branco + ` ) ` + verde + `Qr-code (Breve)` + branco + `                          ` + rosa + `║` + reset);
        console.log(rosa + `  ║` + rosa + `   ➔ ` + branco + `( ` + ciano + `3` + branco + ` ) ` + verde + `Suporte Criador` + branco + `                           ` + rosa + `║` + reset);
        console.log(rosa + `  ╚══════════════════════════════════════════════════════╝` + reset);

        const question = (text) => new Promise((resolve) => {
            const rl = require('readline').createInterface({ input: process.stdin, output: process.stdout });
            rl.question(text, (answer) => { rl.close(); resolve(answer); });
        });

        const opcao = await question(rosa + "  ➔ " + branco + "Escolha uma opção: " + reset);
        if (opcao === '1') {
            const phoneNumber = await question(ciano + `\n👉 Digite o número do bot: ` + reset);
            const numLimpo = phoneNumber.replace(/[^0-9]/g, '');
            console.log(amarelo + "\n⏳ Gerando seu código de acesso..." + reset);
            setTimeout(async () => {
                try {
                    let code = await sock.requestPairingCode(numLimpo);
                    code = code?.match(/.{1,4}/g)?.join("-") || code;
                    console.log(verde + `\n🔑 SEU CÓDIGO DE ACESSO: ${code}\n` + reset);
                } catch (error) { console.log(rosa + "❌ Erro ao solicitar código." + reset); }
            }, 2000); 
        } else if (opcao === '3') {
            process.exit();
        }
    }

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            if (lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut) startBot();
            else {
                fs.rmSync('auth_info_baileys', { recursive: true, force: true });
                startBot();
            }
        } else if (connection === 'open') {
            console.clear();
            console.log(ciano + `\n          Criador: Benny - +559181626178` + reset);
            console.log(rosa + `#Creditos: Eu que fiz sozinho.` + reset);
            console.log(amarelo + `      『  .° ✨ CONECTADO A ➥ ACKERMAN-BOT _  .° ✨  』\n` + reset);

            // --- 🔒 MOTOR DE HORÁRIO (CLOSEGP / OPENGP) ---
            setInterval(async () => {
                const hrPath = './database/horarios_grupo.json';
                if (!fs.existsSync(hrPath)) return;
                try {
                    const data = fs.readFileSync(hrPath, 'utf-8');
                    if (!data) return;
                    let horarios = JSON.parse(data);
                    const agora = new Date().toLocaleTimeString('pt-BR', { hour12: false, hour: '2-digit', minute: '2-digit' });
                    let mudou = false;

                    for (let h of horarios) {
                        if (h.close === agora) {
                            await sock.groupSettingUpdate(h.group, 'announcement');
                            await sock.sendMessage(h.group, { text: "🔒 *ATENÇÃO RECRUTAS:* O QG acaba de ser fechado automaticamente conforme o horário militar! ⚔️" });
                            h.close = "executado"; 
                            mudou = true;
                        }
                        if (h.open === agora) {
                            await sock.groupSettingUpdate(h.group, 'not_announcement');
                            await sock.sendMessage(h.group, { text: "🔓 *ATENÇÃO RECRUTAS:* O QG está aberto! Podem prosseguir com as atividades. ⚔️" });
                            h.open = "executado";
                            mudou = true;
                        }
                    }
                    if (mudou) fs.writeFileSync(hrPath, JSON.stringify(horarios, null, 2));
                } catch (e) { console.log("Erro Cron Horário:", e.message); }
            }, 30000); 

            // --- ⏰ MOTOR DE LEMBRETES ---
            setInterval(async () => {
                const dbPath = './dono/lembretes.json';
                if (!fs.existsSync(dbPath)) return;
                try {
                    let lembretes = JSON.parse(fs.readFileSync(dbPath));
                    const agora = Date.now();
                    const paraEnviar = lembretes.filter(l => l.data <= agora);
                    const manter = lembretes.filter(l => l.data > agora);
                    for (let item of paraEnviar) {
                        let aviso = `╭━━〔 🔔 *AVISO DE LEMBRETE* 〕━━╮\n┃\n┃ 👋 Olá @${item.sender.split('@')[0]}\n┃\n┃ 📝 *VOCÊ PEDIU PARA LEMBRAR:* \n┃ ${item.mensagem}\n┃\n┃ ✅ *Lembrete concluído!*\n┃\n╰━━━━━〔 💡 *Sugestão: Beastry* 〕━━━━━╯`;
                        await sock.sendMessage(item.from, { text: aviso, mentions: [item.sender] });
                    }
                    if (paraEnviar.length > 0) fs.writeFileSync(dbPath, JSON.stringify(manter, null, 2));
                } catch (e) {}
            }, 10000); 

            sock.ev.on('group-participants.update', async (anu) => {
                try {
                    const dbPath = './dono/grupos.json';
                    if (!fs.existsSync(dbPath)) return;
                    let grupos = JSON.parse(fs.readFileSync(dbPath));
                    const config = grupos[anu.id];
                    if (config && config.bemvindo && anu.action === 'add') {
                        const metadata = await sock.groupMetadata(anu.id);
                        const motorBV = global.commands?.get('bv_logica');
                        if (motorBV) await motorBV.execute(sock, anu, metadata, config);
                    }
                } catch (e) {}
            });
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async (chatUpdate) => {
        try {
            const msg = chatUpdate.messages[0];
            if (!msg.message) return;

            const idChat = msg.key.remoteJid;
            const isGroup = idChat.endsWith('@g.us');
            
            // --- 🎯 PADRONIZAÇÃO DO SENDER ---
            let remetenteRaw = isGroup ? (msg.key.participant || msg.key.remoteJid) : msg.key.remoteJid;
            msg.sender = remetenteRaw.split(':')[0].split('@')[0] + '@s.whatsapp.net';

            const textoMsg = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
            const isUrl = textoMsg.match(/(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi);
            
            // Definição de Dono
            const eDono = msg.sender.includes("559181626178") || msg.key.fromMe;

            if (isGroup) {
                // Força o carregamento dos metadados para ter certeza de quem é admin
                const groupMetadata = await sock.groupMetadata(idChat).catch(() => ({ participants: [] }));
                const participants = groupMetadata.participants || [];
                const groupAdmins = participants.filter(v => v.admin !== null).map(v => v.id);
                
                // Verifica se quem enviou a mensagem é admin (usando comparação segura de números)
                const isMsgAdmins = groupAdmins.some(adm => adm.split('@')[0].split(':')[0] === msg.sender.split('@')[0]);

                // --- 🔇 MOTOR DO MUTE ---
                const muteDbPath = './dono/database.json';
                if (fs.existsSync(muteDbPath)) {
                    let db = JSON.parse(fs.readFileSync(muteDbPath));
                    if (!eDono && !isMsgAdmins && db.mutados?.[idChat]?.includes(msg.sender)) {
                        return await sock.sendMessage(idChat, { delete: msg.key });
                    }
                }

                // --- 🔗 MOTOR ADVLINK ---
                if (isUrl && !isMsgAdmins && !eDono) {
                    const confGpPath = './database/config_grupos.json';
                    if (fs.existsSync(confGpPath)) {
                        const configs = JSON.parse(fs.readFileSync(confGpPath));
                        const gpConf = configs.find(c => c.group === idChat);
                        
                        if (gpConf && gpConf.advlink) {
                            await sock.sendMessage(idChat, { delete: msg.key });
                            const advPath = './database/advertencias.json';
                            let advs = fs.existsSync(advPath) ? JSON.parse(fs.readFileSync(advPath)) : [];
                            let uIdx = advs.findIndex(u => u.id === msg.sender && u.group === idChat);
                            
                            if (uIdx === -1) advs.push({ id: msg.sender, group: idChat, count: 1 });
                            else advs[uIdx].count += 1;

                            const total = uIdx === -1 ? 1 : advs[uIdx].count;
                            fs.writeFileSync(advPath, JSON.stringify(advs, null, 2));

                            if (total < 3) {
                                await sock.sendMessage(idChat, { 
                                    text: `*⚠️ ADV-LINK (${total}/3)*\n@${msg.sender.split('@')[0]} recebeu uma advertência por enviar link proibido!`, 
                                    mentions: [msg.sender] 
                                });
                            } else {
                                const finalAdvs = advs.filter(u => !(u.id === msg.sender && u.group === idChat));
                                fs.writeFileSync(advPath, JSON.stringify(finalAdvs, null, 2));
                                await sock.sendMessage(idChat, { text: `*🚫 EXPULSO:* @${msg.sender.split('@')[0]} atingiu 3 advertências por link!`, mentions: [msg.sender] });
                                await sock.groupParticipantsUpdate(idChat, [msg.sender], "remove");
                            }
                            return; 
                        }
                    }
                }
            }

            if (msg.key.fromMe && !textoMsg.startsWith('.')) return;

            const numeroUser = msg.sender.split('@')[0];
            const nomeUser = msg.pushName || 'Usuário';

            console.log(rosa + `\n  ⚔️  ══════════════════════════════════  ⚔️` + reset);
            console.log(ciano + `      ✨  ${isGroup ? 'GRUPO' : 'PRIVADA'}  ✨  ` + reset);
            console.log(rosa + `  ⚔️  ══════════════════════════════════  ⚔️` + reset);
            console.log(rosa + `  ┃ ` + ciano + `👤 NICK:   ` + branco + nomeUser + reset);
            console.log(rosa + `  ┃ ` + ciano + `📱 NÚMERO: ` + branco + numeroUser + reset);
            console.log(rosa + `  ┃ ` + ciano + `💬 MSG:    ` + verde + (textoMsg || 'Mídia') + reset);
            console.log(rosa + `  ┃ ` + ciano + `⏰ HORA:   ` + amarelo + new Date().toLocaleTimeString() + reset);
            console.log(rosa + `  ⚔️  ══════════════════════════════════  ⚔️` + reset);

            // --- 🚀 ENVIO PARA O HANDLER ---
            await messageHandler(sock, msg);

        } catch (err) {
            console.log("Erro no Processamento:", err);
        }
    });

    return sock;
}

startBot();
