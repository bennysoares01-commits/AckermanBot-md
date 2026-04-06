const { exec } = require('child_process');

module.exports = {
    name: "update",
    alias: ["atualizar", "upd"],
    category: "menudono",
    description: "Sistema de atualização com Log de Alterações",
    async execute(sock, msg, args, { from, reply, eDono, prefixo }) {
        
        // 🛡️ TRAVA DE SEGURANÇA BENNY
        if (!eDono) return reply("⚠️ COMANDO É APENAS PARA O MEU DONO");

        const subComando = args[0] ? args[0].toLowerCase() : "";

        // --- 1️⃣ ETAPA: CHECK (VERIFICAR) ---
        if (subComando === 'check') {
            await sock.sendMessage(from, { react: { text: '🔍', key: msg.key }});
            reply("🔎 *Verificando se há atualizações no QG (GitHub)...*");

            // Sincroniza com o GitHub sem baixar
            exec('git fetch', (err) => {
                if (err) return reply(`❌ *Erro na verificação:* \n${err.message}`);

                // Compara a sua versão atual com a do GitHub (origin/main)
                exec('git log main..origin/main --oneline', (errLog, stdoutLog) => {
                    if (errLog || !stdoutLog) {
                        return reply("✅ *O sistema Ackerman já está na versão mais recente.*");
                    }

                    // Se houver mudanças, ele lista as mensagens de commit
                    let msgNovidades = `📡 *NOVA VERSÃO DETECTADA!* ⚔️\n\n`;
                    msgNovidades += `📜 *O QUE MUDOU:* \n${stdoutLog}\n`;
                    msgNovidades += `\n👉 Use *${prefixo}update start* para instalar.`;

                    return reply(msgNovidades);
                });
            });
            return;
        }

        // --- 2️⃣ ETAPA: START (ATUALIZAR) ---
        if (subComando === 'start') {
            await sock.sendMessage(from, { react: { text: '📥', key: msg.key }});
            reply("⏳ *Iniciando a instalação das novas armas...*");

            exec('git pull', (err, stdout, stderr) => {
                if (err) return reply(`❌ *Erro no processo:* \n${err.message}`);

                let msgFinal = `✅ *ATUALIZAÇÃO CONCLUÍDA!* 🛡️\n\n`;
                msgFinal += `📦 *Arquivos Atualizados:* \n\`\`\`${stdout}\`\`\`\n`;
                msgFinal += `⚠️ *Atenção:* Vá ao seu **Termux** e reinicie o bot agora.`;
                
                return reply(msgFinal);
            });
            return;
        }

        // --- AJUDA ---
        return reply(`❓ *Como usar:* \n\n⚔️ *${prefixo}update check* \n⚔️ *${prefixo}update start*`);
    }
};
