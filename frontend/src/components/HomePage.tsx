import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Navbar } from "./navbar"
import { FeatureCard } from "./feature-card"
import { Button } from "./ui/button"
import { GameProvider } from "../lib/game-context"

function LandingContent() {
  return (
    <main className="min-h-screen gradient-hero">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-8 px-4">
        <div className="max-w-md mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="gradient-primary w-24 h-24 rounded-[2rem] mx-auto flex items-center justify-center shadow-xl mb-6">
              <span className="text-5xl">🍽️</span>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-3 text-balance">
              Choosy
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed text-balance">
              Vote together. Eat happier.
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground mb-8 text-balance"
          >
            Pare de discutir sobre comida. Deixe o grupo decidir juntos!
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-3 mb-12"
          >
            <Link to="/criar-sala">
              <Button
                size="lg"
                className="w-full h-14 text-lg font-semibold rounded-2xl gradient-primary border-0 text-primary-foreground shadow-lg hover:shadow-xl transition-shadow hover:scale-[1.02]"
              >
                Criar sala
              </Button>
            </Link>
            <Link to="/entrar">
              <Button
                size="lg"
                variant="outline"
                className="w-full h-14 text-lg font-semibold rounded-2xl border-2 border-primary/30 bg-card/80 backdrop-blur-sm hover:bg-card hover:border-primary/50 transition-all"
              >
                Entrar em uma sala
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 pb-12">
        <div className="max-w-md mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm font-medium text-muted-foreground uppercase tracking-wider text-center mb-4"
          >
            Como funciona
          </motion.h2>
          
          <div className="grid gap-3">
            <FeatureCard
              icon="⚡"
              title="Votação rápida"
              description="Escolha entre as opções com apenas um toque. Simples e direto."
              delay={0.5}
            />
            <FeatureCard
              icon="👥"
              title="Funciona em grupo"
              description="Convide amigos com um código. Todos votam ao mesmo tempo."
              delay={0.6}
            />
            <FeatureCard
              icon="✨"
              title="Match automático"
              description="O app encontra o que todos concordam. Sem discussão!"
              delay={0.7}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 pb-8">
        <div className="max-w-md mx-auto text-center">
          <p className="text-xs text-muted-foreground">
            Feito para grupos famintos
          </p>
          <span className="text-xs text-muted-foreground">
            Desenvolvido por <a href="https://www.linkedin.com/in/ana-gomes-dev" className="text-primary hover:underline" no-opener no-referrer target="_blank">
              Ana Gomes
            </a>
          </span>
        </div>
      </footer>
    </main>
  )
}

export default function Home() {
  return (
    <GameProvider>
      <LandingContent />
    </GameProvider>
  )
}
