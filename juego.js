/* Js de el juego funcional */
document.addEventListener('DOMContentLoaded', () => {

    // Contenedor principal del juego
    const map = document.getElementById('map');

    // Si el contenedor no existe, significa que NO estamos en la página del juego.
    if (!map) {
        console.log("No estamos en la página del juego. JS del juego no se ejecuta.");

        const yearSpan = document.getElementById('year');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }

        return;
    }

    console.log("Juego cargado correctamente.");

    // Elementos del juego
    const scoreSpan = document.getElementById('score');
    const timeSpan = document.getElementById('time');

    // Lista de destinos que pueden aparecer
    const destinations = [
        "Picachos", "Parque Omar", "Santa Clara",
        "El Valle", "Penonomé", "Natá"
    ];

    // Variables principales
    let score = 0;
    let time = 30;
    let isGameOver = false;

    let gameInterval;
    let destinationInterval;
    const spawnRate = 1000;


    /* Actualiza la puntuación del jugador */
    function updateScore() {
        score++;
        scoreSpan.textContent = score;
    }

    /* Elige un destino aleatorio de la lista */
    function getRandomDestinationName() {
        return destinations[Math.floor(Math.random() * destinations.length)];
    }

    /* Crea un nuevo destino en una posición aleatoria del mapa */
    function createDestination() {
        if (isGameOver) return;

        const destinationElement = document.createElement('div');
        destinationElement.classList.add('destination');

        const destinationName = getRandomDestinationName();
        destinationElement.textContent = destinationName;

        const mapRect = map.getBoundingClientRect();
        const maxX = mapRect.width - 60;
        const maxY = mapRect.height - 60;

        if (maxX <= 0 || maxY <= 0) return;

        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);

        destinationElement.style.left = `${randomX}px`;
        destinationElement.style.top = `${randomY}px`;

        destinationElement.addEventListener('click', handleHit);

        map.appendChild(destinationElement);

        setTimeout(() => {
            if (map.contains(destinationElement)) {
                map.removeChild(destinationElement);
            }
        }, 3000);
    }

    /* Cuando el jugador toca un destino */
    function handleHit(event) {
        if (isGameOver) return;

        const destinationElement = event.target;

        updateScore();
        destinationElement.classList.add('hit');

        setTimeout(() => {
            if (map.contains(destinationElement)) {
                map.removeChild(destinationElement);
            }
        }, 200);
    }

    /* Controla el temporizador del juego */
    function timer() {
        time--;
        timeSpan.textContent = time;

        if (time <= 0) {
            endGame();
        }
    }

    /* Finaliza el juego y muestra la pantalla de Game Over */
    function endGame() {
        isGameOver = true;

        clearInterval(gameInterval);
        clearInterval(destinationInterval);

        map.querySelectorAll('.destination').forEach(el => el.remove());

        const gameOverScreen = document.createElement('div');
        gameOverScreen.classList.add('game-over');
        gameOverScreen.innerHTML = `
            <h2>¡Tiempo agotado!</h2>
            <p>Tu puntaje final es: <strong>${score}</strong></p>
            <button id="restartBtn">Jugar de Nuevo</button>
        `;
        map.appendChild(gameOverScreen);

        const restartBtn = document.getElementById('restartBtn');
        if (restartBtn) {
            restartBtn.addEventListener('click', initGame);
        }
    }

    /* Reinicia todo el juego desde cero */
    function initGame() {
        clearInterval(gameInterval);
        clearInterval(destinationInterval);

        map.innerHTML = '';
        isGameOver = false;

        score = 0;
        time = 30;
        scoreSpan.textContent = score;
        timeSpan.textContent = time;

        for (let i = 0; i < 3; i++) {
            createDestination();
        }

        gameInterval = setInterval(timer, 1000);
        destinationInterval = setInterval(createDestination, spawnRate);
    }

    // Inicio automático del juego
    initGame();
});