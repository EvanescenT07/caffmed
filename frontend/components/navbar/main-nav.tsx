"use client";

import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { ModeToggle } from "@/components/theme/theme-toogle";
import DesktopNavbar from "@/components/navbar/desktop-nav";
import MobileNavbar from "@/components/navbar/mobile-nav";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 w-full px-4 xl:px-10 py-4 xl:py-6 transition-all duration-500 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-black/5"
          : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link href="/" className="group">
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
            >
              {/* Logo Icon */}
              <motion.div
                className="w-10 h-10 bg-gradient-to-br rounded-xl flex items-center justify-center shadow-lg shadow-black dark:shadow-white"
                whileHover={{
                  rotate: [0, -5, 5, 0],
                  transition: { duration: 0.5 },
                }}
              >
                <span className="text-black dark:text-white font-bold text-lg">
                  C
                </span>
              </motion.div>

              {/* Logo Text */}
              <motion.h1
                className="text-3xl xl:text-4xl font-bold text-foreground"
                whileHover={{ scale: 1.02 }}
              >
                <span className="bg-gradient-to-r from-black to-gray-400 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                  Caff.
                </span>
                <motion.span
                  className="relative inline-block"
                  whileHover={{
                    rotate: [0, -3, 3, 0],
                    transition: { duration: 0.5 },
                  }}
                >
                  med
                </motion.span>
              </motion.h1>
            </motion.div>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden xl:flex items-center gap-8"
        >
          <DesktopNavbar />
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="ml-2"
          >
            <ModeToggle />
          </motion.div>
        </motion.div>

        {/* Mobile Navigation */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="xl:hidden"
        >
          <MobileNavbar />
        </motion.div>
      </div>

      {/* Enhanced gradient line at bottom when scrolled */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{
          scaleX: isScrolled ? 1 : 0,
          opacity: isScrolled ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black dark:via-white to-transparent origin-center"
      />

      {/* Subtle glow effect when scrolled */}
      {isScrolled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 0.4 }}
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-64 h-px blur-sm"
        />
      )}
    </motion.nav>
  );
};

export default Navbar;
