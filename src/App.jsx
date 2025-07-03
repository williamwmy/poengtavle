import { useState } from "react";

const initialState = { home: 0, away: 0 };

function App() {
  const [score, setScore] = useState(initialState);
  const [history, setHistory] = useState([]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const addPoint = (team) => {
    setHistory([...history, score]);
    setScore({ ...score, [team]: score[team] + 1 });
  };

  const undo = () => {
    if (history.length === 0) return;
    setScore(history[history.length - 1]);
    setHistory(history.slice(0, -1));
  };

  const confirmReset = () => setShowResetConfirm(true);

  const resetSet = () => {
    setScore(initialState);
    setHistory([]);
    setShowResetConfirm(false);
  };

  const cancelReset = () => setShowResetConfirm(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        background: "#17171a",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Inter, Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 0, // Fjern all gap mellom boksene
          width: "100vw",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ScoreBox
          points={score.home}
          onAdd={() => addPoint("home")}
          color="#2061fc"
        />
        <ScoreBox
          points={score.away}
          onAdd={() => addPoint("away")}
          color="#f62641"
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "1.2rem",
          marginTop: "2vh",
          background: "#17171a", // samme som bakgrunn
          width: "100vw",
          justifyContent: "center",
        }}
      >
        <button
          style={{
            ...buttonStyle,
            background: "#444",
            color: "#fff",
            minWidth: 110,
          }}
          onClick={undo}
          disabled={history.length === 0}
        >
          Angre
        </button>
        <button
          style={{
            ...buttonStyle,
            background: "#17171a",
            color: "#fff",
            minWidth: 130,
            border: "2px solid #888",
          }}
          onClick={confirmReset}
        >
          Nytt sett
        </button>
      </div>
      {showResetConfirm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.80)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <div
            style={{
              background: "#232946",
              padding: "2rem",
              borderRadius: "1.5rem",
              textAlign: "center",
              minWidth: "70vw",
              boxShadow: "0 4px 32px #0008",
            }}
          >
            <p style={{ fontSize: "1.4rem", marginBottom: "1.5rem" }}>
              Start nytt sett og nullstill poengene?
            </p>
            <div
              style={{
                display: "flex",
                gap: "1.5rem",
                justifyContent: "center",
              }}
            >
              <button
                style={{
                  ...buttonStyle,
                  background: "#2061fc",
                  color: "#fff",
                }}
                onClick={resetSet}
              >
                Ja, nullstill
              </button>
              <button
                style={{
                  ...buttonStyle,
                  background: "#f62641",
                  color: "#fff",
                }}
                onClick={cancelReset}
              >
                Avbryt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ScoreBox({ points, onAdd, color }) {
  return (
    <div
      style={{
        background: color,
        width: "49vw",
        height: "70vh",
        borderRadius: "2vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        userSelect: "none",
        cursor: "pointer",
        margin: 0, // Ingen margin
        boxShadow: `0 4px 24px ${color}66`,
      }}
      onClick={onAdd}
      aria-label="Trykk for å øke poeng"
    >
      <span
        style={{
          fontSize: "16vw",
          fontWeight: "bold",
          color: "#fff",
          textShadow: `0 8px 32px #000b, 0 2px 0 #fff4`,
          lineHeight: "1",
        }}
      >
        {points}
      </span>
    </div>
  );
}

const buttonStyle = {
  fontSize: "1.1rem",
  padding: "0.8em 1.6em",
  borderRadius: "1em",
  border: "none",
  background: "#222",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
  transition: "background 0.2s, color 0.2s",
};

export default App;
