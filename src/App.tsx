import { Scene } from "./components/Scene";
import { HKClock } from "./components/HKClock";
import { Legend } from "./components/Legend";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Scene />
      <HKClock />
      <Legend />
      <div className="hint">Drag to rotate · Scroll to zoom</div>
    </div>
  );
}

export default App;
