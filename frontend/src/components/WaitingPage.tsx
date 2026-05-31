import { useNavigate } from "react-router-dom";
import { useGame } from "../lib/game-context";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getVotingStatus } from "../services/room_service";

export default function WaitingPage() {
  const navigate = useNavigate();
  const { room } = useGame();

  const [status, setStatus] = useState({
    players_count: 0,
    finished_players: 0,
  });

  useEffect(() => {
    const interval = setInterval(async () => {
      const data = await getVotingStatus(room!.code);
      setStatus(data);
      if (data.all_finished) {
        navigate("/resultado");
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const progress = status.players_count > 0
    ? (status.finished_players / status.players_count) * 100
    : 0;

  return (
    <main className="min-h-screen gradient-hero flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-sm w-full text-center"
      >
        {/* Ícone animado */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <motion.div
            className="w-24 h-24 rounded-3xl gradient-primary flex items-center justify-center shadow-xl"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-5xl">⏳</span>
          </motion.div>
        </div>

        {/* Texto */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-bold text-foreground mb-2"
        >
          Quase lá!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground mb-8"
        >
          Aguardando os outros jogadores terminarem...
        </motion.p>

        {/* Card de progresso */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-3xl p-6 shadow-sm border border-border/50 mb-6"
        >
          {/* Contador */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-4xl font-bold text-foreground">
              {status.finished_players}
            </span>
            <span className="text-2xl text-muted-foreground font-light">/</span>
            <span className="text-4xl font-bold text-muted-foreground">
              {status.players_count}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            jogadores terminaram
          </p>

          {/* Barra de progresso */}
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full gradient-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Dots animados */}
        <div className="flex justify-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-primary"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </motion.div>
    </main>
  );
}