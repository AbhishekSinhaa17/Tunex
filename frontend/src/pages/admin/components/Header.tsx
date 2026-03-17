import { UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AudioLines, Shield, Zap } from "lucide-react";

const Header = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative mb-10"
    >
      {/* Background glass container */}
      <div className="relative overflow-hidden rounded-2xl bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 p-6 shadow-2xl shadow-black/20">
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Moving gradient orbs */}
          <motion.div
            animate={{
              x: [0, 50, 0],
              y: [0, -20, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-[60px]"
          />
          <motion.div
            animate={{
              x: [0, -30, 0],
              y: [0, 20, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-10 right-20 w-40 h-40 bg-violet-500/8 rounded-full blur-[60px]"
          />

          {/* Floating particles */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -40, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0, 0.4, 0],
              }}
              transition={{
                duration: 4 + i * 1.5,
                repeat: Infinity,
                delay: i * 0.8,
                ease: "easeInOut",
              }}
              className="absolute size-1 rounded-full bg-emerald-400"
              style={{
                left: `${15 + i * 18}%`,
                top: `${60 + (i % 3) * 15}%`,
              }}
            />
          ))}

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Top accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent origin-center"
        />

        <div className="relative flex items-center justify-between">
          {/* Left section - Logo & Title */}
          <div className="flex items-center gap-5">
            {/* Animated Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.15,
                type: "spring",
                stiffness: 200,
              }}
              className="relative group"
            >
              {/* Logo glow */}
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -inset-2 bg-emerald-500/15 rounded-2xl blur-xl"
              />

              {/* Rotating ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute -inset-1 rounded-2xl"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent, rgba(16,185,129,0.2), transparent, transparent)",
                }}
              />

              <Link
                to="/"
                className="relative block p-1 rounded-2xl bg-zinc-900/60 ring-1 ring-zinc-700/50 group-hover:ring-emerald-500/30 transition-all duration-500 shadow-xl shadow-black/30"
              >
                <motion.img
                  src="/logo.png"
                  className="size-14 rounded-xl object-contain"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                />
              </Link>
            </motion.div>

            {/* Title & Description */}
            <div className="flex flex-col">
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.25,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex items-center gap-3"
              >
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent tracking-tight">
                  Music Manager
                </h1>

                {/* Admin badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.6,
                    type: "spring",
                    stiffness: 300,
                  }}
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/20"
                >
                  <Shield className="size-3 text-emerald-400" />
                  <span className="text-[11px] font-semibold text-emerald-400 tracking-wide uppercase">
                    Admin
                  </span>
                </motion.div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.35,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="text-sm text-zinc-500 font-medium mt-1"
              >
                Manage your music catalog with ease
              </motion.p>

              {/* Status indicators */}
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-3 mt-2.5"
              >
                <div className="flex items-center gap-1.5">
                  <span className="relative flex size-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full size-1.5 bg-emerald-500" />
                  </span>
                  <span className="text-[11px] text-zinc-500 font-medium">
                    System Online
                  </span>
                </div>
                <div className="h-3 w-px bg-zinc-800" />
                <div className="flex items-center gap-1.5">
                  <Zap className="size-3 text-yellow-500" />
                  <span className="text-[11px] text-zinc-500 font-medium">
                    Real-time Sync
                  </span>
                </div>
                <div className="h-3 w-px bg-zinc-800" />
                <div className="flex items-center gap-1.5">
                  <AudioLines className="size-3 text-violet-400" />
                  <span className="text-[11px] text-zinc-500 font-medium">
                    Audio Engine Active
                  </span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right section - User & Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex items-center gap-4"
          >
            {/* Decorative waveform */}
            <div className="hidden md:flex items-end gap-[3px] h-8 mr-2">
              {[40, 70, 50, 85, 60, 90, 45, 75, 55].map((height, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: [`${height * 0.3}%`, `${height}%`, `${height * 0.3}%`],
                  }}
                  transition={{
                    duration: 1 + Math.random() * 0.5,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeInOut",
                  }}
                  className="w-[3px] rounded-full bg-gradient-to-t from-emerald-500/30 to-emerald-400/60"
                />
              ))}
            </div>

            {/* User button wrapper */}
            <div className="relative group">
              {/* Glow ring */}
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -inset-2 bg-emerald-500/10 rounded-full blur-md"
              />
              <div className="relative p-1 rounded-full ring-2 ring-zinc-700/50 group-hover:ring-emerald-500/30 transition-all duration-500 bg-zinc-900/50">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "size-9",
                    },
                  }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom gradient accent */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
      </div>
    </motion.div>
  );
};

export default Header;