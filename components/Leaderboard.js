'use client';

export default function Leaderboard({ player, computer, draws, onReset }) {
  return (
    <div className="panel">
      <div className="header" style={{ marginBottom: 8 }}>
        <div>
          <div className="title" style={{ fontSize: 20 }}>Leaderboard</div>
          <div className="subtitle">Totals saved on this device</div>
        </div>
        <button className="btn btn-outline" onClick={onReset}>Reset</button>
      </div>
      <div className="leaderboard">
        <div className="leaderboard-row">
          <span className="leaderboard-label">Player Wins</span>
          <span className="badge x">{player}</span>
        </div>
        <div className="leaderboard-row">
          <span className="leaderboard-label">Computer Wins</span>
          <span className="badge o">{computer}</span>
        </div>
        <div className="leaderboard-row">
          <span className="leaderboard-label">Draws</span>
          <span className="badge d">{draws}</span>
        </div>
      </div>
      <div className="footer">Tip: You are X. Computer is O.</div>
    </div>
  );
}


