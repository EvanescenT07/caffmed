"use client";

import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { RxHamburgerMenu } from "react-icons/rx";
import { X, Home, BookOpen, User } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion"; // ✅ Removed AnimatePresence import
import { useState } from "react";
import { ModeToggle } from "@/components/theme/theme-toogle";

const MobileNavbar = () => {
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const routes = [
    {
      name: "Home",
      path: "/",
      active: path === "/",
      icon: Home,
      description: "Back to homepage",
    },
    {
      name: "Knowledge",
      path: "/knowledge",
      active: path === "/knowledge",
      icon: BookOpen,
      description: "Learn about brain tumors",
    },
    {
      name: "About",
      path: "/about",
      active: path === "/about",
      icon: User,
      description: "About our platform",
    },
  ];

  const menuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    closed: {
      opacity: 0,
      x: -20,
    },
    open: {
      opacity: 1,
      x: 0,
    },
  };

  return (
    <div className="flex items-center gap-3">
      {/* Theme toggle for mobile */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="xl:hidden"
      >
        <ModeToggle />
      </motion.div>

      {/* Mobile Menu */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center p-3 rounded-xl bg-card border border-border hover:bg-accent transition-all duration-200 shadow-sm"
          >
            <motion.div
              animate={isOpen ? "open" : "closed"}
              variants={{
                closed: { rotate: 0 },
                open: { rotate: 90 },
              }}
              transition={{ duration: 0.2 }}
            >
              <RxHamburgerMenu className="text-[20px] text-foreground" />
            </motion.div>
          </motion.button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="w-[320px] bg-background/95 backdrop-blur-xl border-l border-border/50"
        >
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="flex flex-col h-full"
          >
            {/* Header */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between pt-6 pb-8 border-b border-border/20"
            >
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                    Caff
                  </span>
                  <span className="text-foreground">med</span>
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Brain Tumor Detection
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(false)}
                className="p-1 mx-2 rounded-lg hover:bg-accent transition-colors"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </motion.button>
            </motion.div>

            {/* Navigation Links */}
            <motion.nav
              className="flex flex-col space-y-3 flex-1 py-6"
              variants={menuVariants}
            >
              {routes.map((route) => {
                const IconComponent = route.icon;
                return (
                  <motion.div
                    key={route.path}
                    variants={itemVariants}
                    whileHover={{ x: 8 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href={route.path}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-4 px-4 py-4 rounded-xl font-medium transition-all duration-300 group relative overflow-hidden",
                        route.active
                          ? "text-white bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-500/25"
                          : "text-foreground hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:shadow-lg hover:shadow-blue-500/20"
                      )}
                    >
                      {/* Background glow effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-blue-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ scale: 0.8 }}
                        whileHover={{ scale: 1 }}
                      />

                      <IconComponent
                        className={cn(
                          "w-5 h-5 transition-colors duration-200 relative z-10",
                          route.active
                            ? "text-white"
                            : "text-muted-foreground group-hover:text-white"
                        )}
                      />

                      <div className="flex-1 relative z-10">
                        <span className="font-semibold text-base">
                          {route.name}
                        </span>
                        <p
                          className={cn(
                            "text-xs transition-colors duration-200",
                            route.active
                              ? "text-white/80"
                              : "text-muted-foreground group-hover:text-white/80"
                          )}
                        >
                          {route.description}
                        </p>
                      </div>

                      {/* Active indicator */}
                      {route.active && (
                        <motion.div
                          layoutId="mobileActiveTab"
                          className="absolute left-0 top-0 w-1 h-full bg-white rounded-r-full"
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                        />
                      )}

                      {/* Shimmer effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        animate={{
                          x: route.active ? 0 : [-100, 100],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: route.active ? 0 : Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </Link>
                  </motion.div>
                );
              })}
            </motion.nav>

            {/* Footer Section */}
            <motion.div
              variants={itemVariants}
              className="pt-6 border-t border-border/20 space-y-4"
            >
              {/* Theme Settings */}
              <div className="flex items-center justify-between px-4 py-3 bg-card rounded-xl border border-border/50">
                <div>
                  <span className="text-sm font-medium text-foreground">
                    Theme
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Customize appearance
                  </p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ModeToggle />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavbar;
