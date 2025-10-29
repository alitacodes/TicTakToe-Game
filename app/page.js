'use client';

import { useEffect, useMemo, useState } from 'react';
import { getBestMove, getWinner, isBoardFull } from '../utils/ai';
import { loadLeaderboard, saveLeaderboard } from '../utils/storage';
import Leaderboard from '../components/Leaderboard';

const PLAYER = 'X';
const COMPUTER = 'O';

export default function Page() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [playerTurn, setPlayerTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [leaderboard, setLeaderboard] = useState({ player: 0, computer: 0, draws: 0 });
  const [startingSidePlayer, setStartingSidePlayer] = useState(true);

  // Load leaderboard on mount
  useEffect(() => {
    setLeaderboard(loadLeaderboard());
  }, []);

  // Save leaderboard when it changes
  useEffect(() => {
    saveLeaderboard(leaderboard);
  }, [leaderboard]);

  const winner = useMemo(() => getWinner(board), [board]);
  const draw = useMemo(() => !winner && isBoardFull(board), [board, winner]);

  useEffect(() => {
    if (winner && !gameOver) {
      setGameOver(true);
      if (winner === PLAYER) setLeaderboard(lb => ({ ...lb, player: lb.player + 1 }));
      else if (winner === COMPUTER) setLeaderboard(lb => ({ ...lb, computer: lb.computer + 1 }));
    } else if (draw && !gameOver) {
      setGameOver(true);
      setLeaderboard(lb => ({ ...lb, draws: lb.draws + 1 }));
    }
  }, [winner, draw, gameOver]);

  // Computer move when it's its turn and game isn't over
  useEffect(() => {
    if (!playerTurn && !gameOver) {
      const timer = setTimeout(() => {
        setBoard(prev => {
          const idx = getBestMove([...prev], COMPUTER, PLAYER);
          if (idx === -1) return prev;
          const next = [...prev];
          next[idx] = COMPUTER;
          return next;
        });
        setPlayerTurn(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [playerTurn, gameOver]);

  function handleCellClick(i) {
    if (gameOver || !playerTurn || board[i] !== null) return;
    setBoard(prev => {
      const next = [...prev];
      next[i] = PLAYER;
      return next;
    });
    setPlayerTurn(false);
  }

  function resetBoard(nextPlayerStarts = startingSidePlayer) {
    const playerStarts = nextPlayerStarts;
    setBoard(Array(9).fill(null));
    setGameOver(false);
    setPlayerTurn(playerStarts);
    setStartingSidePlayer(playerStarts);
  }

  function toggleStarter() {
    const next = !startingSidePlayer;
    resetBoard(next);
  }

  function hardResetLeaderboard() {
    setLeaderboard({ player: 0, computer: 0, draws: 0 });
  }

  const statusText = winner
    ? (winner === PLAYER ? 'You win! 🎉' : 'Computer wins! 🤖')
    : draw
    ? 'Draw game.'
    : playerTurn
    ? 'Your turn (X)'
    : 'Computer thinking… (O)';

  return (
    <div className="container">
      <div className="card">
        <div>
          <div className="panel" style={{ marginBottom: 16 }}>
            <div className="header">
              <div>
                <div className="title">Tic-Tac-Toe AI</div>
                <div className="subtitle">Beat the minimax computer, if you can</div>
              </div>
              <div className="legend">
                <span className="badge x">You = X</span>
                <span className="badge o">AI = O</span>
              </div>
            </div>

            <div className="status" style={{ marginBottom: 12 }}>
              <div className="status-pill">{statusText}</div>
              <div className="actions">
                <button className="btn btn-outline" onClick={() => resetBoard()} disabled={!gameOver && board.every(c => c === null)}>
                  Reset Round
                </button>
                <button className="btn" onClick={toggleStarter}>
                  {startingSidePlayer ? 'Start: Player' : 'Start: Computer'}
                </button>
                <button className="btn btn-primary" onClick={() => resetBoard(true)}>
                  New Game
                </button>
              </div>
            </div>

            <div className="board">
              {board.map((val, i) => (
                <button
                  key={i}
                  className={`cell ${gameOver || !playerTurn || val !== null ? 'disabled' : ''}`}
                  onClick={() => handleCellClick(i)}
                  disabled={gameOver || !playerTurn || val !== null}
                  aria-label={`Cell ${i + 1}`}
                >
                  <span style={{
                    color: val === 'X' ? '#93c5fd' : val === 'O' ? '#86efac' : 'inherit',
                    textShadow: val ? '0 2px 8px rgba(0,0,0,0.45)' : 'none'
                  }}>{val || ''}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <Leaderboard
            player={leaderboard.player}
            computer={leaderboard.computer}
            draws={leaderboard.draws}
            onReset={hardResetLeaderboard}
          />
        </div>
      </div>
    </div>
  );
}


