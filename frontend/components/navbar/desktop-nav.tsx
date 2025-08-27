"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const DesktopNavbar = () => {
  const path = usePathname();

  const routes = [
    {
      name: "Home",
      path: "/",
      active: path === "/",
    },
    {
      name: "Knowledge",
      path: "/knowledge",
      active: path === "/knowledge",
    },
    {
      name: "About",
      path: "/about",
      active: path === "/about",
    },
  ];

  return (
    <motion.div
      className="flex items-center space-x-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, staggerChildren: 0.1 }}
    >
      {routes.map((route, index) => (
        <motion.div
          key={route.path}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link
            href={route.path}
            className={cn(
              "relative px-6 py-4 rounded-xl font-medium transition-all duration-300 overflow-hidden",
              route.active
                ? "text-white bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-500/25"
                : "text-foreground hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:shadow-lg hover:shadow-blue-500/20"
            )}
          >
            {/* Text content */}
            <span className="relative z-10 font-semibold">{route.name}</span>

            {/* Active indicator - enhanced */}
            {route.active && (
              <>
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-white rounded-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </>
            )}

            
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default DesktopNavbar;
