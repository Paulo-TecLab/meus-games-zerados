document.addEventListener('DOMContentLoaded', () => {
    const gameForm = document.getElementById('beaten-game-form');
    const gamesList = document.getElementById('games-list');

    // Referência para a coleção "jogos" no banco de dados
    const jogosRef = window.dbRef(window.db, 'jogos');

    // Função para formatar data
    function formatDate(dateStr) {
        if(!dateStr) return "";
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    }

    // LER DADOS DA NUVEM EM TEMPO REAL
    window.dbOnValue(jogosRef, (snapshot) => {
        const data = snapshot.val();
        gamesList.innerHTML = '';
        
        if (data) {
            Object.keys(data).forEach((id) => {
                const game = data[id];
                const card = document.createElement('div');
                card.className = 'game-card';
                
                card.innerHTML = `
                    <span class="tier-badge">${game.tier}</span>
                    <h3>${game.title}</h3>
                    <p><strong>Gênero:</strong> ${game.genre}</p>
                    <p><strong>Nota:</strong> ${game.rating}/10</p>
                    <p><strong>Tempo:</strong> ${game.hours} horas</p>
                    <p><strong>Período:</strong> ${formatDate(game.start)} até ${formatDate(game.end)}</p>
                    <button class="delete-btn" onclick="deleteGame('${id}')">Banir do Registro</button>
                `;
                gamesList.appendChild(card);
            });
        }
    });

    // SALVAR NO FIREBASE
    gameForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newGame = {
            title: document.getElementById('game-title').value,
            genre: document.getElementById('game-genre').value,
            tier: document.getElementById('game-tier').value,
            rating: document.getElementById('game-rating').value,
            hours: document.getElementById('game-hours').value,
            start: document.getElementById('start-date').value,
            end: document.getElementById('end-date').value
        };

        window.dbPush(jogosRef, newGame);
        gameForm.reset();
    });

    // DELETAR DO FIREBASE
    window.deleteGame = (id) => {
        if(confirm("Deseja apagar este registro da nuvem para sempre?")) {
            const gameRef = window.dbRef(window.db, 'jogos/' + id);
            window.dbRemove(gameRef);
        }
    };
});