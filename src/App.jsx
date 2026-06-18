import { useEffect, useState } from "react";

const initialScore = { home: 0, away: 0 };
const initialSets = { home: 0, away: 0 };

const defaultSettings = {
  colors: { home: "#2061fc", away: "#f62641" },
  setsEnabled: false,
  serveEnabled: false,
};

const colorPresets = [
  "#2061fc",
  "#f62641",
  "#22c55e",
  "#f59e0b",
  "#a855f7",
  "#14b8a6",
  "#ec4899",
  "#0ea5e9",
  "#64748b",
  "#111827",
];

const loadSettings = () => {
  try {
    const saved = localStorage.getItem("poengtavle-settings");
    if (!saved) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(saved) };
  } catch {
    return defaultSettings;
  }
};

function App() {
  const [score, setScore] = useState(initialScore);
  const [sets, setSets] = useState(initialSets);
  const [serve, setServe] = useState(null); // "home" | "away" | null
  const [settings, setSettings] = useState(loadSettings);
  const [showSettings, setShowSettings] = useState(false);
  const [confirmType, setConfirmType] = useState(null); // "set" | "match" | null

  useEffect(() => {
    localStorage.setItem("poengtavle-settings", JSON.stringify(settings));
  }, [settings]);

  const addPoint = (team) => {
    setScore((prev) => ({ ...prev, [team]: prev[team] + 1 }));
    setServe(team); // Serven går til laget som vant ballen (sideout)
  };

  const subtractPoint = (team) => {
    setScore((prev) => ({ ...prev, [team]: Math.max(0, prev[team] - 1) }));
  };

  const addSet = (team) =>
    setSets((prev) => ({ ...prev, [team]: prev[team] + 1 }));

  const subtractSet = (team) =>
    setSets((prev) => ({ ...prev, [team]: Math.max(0, prev[team] - 1) }));

  const cancelConfirm = () => setConfirmType(null);

  const runConfirm = () => {
    setScore(initialScore);
    setServe(null);
    if (confirmType === "match") setSets(initialSets);
    setConfirmType(null);
  };

  const updateSetting = (key, value) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const updateColor = (team, color) =>
    setSettings((prev) => ({
      ...prev,
      colors: { ...prev.colors, [team]: color },
    }));

  return (
    <div
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        width: "100vw",
        height: "100vh",
        background: "#17171a",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Inter, Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setShowSettings(true)}
        aria-label="Innstillinger"
        style={{
          position: "fixed",
          top: "max(1rem, env(safe-area-inset-top))",
          right: "1rem",
          width: 48,
          height: 48,
          borderRadius: "50%",
          border: "none",
          background: "rgba(255,255,255,0.10)",
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          zIndex: 5,
          padding: 0,
        }}
      >
        <GearIcon />
      </button>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "2vw",
          width: "100vw",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
          margin: 0,
          padding: 0,
        }}
      >
        <ScoreBox
          points={score.home}
          sets={settings.setsEnabled ? sets.home : null}
          serving={settings.serveEnabled && serve === "home"}
          onAdd={() => addPoint("home")}
          onSubtract={() => subtractPoint("home")}
          color={settings.colors.home}
        />
        <ScoreBox
          points={score.away}
          sets={settings.setsEnabled ? sets.away : null}
          serving={settings.serveEnabled && serve === "away"}
          onAdd={() => addPoint("away")}
          onSubtract={() => subtractPoint("away")}
          color={settings.colors.away}
        />
      </div>

      {confirmType && (
        <Overlay>
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
              {confirmType === "match"
                ? "Start ny kamp og nullstill både poeng og sett?"
                : "Start nytt sett og nullstill poengene?"}
            </p>
            <div
              style={{ display: "flex", gap: "1.5rem", justifyContent: "center" }}
            >
              <button
                style={{ ...buttonStyle, background: "#2061fc", color: "#fff" }}
                onClick={runConfirm}
              >
                Ja, nullstill
              </button>
              <button
                style={{ ...buttonStyle, background: "#f62641", color: "#fff" }}
                onClick={cancelConfirm}
              >
                Avbryt
              </button>
            </div>
          </div>
        </Overlay>
      )}

      {showSettings && (
        <SettingsModal
          settings={settings}
          sets={sets}
          onSetAdd={addSet}
          onSetSubtract={subtractSet}
          onUpdateSetting={updateSetting}
          onUpdateColor={updateColor}
          onNewSet={() => {
            setShowSettings(false);
            setConfirmType("set");
          }}
          onNewMatch={() => {
            setShowSettings(false);
            setConfirmType("match");
          }}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

function SetAdjuster({ label, color, value, onAdd, onSubtract }) {
  const roundButton = {
    width: 40,
    height: 40,
    borderRadius: "50%",
    border: "none",
    background: "#3a4170",
    color: "#fff",
    fontSize: "1.4rem",
    fontWeight: "bold",
    lineHeight: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    padding: 0,
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        margin: "0.7rem 0",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <span
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: color,
          }}
        />
        {label}
      </span>
      <span style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <button onClick={onSubtract} aria-label="Reduser sett" style={roundButton}>
          −
        </button>
        <span
          style={{
            fontSize: "1.4rem",
            fontWeight: "bold",
            minWidth: "1.2ch",
            textAlign: "center",
          }}
        >
          {value}
        </span>
        <button onClick={onAdd} aria-label="Øk sett" style={roundButton}>
          +
        </button>
      </span>
    </div>
  );
}

function ScoreBox({ points, sets, serving, onAdd, onSubtract, color }) {
  return (
    <div
      style={{
        position: "relative",
        background: color,
        width: "48vw",
        height: "100%",
        borderRadius: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        userSelect: "none",
        cursor: "pointer",
        margin: 0,
        boxShadow: "none",
      }}
      onClick={onAdd}
      aria-label="Trykk for å øke poeng"
    >
      <div
        style={{
          position: "absolute",
          top: "2.5vh",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 1.5vw",
          color: "#fff",
        }}
      >
        {sets !== null ? (
          <span
            style={{
              fontSize: "5vw",
              fontWeight: "bold",
              color: "#f62641",
              background: "#fff",
              borderRadius: "0.4vw",
              padding: "0.2vw 1.4vw",
              lineHeight: 1.1,
              boxShadow: "0 2px 8px #0006",
            }}
          >
            {sets}
          </span>
        ) : (
          <span />
        )}
        <span style={{ fontSize: "6vw", lineHeight: 1 }}>
          {serving ? "🏐" : ""}
        </span>
      </div>

      <span
        style={{
          fontSize: "18vw",
          fontWeight: "bold",
          color: "#fff",
          textShadow: `0 8px 32px #000b, 0 2px 0 #fff4`,
          lineHeight: "1",
        }}
      >
        {points}
      </span>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onSubtract();
        }}
        aria-label="Trekk fra poeng"
        style={{
          position: "absolute",
          bottom: "3vh",
          left: "50%",
          transform: "translateX(-50%)",
          width: "12vw",
          height: "12vw",
          maxWidth: 90,
          maxHeight: 90,
          borderRadius: "50%",
          border: "none",
          background: "rgba(0,0,0,0.28)",
          color: "#fff",
          fontSize: "7vw",
          fontWeight: "bold",
          lineHeight: "1",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          padding: 0,
        }}
      >
        −
      </button>
    </div>
  );
}

function SettingsModal({
  settings,
  sets,
  onSetAdd,
  onSetSubtract,
  onUpdateSetting,
  onUpdateColor,
  onNewSet,
  onNewMatch,
  onClose,
}) {
  return (
    <Overlay onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#232946",
          color: "#fff",
          padding: "1.8rem",
          borderRadius: "1.5rem",
          width: "min(420px, 86vw)",
          maxHeight: "86vh",
          overflowY: "auto",
          boxShadow: "0 4px 32px #0008",
          textAlign: "left",
        }}
      >
        <h2 style={{ margin: "0 0 1.4rem", textAlign: "center" }}>
          Innstillinger
        </h2>

        <p style={sectionLabel}>Farge – hjemmelag</p>
        <ColorPicker
          value={settings.colors.home}
          onChange={(c) => onUpdateColor("home", c)}
        />

        <p style={sectionLabel}>Farge – bortelag</p>
        <ColorPicker
          value={settings.colors.away}
          onChange={(c) => onUpdateColor("away", c)}
        />

        <Toggle
          label="Vis sett"
          checked={settings.setsEnabled}
          onChange={(v) => onUpdateSetting("setsEnabled", v)}
        />
        <Toggle
          label="Vis serve"
          checked={settings.serveEnabled}
          onChange={(v) => onUpdateSetting("serveEnabled", v)}
        />

        {settings.setsEnabled && (
          <>
            <p style={sectionLabel}>Juster sett</p>
            <SetAdjuster
              label="Hjemmelag"
              color={settings.colors.home}
              value={sets.home}
              onAdd={() => onSetAdd("home")}
              onSubtract={() => onSetSubtract("home")}
            />
            <SetAdjuster
              label="Bortelag"
              color={settings.colors.away}
              value={sets.away}
              onAdd={() => onSetAdd("away")}
              onSubtract={() => onSetSubtract("away")}
            />
          </>
        )}

        <button
          onClick={onNewSet}
          style={{
            ...buttonStyle,
            background: "#17171a",
            color: "#fff",
            width: "100%",
            marginTop: "1.8rem",
            border: "2px solid #888",
          }}
        >
          Nytt sett
        </button>

        <button
          onClick={onNewMatch}
          style={{
            ...buttonStyle,
            background: "#17171a",
            color: "#fff",
            width: "100%",
            marginTop: "0.8rem",
            border: "2px solid #f62641",
          }}
        >
          Ny kamp
        </button>

        <button
          onClick={onClose}
          style={{
            ...buttonStyle,
            background: "#2061fc",
            color: "#fff",
            width: "100%",
            marginTop: "0.8rem",
          }}
        >
          Lukk
        </button>
      </div>
    </Overlay>
  );
}

function ColorPicker({ value, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.6rem",
        marginBottom: "0.4rem",
      }}
    >
      {colorPresets.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          aria-label={`Velg farge ${c}`}
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: c,
            cursor: "pointer",
            padding: 0,
            border:
              value === c ? "3px solid #fff" : "3px solid rgba(255,255,255,0.15)",
            boxShadow: value === c ? "0 0 0 2px #2061fc" : "none",
          }}
        />
      ))}
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        margin: "1.1rem 0 0",
        fontSize: "1.1rem",
        cursor: "pointer",
      }}
    >
      <span>{label}</span>
      <span
        onClick={() => onChange(!checked)}
        style={{
          width: 52,
          height: 30,
          borderRadius: 15,
          background: checked ? "#22c55e" : "#555",
          position: "relative",
          transition: "background 0.2s",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 3,
            left: checked ? 25 : 3,
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "#fff",
            transition: "left 0.2s",
          }}
        />
      </span>
    </label>
  );
}

function Overlay({ children, onClick }) {
  return (
    <div
      onClick={onClick}
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
      {children}
    </div>
  );
}

function GearIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

const sectionLabel = {
  margin: "1.2rem 0 0.6rem",
  fontSize: "0.95rem",
  opacity: 0.75,
  fontWeight: "bold",
};

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
