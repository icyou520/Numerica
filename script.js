
document.addEventListener("DOMContentLoaded", function() {
    const colors = ["purple", "yellow", "orange", "green"];
    const stacks = document.querySelectorAll(".stack");
    const columns = document.querySelectorAll(".column");
    const startGameBtn = document.getElementById("start-game");
    const draggableCounter = document.getElementById("draggable-counter");
    let counters = [];
    let currentCounter = null;
    let players = [];  // Array to store each player's game state
    let currentPlayerIndex = 0;  // Index to keep track of the current player

    startGameBtn.addEventListener("click", initializeGame);

    draggableCounter.addEventListener("dragstart", function(event) {
        event.dataTransfer.setData("text/plain", currentCounter.toString());
    });

    stacks.forEach(stack => {
        stack.addEventListener("dragover", handleDragOver);
        stack.addEventListener("drop", handleStackDrop);
    });

    columns.forEach(column => {
        column.addEventListener("dragover", handleDragOver);
        column.addEventListener("drop", handleColumnDrop);
    });

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleStackDrop(event) {
        event.preventDefault();
        const stack = event.currentTarget;
        const topCounter = stack.querySelector(".counter:last-child");
        const topCounterValue = topCounter ? parseInt(topCounter.textContent, 10) : 0;

        if (!topCounter || (topCounterValue + 1 === currentCounter)) {
            placeCounter(stack);
            drawNextCounter();
        }
    }

    function handleColumnDrop(event) {
        event.preventDefault();
        const column = event.currentTarget;
        placeCounter(column);
        drawNextCounter();
    }

    function initializeGame() {
        counters = generateCounters();
        players = colors.map(color => {
            return {
                color: color,
                stacks: [],
                columns: []
            };
        });
        drawNextCounter();
    }

    function generateCounters() {
        const countersArray = [];
        for (const color of colors) {
            for (let i = 1; i <= 13; i++) {
                for (let j = 1; j <= 4; j++) {
                    countersArray.push({ number: i, color: color });
                }
            }
        }
        return shuffleArray(countersArray);
    }

    function drawNextCounter() {
        if (counters.length === 0) {
            endGame();
            return;
        }

        currentCounter = counters.pop();
        draggableCounter.textContent = currentCounter.number;
        draggableCounter.style.backgroundColor = currentCounter.color;
        draggableCounter.style.visibility = 'visible';
    }

    function placeCounter(container) {
        const counterElem = document.createElement("div");
        counterElem.className = "counter";
        counterElem.textContent = currentCounter.number;
        counterElem.style.backgroundColor = currentCounter.color;
        container.appendChild(counterElem);
        currentCounter = null;
        draggableCounter.style.visibility = 'hidden';
    }

    function endGame() {
        const scores = players.map(player => {
            return player.stacks.reduce((acc, stack) => {
                const topCounter = stack.querySelector(".counter:last-child");
                return acc + (topCounter ? parseInt(topCounter.textContent, 10) : 0);
            }, 0);
        });

        const winner = players[scores.indexOf(Math.max(...scores))];
        alert(`Game Over! ${winner.color.toUpperCase()} wins with a score of ${Math.max(...scores)}`);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
});
