const fs = require('fs');

function adicionarPontos(userId, tipo, quantidade) {
    const dbPath = './dono/pontos.json';
    if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({}));
    let dbPoints = JSON.parse(fs.readFileSync(dbPath));

    // Inicializa o usuário se não existir (Agora com Anime incluído)
    if (!dbPoints[userId]) {
        dbPoints[userId] = { 
            velha: 0, 
            forca: 0, 
            anagrama: 0, 
            futebol: 0, 
            anime: 0, 
            total: 0 
        };
    }

    // Adiciona os pontos na categoria enviada (velha, forca, anagrama, futebol ou anime)
    dbPoints[userId][tipo] = (dbPoints[userId][tipo] || 0) + quantidade;

    // Calcula o TOTAL somando todas as categorias da Arena Ackerman ⚔️
    dbPoints[userId].total = 
        (dbPoints[userId].velha || 0) + 
        (dbPoints[userId].forca || 0) + 
        (dbPoints[userId].anagrama || 0) + 
        (dbPoints[userId].futebol || 0) +
        (dbPoints[userId].anime || 0);

    fs.writeFileSync(dbPath, JSON.stringify(dbPoints, null, 2));
}

module.exports = { adicionarPontos };
