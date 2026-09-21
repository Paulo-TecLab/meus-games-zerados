document.addEventListener('DOMContentLoaded', () => {
    const gameForm = document.getElementById('beaten-game-form');
    const gamesList = document.getElementById('games-list');

    // Carregar jogos do LocalStorage
    let games = JSON.parse(localStorage.getItem('myBeatenGames')) || [];

    function displayGames() {
        gamesList.innerHTML = '';
        
        games.forEach((game, index) => {
            const card = document.createElement('div');
            card.className = 'game-card';
            
            card.innerHTML = `
                <span class="tier-badge">${game.tier}</span>
                <h3>${game.title}</h3>
                <p><strong>Gênero:</strong> ${game.genre}</p>
                <p><strong>Nota:</strong> ${game.rating}/10</p>
                <p><strong>Tempo:</strong> ${game.hours} horas</p>
                <p><strong>Período:</strong> ${formatDate(game.start)} até ${formatDate(game.end)}</p>
                <button class="delete-btn" onclick="deleteGame(${index})">Banir do Registro</button>
            `;
            gamesList.appendChild(card);
        });
    }

    function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR');
    }

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

        games.push(newGame);
        localStorage.setItem('myBeatenGames', JSON.stringify(games));
        
        gameForm.reset();
        displayGames();
    });

    window.deleteGame = (index) => {
        if(confirm("Deseja apagar este registro para sempre?")) {
            games.splice(index, 1);
            localStorage.setItem('myBeatenGames', JSON.stringify(games));
            displayGames();
        }
    };

    displayGames();
});