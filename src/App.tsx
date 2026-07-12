import { Scene } from "./components/Scene";
import { Legend } from "./components/Legend";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Scene />
      <div className="title">
        <span className="title__ticker">0700.HK</span>
        <span className="title__name">Tencent — Implied Volatility Surface</span>
      </div>
      <Legend />
      <div className="hint">Drag to rotate · Scroll to zoom</div>
    </div>
  );
}

export default App;
