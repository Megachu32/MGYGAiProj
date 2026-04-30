// === STATE VARIABLES ===
let gameState = 'gameoff'; 
let boardGrid = []; 
let moveHistory = []; 

// DOM Elements
const boardElement = document.getElementById('board');
const toggleGameBtn = document.getElementById('toggleGameBtn');
const resetBtn = document.getElementById('resetBtn');
const p1Input = document.getElementById('p1-name');
const p2Input = document.getElementById('p2-name');

const gameoffSection = document.getElementById('gameoff-section');
const gameonSection = document.getElementById('gameon-section');
const opponentSelect = document.getElementById('opponentType');
const clockToggle = document.getElementById('clockToggle');

const moveHistoryContainer = document.getElementById('move-history');
const exportMovesBtn = document.getElementById('exportMovesBtn');

// === DYNAMIC SCRIPT LOADING ===
// This tracks which scripts we've already loaded to avoid loading them twice
const loadedScripts = {};

function loadDynamicScript(scriptId, scriptUrl) {
    if (loadedScripts[scriptId]) {
        console.log(`[System] ${scriptId} is already loaded.`);
        return;
    }

    const script = document.createElement('script');
    script.src = scriptUrl;
    script.id = scriptId;
    
    script.onload = () => {
        console.log(`[System] Successfully loaded: ${scriptUrl}`);
        loadedScripts[scriptId] = true;
    };
    
    script.onerror = () => {
        console.error(`[Error] Failed to load: ${scriptUrl}`);
    };

    document.body.appendChild(script);
}

// === INITIALIZATION ===
function initBoard() {
    boardElement.innerHTML = ''; 
    boardGrid = [];

    for (let row = 0; row < 8; row++) {
        boardGrid[row] = [];
        for (let col = 0; col < 8; col++) {
            boardGrid[row][col] = { state: 'empty', asset: null };

            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            cell.addEventListener('click', () => handleCellClick(row, col));

            // TEMPORARY ASSETS (Using your provided file names)
            if (row === 0 && col === 0) {
                boardGrid[row][col].asset = './asset/BP_1.png';
                cell.innerHTML = `<img src="./asset/BP_1.png" alt="BP">`;
            } else if (row === 7 && col === 7) {
                boardGrid[row][col].asset = './asset/RP_1.png';
                cell.innerHTML = `<img src="./asset/RP_1.png" alt="RP">`;
            }

            boardElement.appendChild(cell);
        }
    }
}

// === EVENT HANDLERS ===
function handleCellClick(row, col) {
    if (gameState !== 'gameon') return; 

    const moveNotation = `Move: [${row}, ${col}]`; 
    addMoveToHistory(moveNotation);
    
    // If playing against AI and it's loaded, you would trigger it here later:
    // if (opponentSelect.value === 'ai1' && window.ai1) {
    //     window.ai1.calculateResponse(boardGrid);
    // }
}

function addMoveToHistory(moveText, specialSymbol = '') {
    const fullText = `${moveHistory.length + 1}. ${moveText} ${specialSymbol}`;
    moveHistory.push(fullText);

    const entry = document.createElement('div');
    entry.className = 'history-entry';
    entry.textContent = fullText;
    moveHistoryContainer.appendChild(entry);
    
    moveHistoryContainer.scrollTop = moveHistoryContainer.scrollHeight;
}

toggleGameBtn.addEventListener('click', () => {
    if (gameState === 'gameoff') {
        gameState = 'gameon';
        toggleGameBtn.textContent = 'Resign (gameon)';
        toggleGameBtn.style.backgroundColor = '#cc6600'; 
        
        p1Input.disabled = true;
        p2Input.disabled = true;

        gameoffSection.style.display = 'none';
        gameonSection.style.display = 'flex';

        moveHistoryContainer.innerHTML = '';
        moveHistory = [];
        addMoveToHistory('Game Started', '▶');
        
    } else {
        gameState = 'gameoff';
        toggleGameBtn.textContent = 'Start (gameoff)';
        toggleGameBtn.style.backgroundColor = '#007acc';
        
        p1Input.disabled = false;
        p2Input.disabled = false;

        addMoveToHistory('Player Resigned', '🏳️');
    }
});

resetBtn.addEventListener('click', () => {
    gameState = 'gameoff';
    toggleGameBtn.textContent = 'Start (gameoff)';
    toggleGameBtn.style.backgroundColor = '#007acc';
    
    p1Input.disabled = false;
    p2Input.disabled = false;
    
    gameonSection.style.display = 'none';
    gameoffSection.style.display = 'block';
    
    moveHistory = [];
    moveHistoryContainer.innerHTML = '';
    
    initBoard(); 
});

// Dynamic AI loading trigger
opponentSelect.addEventListener('change', (e) => {
    const selectedOpponent = e.target.value;
    
    if (selectedOpponent === 'ai1') {
        // Loads ./ai1.js only when selected
        loadDynamicScript('ai1-script', './ai1.js');
    }
    // You can add more 'else if' blocks here later for ai2, ai3, etc.
});

exportMovesBtn.addEventListener('click', () => {
    if (moveHistory.length === 0) return;
    const historyText = moveHistory.join('\n');
    
    navigator.clipboard.writeText(historyText).then(() => {
        const originalText = exportMovesBtn.textContent;
        exportMovesBtn.textContent = 'Copied!';
        setTimeout(() => exportMovesBtn.textContent = originalText, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
});

clockToggle.addEventListener('change', (e) => {
    e.target.nextElementSibling.textContent = e.target.checked ? '(on)' : '(off)';
});

// Boot up
initBoard();