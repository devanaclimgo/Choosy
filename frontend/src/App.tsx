import { Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import CreateRoomPage from "./components/CreateRoom";
import JoinRoom from "./components/JoinRoom";
import VotingPage from "./components/VotingContent";
import WaitingRoomPage from "./components/WaitingRoom";
import WaitingPage from "./components/WaitingPage";
import ResultsPage from "./components/Results";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/criar-sala" element={<CreateRoomPage />} />
      <Route path="/entrar" element={<JoinRoom />} />
      <Route path="/votar" element={<VotingPage />} />
      <Route path="/sala-de-espera/:code" element={<WaitingRoomPage />} />
      <Route path="/sala-de-espera" element={<WaitingRoomPage />} />
      <Route path="/aguardando" element={<WaitingPage />} />
      <Route path="/resultado" element={<ResultsPage />} />
    </Routes>
  );
}

export default App;