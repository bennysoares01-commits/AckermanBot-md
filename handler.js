/**
 * ACKERMAN-BOT HANDLER ⚔️
 * Versão Blindada: Anti-Erro, Chave Mestra (Bot Self), Anti-LID e Suporte a Jogos/AFK
 * Ajuste: Correção Crítica na Detecção de Admin do Bot 🎯
 * Créditos: Benny ⚔️
 */

const fs = require('fs');
const path = require('path');
const { adicionarPontos } = require('./dono/pontos'); 

if (!global.afkData) global.afkData = {};
if (!global.anagrama) global.anagrama = {};
if (!global.forca) global.forca = {};
if (!global.velha) global.velha = {};
if (!global.groupCache) global.groupCache = new Map(); 
global.commands = new Map(); 

const loadCommands = () => {
    global.commands.clear();
    const commandsPath = path.resolve(__dirname, 'comandos');
    const donoPath = path.resolve(__dirname, 'dono');
    
    const scan = (dir) => {
        if (!fs.existsSync(dir)) return;
        fs.readdirSync(dir).forEach(file => {
            const fullPath = path.join(dir, file);
            if (fs.lstatSync(fullPath).isDirectory()) scan(fullPath);
            else if (file.endsWith('.js')) {
                try {
                    delete require.cache[require.resolve(fullPath)];
                    const command = require(fullPath);
                    if (command.name) {
                        global.commands.set(command.name.toLowerCase(), command);
                        if (command.alias) command.alias.forEach(a => global.commands.set(a.toLowerCase(), command));
                    }
                } catch (e) { console.log(`❌ Erro no comando ${file}:`, e.message); }
            }
        });
    };
    scan(commandsPath);
    scan(donoPath);
    console.log(`\x1b[32m[ACKERMAN] ${global.commands.size} comandos ativos e prontos!\x1b[0m`);
};
loadCommands();

async function messageHandler(sock, msg) {
    try {
        if (!msg.message) return;
        const from = msg.key.remoteJid;
        const isGroup = from.endsWith('@g.us');
        const type = Object.keys(msg.message)[0];
        
        // --- 🎯 IDENTIFICAÇÃO DE SENDER ---
        const sender = isGroup ? (msg.key.participant || msg.key.remoteJid) : msg.key.remoteJid;
        const numeroLimpo = sender.split('@')[0].split(':')[0];
        const senderNumero = numeroLimpo;

        if (!fs.existsSync('./dono/database.json')) fs.writeFileSync('./dono/database.json', JSON.stringify({grupos:{}}));
        if (!fs.existsSync('./dono/config.json')) fs.writeFileSync('./dono/config.json', JSON.stringify({prefixo:".", numeroDono:"559181626178"}));
        
        if (!fs.existsSync('./database/vips.json')) {
            if (!fs.existsSync('./database')) fs.mkdirSync('./database');
            fs.writeFileSync('./database/vips.json', JSON.stringify([]));
        }

        let db = JSON.parse(fs.readFileSync('./dono/database.json'));
        let config = JSON.parse(fs.readFileSync('./dono/config.json'));
        let vips = JSON.parse(fs.readFileSync('./database/vips.json'));
        const prefixo = config.prefixo || '.';

        const isBotSelf = msg.key.fromMe === true;
        const eCriadorOficial = numeroLimpo === "559181626178";
        const eDonoRegistrado = (config.numeroDono && sender.includes(config.numeroDono));
        
        const eDono = isBotSelf || eCriadorOficial || eDonoRegistrado;
        const isOwner = eDono; 
        const isVip = vips.includes(sender) || eDono;

        let groupMetadata;
        if (isGroup) {
            const cache = global.groupCache.get(from);
            if (cache && (Date.now() - cache.lastUpdate < 60000)) {
                groupMetadata = cache.metadata;
            } else {
                groupMetadata = await sock.groupMetadata(from).catch(() => ({}));
                global.groupCache.set(from, { metadata: groupMetadata, lastUpdate: Date.now() });
            }
        } else {
            groupMetadata = {};
        }

        let participants = isGroup ? (groupMetadata.participants || []) : [];
        
        // --- 🛡️ AJUSTE NA DETECÇÃO DE ADMIN DO BOT ---
        const botIdPuro = sock.user.id.split('@')[0].split(':')[0]; 
        const groupAdmins = isGroup ? participants.filter(v => v.admin !== null).map(v => v.id) : [];
        
        // Compara apenas os números dos IDs para encontrar o bot nos participantes
        const botDados = isGroup ? participants.find(p => p.id.split('@')[0].split(':')[0] === botIdPuro) : null;
        const isBotAdmins = botDados?.admin === 'admin' || botDados?.admin === 'superadmin';
        
        // Verifica se o sender é admin comparando números puros
        const isAdmins = isGroup ? groupAdmins.some(adm => adm.split('@')[0].split(':')[0] === numeroLimpo) : false;

        let body = (type === 'conversation') ? msg.message.conversation : 
                   (type === 'extendedTextMessage') ? msg.message.extendedTextMessage.text : 
                   (type === 'imageMessage') ? msg.message.imageMessage.caption : 
                   (type === 'videoMessage') ? msg.message.videoMessage.caption : '';
        body = (typeof body === 'string') ? body : "";
        const msgTexto = body.toUpperCase().trim();

        const mentions = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        const quoted = msg.message?.extendedTextMessage?.contextInfo || null;
        const reply = (texto, opcoes = {}) => sock.sendMessage(from, { text: texto, ...opcoes }, { quoted: msg });

        if (isGroup && !eDono && !isAdmins && body) {
            const grupoInfo = db.grupos?.[from] || {};
            if (grupoInfo.antilinkgp && /chat.whatsapp.com\//i.test(body)) {
                if (isBotAdmins) {
                    await sock.sendMessage(from, { delete: msg.key });
                    await sock.groupParticipantsUpdate(from, [sender], "remove");
                    return reply(`🚫 @${senderNumero} removido por enviar link!`, { mentions: [sender] });
                }
            }
        }

        if (global.afkData[sender]) {
            const msTotal = Date.now() - global.afkData[sender].tempo;
            const motivo = global.afkData[sender].motivo;
            const tempoFormatated = new Date(msTotal).toISOString().substr(11, 8); 
            delete global.afkData[sender];
            await sock.sendMessage(from, { react: { text: '👋', key: msg.key }});
            return reply(`👋 Bem vindo de volta @${senderNumero}!\n🎭 *Motivo:* ${motivo}\n🕦 *Tempo Offline:* ${tempoFormatated}`, { mentions: [sender] });
        }

        if (body && !body.startsWith(prefixo)) {
            const hpQuizDir = './dono/hp_quiz';
            const userFile = path.join(hpQuizDir, `${numeroLimpo}.json`);
            if (fs.existsSync(userFile) && !isNaN(body.trim())) {
                const cmdHP = global.commands.get('hpquiz') || global.commands.get('hp');
                if (cmdHP) try { await cmdHP.execute(sock, msg, [body.trim()], { from, reply, sender, isGroup, prefixo, db, isAdmins, eDono, isVip, isOwner }); } catch (e) {}
            }

            const rfDir = './dono/redflag_quiz';
            const userRF = path.join(rfDir, `${numeroLimpo}.json`);
            if (fs.existsSync(userRF) && !isNaN(body.trim())) {
                const cmdRF = global.commands.get('redflag');
                if (cmdRF) try { await cmdRF.execute(sock, msg, [body.trim()], { from, reply, sender, isGroup, prefixo, db, isAdmins, eDono, isVip, isOwner }); } catch (e) {}
            }

            const aotDir = './dono/aot_quiz';
            const userAot = path.join(aotDir, `${numeroLimpo}.json`);
            if (fs.existsSync(userAot) && !isNaN(body.trim())) {
                const cmdAOT = global.commands.get('aotquiz');
                if (cmdAOT) try { await cmdAOT.execute(sock, msg, [body.trim()], { from, reply, sender, isGroup, prefixo, db, isAdmins, eDono, isVip, isOwner }); } catch (e) {}
            }

            const futpDir = './database/quiz_sessao';
            const userFutp = path.join(futpDir, `${numeroLimpo}.json`);
            if (fs.existsSync(userFutp) && !isNaN(body.trim())) {
                const dados = JSON.parse(fs.readFileSync(userFutp));
                const escolha = parseInt(body.trim());
                if (escolha >= 1 && escolha <= 5) {
                    if (escolha === dados.resposta) {
                        fs.unlinkSync(userFutp);
                        adicionarPontos(sender, 'futebol', 5);
                        await sock.sendMessage(from, { react: { text: '🏆', key: msg.key }});
                        reply(`✅ *ACERTOU!* Você ganhou 5 pontos.\n\n_Iniciando próxima pergunta..._ ⚽`);
                        const cmdFutp = global.commands.get('futp');
                        if (cmdFutp) try { await cmdFutp.execute(sock, msg, [], { from, reply, sender, prefixo, command: 'futp', db, isAdmins, eDono, isVip, isOwner }); } catch (e) {}
                    } else {
                        fs.unlinkSync(userFutp);
                        await sock.sendMessage(from, { react: { text: '❌', key: msg.key }});
                        reply(`❌ *VOCÊ ERROU!* \nInfelizmente você perdeu. Use *${prefixo}futp* para tentar novamente! ⚽`);
                    }
                }
            }
            
            if (isGroup) {
                if (global.anagrama?.[from]?.status && msgTexto === global.anagrama[from].palavra.toUpperCase()) {
                    const tempo = ((Date.now() - global.anagrama[from].tempo) / 1000).toFixed(1);
                    adicionarPontos(sender, 'anagrama', 5); 
                    await sock.sendMessage(from, { react: { text: '🏆', key: msg.key }});
                    await reply(`🎉 *ACERTOU!* @${senderNumero}\n📖 Resposta: *${global.anagrama[from].palavra}*\n⏱️ Tempo: *${tempo}s*\n🎁 Ganhou 5 pontos!`, { mentions: [sender] });
                    setTimeout(() => { if (global.anagrama[from]?.status) global.iniciarRodadaAnagrama(sock, from); }, 3000);
                    return;
                }
                if (global.velha?.[from]) {
                    const numVelha = body.trim();
                    const textoVelha = body.trim().toLowerCase();
                    if ((global.velha[from].status === "ESPERANDO" && (textoVelha === "sim" || textoVelha === "não" || textoVelha === "nao")) || (global.velha[from].status === "JOGANDO" && !isNaN(numVelha))) {
                        const cmdVelha = global.commands.get('velha') || global.commands.get('ttc');
                        if (cmdVelha) try { await cmdVelha.execute(sock, msg, [numVelha], { from, reply, sender, isGroup, command: 'velha', prefixo, db, isAdmins, eDono, isVip, isOwner, mentions, groupMetadata, participants, isBotAdmins, pushName: msg.pushName || 'Soldado' }); } catch (e) {}
                    }
                }
            }
        }

        if (!body.startsWith(prefixo)) return;
        const args = body.slice(prefixo.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = global.commands.get(commandName);

        if (command) {
            const categoriasDono = ['menudono', 'dono', 'owner'];
            if (categoriasDono.includes(command.category) && !eDono) {
                return reply("⚠️ COMANDO É APENAS PARA O MEU DONO");
            }
            await sock.sendMessage(from, { react: { text: '⚔️', key: msg.key } });
            try {
                await command.execute(sock, msg, args, { 
                    ...config, prefixo, eDono, isOwner, isVip, sender, from, isGroup, db, reply, mentions, quoted, isAdmins, isBotAdmins, groupMetadata, participants, command: commandName, pushName: msg.pushName || 'Soldado'
                });
            } catch (cmdErr) {
                console.log(`\x1b[33m[ACKERMAN LOG]\x1b[0m Erro no comando ${commandName}:`, cmdErr.message);
            }
        }
    } catch (err) { 
        console.log("\x1b[31m[ERRO HANDLER]\x1b[0m", err); 
    }
}

module.exports = { messageHandler };
