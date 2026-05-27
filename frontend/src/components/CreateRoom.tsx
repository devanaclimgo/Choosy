import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useGame } from "../lib/game-context";

function CreateRoomContent() {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { createRoom } = useGame();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (name.trim()) {
      await createRoom(name.trim());
      navigate("/sala-de-espera");
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
            <div className="gradient-primary w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-xl mb-4">
              <span className="text-4xl">✨</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Criar nova sala
            </h1>
            <p className="text-muted-foreground">
              Escolha seu nome para começar
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="bg-card rounded-3xl p-6 shadow-sm border border-border/50">
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
                autoFocus
              />
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={!name.trim()}
              className="w-full h-14 text-lg font-semibold rounded-2xl gradient-primary border-0 text-primary-foreground shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuar
            </Button>
          </motion.form>
        </div>
      </section>
    </main>
  );
}

export default function CreateRoomPage() {
  return <CreateRoomContent />;
}
