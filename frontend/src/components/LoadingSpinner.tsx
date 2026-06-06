import { motion } from "framer-motion";

export default function LoadingSpinner() {
  return (
    <main className="min-h-screen gradient-hero flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="flex justify-center gap-1">
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
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </div>
    </main>
  );
}