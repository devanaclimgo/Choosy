import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Copy, Check, Home, Users } from "lucide-react";
import { Button } from "./ui/button";
import { useGame } from "../lib/game-context";

function WaitingRoomContent() {
  const navigate = useNavigate();
  const { room, currentPlayer, startVoting } = useGame();
  const [copied, setCopied] = useState(false);
  const [showMinPlayersWarning, setShowMinPlayersWarning] = useState(false);

  const handleCopyCode = async () => {
    if (room?.code) {
      await navigator.clipboard.writeText(room.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleStartVoting = () => {
    if (allPlayers.length < 2) {
      setShowMinPlayersWarning(true);
      setTimeout(() => setShowMinPlayersWarning(false), 3000);
      return;
    }
    startVoting();
    navigate("/votar");
  };

  // Redirect if no room
  useEffect(() => {
    if (!room) {
      navigate("/criar-sala");
    }
  }, [room, navigate]);

  if (!room || !currentPlayer) {
    return null;
  }

  const allPlayers = room.players;

  return (
    <main className="min-h-screen gradient-hero flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 py-4"
      >
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">
              {allPlayers.length} jogadores
            </span>
          </div>
        </div>
      </motion.header>

      {/* Content */}
      <section className="flex-1 px-4 pt-4 pb-8">
        <div className="max-w-md mx-auto">
          {/* Room Code Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-3xl p-6 shadow-lg border border-border/50 mb-6 text-center"
          >
            <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wider">
              Código da sala
            </p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl font-bold tracking-[0.2em] text-foreground">
                {room.code}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopyCode}
                className="rounded-xl hover:bg-secondary"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-success" />
                ) : (
                  <Copy className="w-5 h-5 text-muted-foreground" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Compartilhe com seus amigos
            </p>
          </motion.div>

          {/* Players Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Jogadores na sala
            </h2>
            <div className="bg-card rounded-3xl p-4 shadow-sm border border-border/50">
              <div className="grid grid-cols-4 gap-3">
                <AnimatePresence mode="popLayout">
                  {allPlayers.map((player, index) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex flex-col items-center"
                    >
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-1 ${
                          player.id === currentPlayer.id
                            ? "gradient-primary shadow-md"
                            : "bg-secondary"
                        }`}
                      >
                        {player.avatar}
                      </div>
                      <span className="text-xs text-foreground font-medium truncate max-w-full">
                        {player.id === currentPlayer.id ? "Você" : player.name}
                      </span>
                    </motion.div>
                  ))}
                  {/* Empty slots */}
                  {Array.from({
                    length: Math.max(0, 4 - allPlayers.length),
                  }).map((_, i) => (
                    <motion.div
                      key={`empty-${i}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-muted/50 border-2 border-dashed border-border flex items-center justify-center mb-1">
                        <span className="text-muted-foreground text-lg">?</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Aguardando...
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Waiting animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-6"
          >
            <div className="flex justify-center gap-1 mb-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Aguardando jogadores...
            </p>
          </motion.div>
        </div>
      </section>

      {/* Fixed Bottom Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="sticky bottom-0 px-4 py-4 bg-gradient-to-t from-background via-background to-transparent safe-bottom"
      >
        <div className="max-w-md mx-auto mb-16">
          <Button
            size="lg"
            onClick={handleStartVoting}
            className="w-full h-14 text-lg font-semibold rounded-2xl gradient-primary border-0 text-primary-foreground shadow-lg hover:shadow-xl transition-all"
          >
            Começar votação
          </Button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showMinPlayersWarning && (
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 0.97, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed bottom-28 left-0 right-0 flex justify-center px-4 z-50"
          >
            <div className="flex items-center gap-3 bg-card border border-border shadow-xl rounded-2xl px-5 py-4 max-w-sm w-full">
              <span className="text-2xl">👥</span>
              <div>
                <p className="font-semibold text-foreground text-sm">
                  Poucos jogadores
                </p>
                <p className="text-muted-foreground text-xs mt-0.5">
                  Precisa de pelo menos 2 pessoas para começar.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function WaitingRoomPage() {
  return <WaitingRoomContent />;
}
