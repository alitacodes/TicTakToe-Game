// Minimax with alpha-beta pruning for Tic-Tac-Toe
// Board is an array of 9: 'X', 'O', or null

export function getWinner(board) {
  const wins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (const [a, b, c] of wins) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

export function isBoardFull(board) {
  return board.every(cell => cell !== null);
}

function evaluate(board, ai, human) {
  const winner = getWinner(board);
  if (winner === ai) return 10;
  if (winner === human) return -10;
  return 0;
}

function getAvailableMoves(board) {
  const moves = [];
  for (let i = 0; i < 9; i++) if (board[i] === null) moves.push(i);
  return moves;
}

function minimax(board, depth, isMax, ai, human, alpha, beta) {
  const score = evaluate(board, ai, human);
  if (score === 10 || score === -10) return score - depth * Math.sign(score);
  if (isBoardFull(board)) return 0;

  if (isMax) {
    let best = -Infinity;
    for (const move of getAvailableMoves(board)) {
      board[move] = ai;
      const value = minimax(board, depth + 1, false, ai, human, alpha, beta);
      board[move] = null;
      best = Math.max(best, value);
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (const move of getAvailableMoves(board)) {
      board[move] = human;
      const value = minimax(board, depth + 1, true, ai, human, alpha, beta);
      board[move] = null;
      best = Math.min(best, value);
      beta = Math.min(beta, best);
      if (beta <= alpha) break;
    }
    return best;
  }
}

export function getBestMove(board, ai = 'O', human = 'X') {
  // Always compute with full minimax; order moves for better pruning only
  const preferredOrder = [4, 0, 2, 6, 8, 1, 3, 5, 7];
  const moves = preferredOrder.filter(i => board[i] === null);

  let bestVal = -Infinity;
  let bestMove = -1;
  for (const move of moves) {
    board[move] = ai;
    const moveVal = minimax(board, 0, false, ai, human, -Infinity, Infinity);
    board[move] = null;
    if (moveVal > bestVal) {
      bestVal = moveVal;
      bestMove = move;
    }
  }
  return bestMove;
}


