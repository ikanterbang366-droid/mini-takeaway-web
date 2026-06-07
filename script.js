let tokens = 20;
let humanTurn = true;
let alphabetaNodes = 0;
let humanScore = 0;
let aiScore = 0;

function startGame() {
    tokens = parseInt(document.getElementById('initial-tokens').value);
    humanTurn = true;
    alphabetaNodes = 0;
    humanScore = 0;
    aiScore = 0;

    document.getElementById('scoreboard').style.display = 'flex';
    document.querySelector('.buttons').style.display = 'block';
    document.getElementById('restart-btn').style.display = 'inline-block';
    document.getElementById('setup').style.display = 'none';
    document.getElementById('result').textContent = '';
    document.getElementById('node-counter').textContent = '';

    updateUI();
}

function updateUI() {
    let dots = "●".repeat(tokens);
    document.getElementById('tokens-info').textContent = dots;
    document.getElementById('tokens-count').textContent = `Jumlah token: ${tokens}`;
    document.getElementById('human-score').textContent = `Kamu: ${humanScore}`;
    document.getElementById('ai-score').textContent = `AI: ${aiScore}`;

    if (tokens <= 0) {
        document.getElementById('turn-info').textContent = 'Game Selesai';
    } else {
        document.getElementById('turn-info').textContent = humanTurn ? 'Giliran: Kamu' : 'Giliran: AI';
    }
}

function playerMove(n) {
    if (!humanTurn || tokens < n) return;
    tokens -= n;
    humanScore += n;
    checkEndGame(true);
    if (tokens > 0) {
        humanTurn = false;
        updateUI();
        setTimeout(aiMove, 500);
    }
}

function alphabetaJS(tokensLeft, isAiTurn, alpha, beta) {
    alphabetaNodes++;
    if (tokensLeft === 0) return [isAiTurn ? -1 : 1, null];

    let bestMove = null;
    if (isAiTurn) {
        let maxEval = -Infinity;
        for (let move = 1; move <= 3; move++) {
            if (tokensLeft - move >= 0) {
                let [evalScore] = alphabetaJS(tokensLeft - move, false, alpha, beta);
                if (evalScore > maxEval) { maxEval = evalScore; bestMove = move; }
                alpha = Math.max(alpha, evalScore);
                if (beta <= alpha) break;
            }
        }
        return [maxEval, bestMove];
    } else {
        let minEval = Infinity;
        for (let move = 1; move <= 3; move++) {
            if (tokensLeft - move >= 0) {
                let [evalScore] = alphabetaJS(tokensLeft - move, true, alpha, beta);
                if (evalScore < minEval) { minEval = evalScore; bestMove = move; }
                beta = Math.min(beta, evalScore);
                if (beta <= alpha) break;
            }
        }
        return [minEval, bestMove];
    }
}

function aiMove() {
    let [, move] = alphabetaJS(tokens, true, -Infinity, Infinity);
    tokens -= move;
    aiScore += move;
    checkEndGame(false);
    if (tokens > 0) humanTurn = true;
    updateUI();
}

function checkEndGame(lastMoverIsHuman) {
    if (tokens <= 0) {
        document.getElementById('result').textContent = lastMoverIsHuman ? 'Kamu Menang!' : 'AI Menang!';
        document.getElementById('node-counter').textContent = `Total node dievaluasi AI: ${alphabetaNodes}`;
    }
}

function restartGame() {
    document.querySelector('.buttons').style.display = 'none';
    document.getElementById('restart-btn').style.display = 'none';
    document.getElementById('scoreboard').style.display = 'none';
    document.getElementById('setup').style.display = 'block';
    document.getElementById('result').textContent = '';
    document.getElementById('node-counter').textContent = '';
    document.getElementById('tokens-info').textContent = '';
    document.getElementById('tokens-count').textContent = '';
}