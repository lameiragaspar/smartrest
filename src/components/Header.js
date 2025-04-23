'use client'

import React from "react"
import { motion } from "framer-motion"
import Image from "react-bootstrap/Image"

export default function Header() {
  return (
    <header className="app-header text-center py-3">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Image
          className="logo"
          src="/logo.png"
          alt="Logo do Restaurante"
          width={100}
          height={100}
        />
      </motion.div>
    </header>
  )
}
