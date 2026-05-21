import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GameProvider } from "./lib/game-context";
import { BrowserRouter } from "react-router-dom";
import "./style.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <GameProvider>
        <App />
      </GameProvider>
    </BrowserRouter>
  </React.StrictMode>,
);