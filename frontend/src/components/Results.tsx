import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Home, RotateCcw, Trophy, Medal } from "lucide-react";
import Img from "react-cool-img";
import confetti from "canvas-confetti";
import { Button } from "./ui/button";
import { useGame, type FoodOption } from "../lib/game-context";

function ResultsContent() {
  const navigate = useNavigate();
  const { getResults, resetVoting } = useGame();
  const [results, setResults] = useState<{ food: FoodOption; votes: number }[]>(
    [],
  );
  const [hasConfettiFired, setHasConfettiFired] = useState(false);

  useEffect(() => {
    getResults().then(setResults);
  }, []);

  const fireConfetti = useCallback(() => {
    if (hasConfettiFired) return;
    setHasConfettiFired(true);

    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ["#9333ea", "#ec4899", "#f97316", "#eab308"];

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, [hasConfettiFired]);

  useEffect(() => {
    if (results.length > 0 && results[0].votes > 0) {
      const timer = setTimeout(fireConfetti, 500);
      return () => clearTimeout(timer);
    }
  }, [results, fireConfetti]);

  const handlePlayAgain = () => {
    resetVoting();
    navigate("/votar");
  };

  const winner = results[0];
  const hasWinner = winner && winner.votes > 0;
  const topThree = results.slice(0, 3);

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
            className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="w-5 h-5" />
          </Link>
          <span className="text-sm font-medium text-muted-foreground">
            Resultado
          </span>
          <button
            onClick={handlePlayAgain}
            className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </motion.header>

      {/* Content */}
      <section className="flex-1 px-4 py-4">
        <div className="max-w-md mx-auto">
          {hasWinner ? (
            <>
              {/* Winner Section */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="text-center mb-6"
              >
                <motion.div
                  initial={{ rotate: -10 }}
                  animate={{ rotate: [10, -10, 10, 0] }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="inline-block mb-4"
                >
                  <span className="text-6xl">🎉</span>
                </motion.div>
                <h1 className="text-2xl font-bold text-foreground mb-1">
                  Temos um match!
                </h1>
                <p className="text-muted-foreground">O grupo decidiu!</p>
              </motion.div>

              {/* Winner Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-card rounded-[2rem] shadow-xl border-2 border-primary/30 overflow-hidden mb-6"
              >
                <div className="relative aspect-[4/3]">
                  <Img
                    src={winner.food.image}
                    alt={winner.food.name}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Trophy badge */}
                  <div className="absolute top-4 right-4">
                    <div className="gradient-warm w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg">
                      <Trophy className="w-7 h-7 text-white" />
                    </div>
                  </div>

                  {/* Winner info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="inline-block px-3 py-1 bg-primary/80 backdrop-blur-sm rounded-full text-xs text-primary-foreground mb-2">
                      {winner.votes} votos
                    </span>
                    <h2 className="text-3xl font-bold text-white">
                      {winner.food.name}
                    </h2>
                  </div>
                </div>
              </motion.div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mb-6"
            >
              <span className="text-6xl mb-4 block">🤔</span>
              <h1 className="text-2xl font-bold text-foreground mb-1">
                Empate!
              </h1>
              <p className="text-muted-foreground">
                Veja os mais votados abaixo
              </p>
            </motion.div>
          )}

          {/* Podium */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Top 3
            </h3>
            <div className="space-y-3">
              {topThree.map((item, index) => (
                <motion.div
                  key={item.food.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className={`flex items-center gap-4 p-3 rounded-2xl border transition-colors ${
                    index === 0
                      ? "bg-primary/10 border-primary/30"
                      : "bg-card border-border/50"
                  }`}
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    <Img
                      src={item.food.image}
                      alt={item.food.name}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      {index === 0 && (
                        <Trophy className="w-4 h-4 text-amber-500" />
                      )}
                      {index === 1 && (
                        <Medal className="w-4 h-4 text-zinc-400" />
                      )}
                      {index === 2 && (
                        <Medal className="w-4 h-4 text-amber-700" />
                      )}
                      <span className="font-semibold text-foreground truncate">
                        {item.food.name}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {item.votes} {item.votes === 1 ? "voto" : "votos"}
                    </span>
                  </div>
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                      index === 0
                        ? "gradient-warm text-white"
                        : index === 1
                          ? "bg-zinc-200 text-zinc-600"
                          : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {index + 1}º
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bottom Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="sticky bottom-0 px-4 py-4 bg-gradient-to-t from-background via-background to-transparent safe-bottom"
      >
        <div className="max-w-md mx-auto flex gap-3 mb-16">
          <Link to="/" className="flex-1">
            <Button
              variant="outline"
              size="lg"
              className="w-full h-14 text-lg font-semibold rounded-2xl border-2 border-primary/30 bg-card/80"
            >
              Início
            </Button>
          </Link>
          <Button
            size="lg"
            onClick={handlePlayAgain}
            className="flex-1 h-14 text-lg font-semibold rounded-2xl gradient-primary border-0 text-primary-foreground shadow-lg"
          >
            Jogar novamente
          </Button>
        </div>
      </motion.div>
    </main>
  );
}

export default function ResultsPage() {
  return <ResultsContent />;
}
