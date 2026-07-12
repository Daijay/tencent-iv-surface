import { Scene } from "./components/Scene";
import { Legend } from "./components/Legend";
import { useFullscreenToggle } from "./useFullscreenToggle";
import "./App.css";

function App() {
  useFullscreenToggle();

  return (
    <div className="app">
      <Scene />
      <div className="title">
        <span className="title__ticker">0700.HK</span>
        <span className="title__name">Tencent, Implied Volatility Surface</span>
      </div>
      <Legend />
      <div className="hint">Drag to rotate · Scroll to zoom · Press F for fullscreen</div>
    </div>
  );
}

export default App;
