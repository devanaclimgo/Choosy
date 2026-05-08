"use client"

import { motion } from "framer-motion"
import { Link } from "react-router-dom"

export function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
    >
      <div className="max-w-md mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <div className="gradient-primary w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-xl">🍽️</span>
          </div>
          <span className="text-xl font-bold text-foreground">Choosy</span>
        </Link>
      </div>
    </motion.nav>
  )
}
