import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Home, RotateCcw, X, Check } from "lucide-react";
import Img from "react-cool-img";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { useGame } from "../lib/game-context";

function VotingContent() {
  const navigate = useNavigate();
  const { room, getFoodOptions, submitVote, resetVoting } = useGame();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);

  const foodOptions = getFoodOptions();
  const currentFood = foodOptions[currentIndex];
  const progress = (currentIndex / foodOptions.length) * 100;

  useEffect(() => {
    if (currentIndex >= foodOptions.length) {
      navigate("/resultado");
    }
  }, [currentIndex, foodOptions.length, navigate]);

  const handleVote = (vote: boolean) => {
    if (isAnimating || currentIndex >= foodOptions.length) return;

    setIsAnimating(true);
    setDirection(vote ? "right" : "left");
    submitVote(currentFood.id, vote);

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setIsAnimating(false);
      setDirection(null);
    }, 300);
  };

  const handleReset = () => {
    resetVoting();
    setCurrentIndex(0);
  };

  if (currentIndex >= foodOptions.length) {
    return null;
  }

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
          <div className="bg-card rounded-full px-4 py-1.5 shadow-sm border border-border/50">
            <span className="text-sm font-bold tracking-wider text-foreground">
              {room?.code || "DEMO"}
            </span>
          </div>
          <button
            onClick={handleReset}
            className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </motion.header>

      {/* Progress */}
      <div className="px-4 mb-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} de {foodOptions.length}
            </span>
            <span className="text-sm font-medium text-foreground">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2 rounded-full" />
        </div>
      </div>

      {/* Food Card */}
      <section className="flex-1 px-4 flex items-center justify-center py-4">
        <div className="max-w-md w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFood.id}
              initial={{ opacity: 0, scale: 0.9, x: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
                x:
                  direction === "left" ? -100 : direction === "right" ? 100 : 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                x:
                  direction === "left" ? -200 : direction === "right" ? 200 : 0,
              }}
              transition={{ duration: 0.3 }}
              className="bg-card rounded-[2rem] shadow-xl border border-border/50 overflow-hidden"
            >
              <div className="relative aspect-square">
                <Img
                  src={currentFood.image}
                  alt={currentFood.name}
                  fill
                  className="object-cover"
                  priority
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Food info */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white mb-2">
                    {currentFood.category}
                  </span>
                  <h2 className="text-3xl font-bold text-white text-balance">
                    {currentFood.name}
                  </h2>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Vote Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="sticky bottom-0 px-4 py-6 bg-gradient-to-t from-background via-background to-transparent safe-bottom"
      >
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-2 gap-4 mb-16">
            <Button
              size="lg"
              onClick={() => handleVote(false)}
              disabled={isAnimating}
              className="h-20 text-xl font-bold rounded-3xl border-0 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, #E24B4A 0%, #A32D2D 100%)",
              }}
            >
              <X className="w-8 h-8 mr-2" strokeWidth={3} />
              NÃO
            </Button>
            <Button
              size="lg"
              onClick={() => handleVote(true)}
              disabled={isAnimating}
              className="h-20 text-xl font-bold rounded-3xl border-0 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, #639922 0%, #3B6D11 100%)",
              }}
            >
              <Check className="w-8 h-8 mr-2" strokeWidth={3} />
              SIM
            </Button>
          </div>
        </div>
      </motion.div>
    </main>
  );
}

export default function VotingPage() {
  return <VotingContent />;
}
