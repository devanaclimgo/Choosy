import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useGame } from "../lib/game-context";

function JoinRoomContent() {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { joinRoom } = useGame();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim() && name.trim()) {
      const success = await joinRoom(
        code.trim().toUpperCase(),
        name.trim(),
      );
      if (success) {
        navigate("/sala-de-espera");
      } else {
        setError("Sala não encontrada. Verifique o código e tente novamente.");
      }
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (value.length <= 6) {
      setCode(value);
    }
  };

  return (
    <main className="min-h-screen gradient-hero">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 py-4"
      >
        <div className="max-w-md mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </Link>
        </div>
      </motion.header>

      {/* Content */}
      <section className="px-4 pt-8">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-8"
          >
            <div className="gradient-accent w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-xl mb-4">
              <span className="text-4xl">🎯</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Entrar em uma sala
            </h1>
            <p className="text-muted-foreground">
              Digite o código da sala e seu nome
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="bg-card rounded-3xl p-6 shadow-sm border border-border/50 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Código da sala
                </label>
                <Input
                  type="text"
                  placeholder="ABCDEF"
                  value={code}
                  onChange={handleCodeChange}
                  className="h-14 text-2xl text-center tracking-[0.3em] font-bold rounded-2xl border-2 border-border focus:border-primary bg-background uppercase"
                  maxLength={6}
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Seu nome
                </label>
                <Input
                  type="text"
                  placeholder="Digite seu nome..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-14 text-lg rounded-2xl border-2 border-border focus:border-primary bg-background"
                  maxLength={20}
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={!code.trim() || code.length < 6 || !name.trim()}
              className="w-full h-14 text-lg font-semibold rounded-2xl gradient-primary border-0 text-primary-foreground shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Entrar
            </Button>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="flex items-start gap-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-2xl px-4 py-3 text-sm"
                >
                  <span className="text-lg leading-none">😕</span>
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>
        </div>
      </section>
    </main>
  );
}

export default function JoinRoomPage() {
  return <JoinRoomContent />;
}
