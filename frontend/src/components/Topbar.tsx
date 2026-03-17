import { SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon, Search, X, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import SignInOAuthButtons from "./SignInOAuthButtons";
import { useAuthStore } from "@/stores/useAuthStore";
import { useMusicStore } from "@/stores/useMusicStore";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Topbar = () => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const { isAdmin } = useAuthStore();
  const { searchSongs } = useMusicStore();

  const handleClear = () => {
    setQuery("");
    searchSongs("");
  };

  return (
    <div
      className="flex items-center justify-between p-4 sticky top-0 z-50
                 backdrop-blur-xl border-b border-white/[0.06]"
      style={{
        background:
          "linear-gradient(180deg, rgba(12,10,26,0.8) 0%, rgba(8,8,14,0.6) 100%)",
      }}
    >
      {/* Logo Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3"
      >
        {/* Animated Logo Icon */}
        <div className="relative group">
          {/* Outer rotating ring */}
          <motion.div
            className="absolute -inset-1 rounded-2xl blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background:
                "linear-gradient(135deg, rgba(139,92,246,0.6), rgba(6,182,212,0.6))",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />

          {/* Logo container */}
          <motion.div
            className="relative w-11 h-11 rounded-xl flex items-center justify-center
                       bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm
                       shadow-xl overflow-hidden"
            whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.5 }}
          >
            {/* Inner shimmer */}
            <motion.div
              className="absolute inset-0 opacity-20"
              style={{
                background:
                  "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)",
              }}
              animate={{ x: ["-200%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
            />

            <img
              src="/logo1.png"
              alt="Tunex Logo"
              className="w-7 h-7 object-contain relative z-10 drop-shadow-lg"
            />

            {/* Floating sparkle */}
            <motion.div
              className="absolute top-0.5 right-0.5"
              animate={{
                scale: [0, 1, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              <Sparkles className="w-2 h-2 text-yellow-300" />
            </motion.div>
          </motion.div>
        </div>

        {/* Brand name */}
        <div className="hidden sm:block">
          <motion.h1
            className="text-2xl font-black tracking-tight leading-none"
            style={{
              background:
                "linear-gradient(135deg, #a78bfa, #22d3ee, #a78bfa)",
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          >
            Tunex
          </motion.h1>
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
            Music Player
          </p>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative flex-1 max-w-md mx-4"
      >
        <div className="relative group">
          {/* Glow effect on focus */}
          <motion.div
            className="absolute -inset-0.5 rounded-xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"
            style={{
              background:
                "linear-gradient(90deg, rgba(139,92,246,0.3), rgba(6,182,212,0.3))",
            }}
          />

          {/* Search icon */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
            <Search
              className={`w-4 h-4 transition-colors duration-300 ${
                isFocused ? "text-violet-400" : "text-zinc-500"
              }`}
            />
          </div>

          {/* Input */}
          <input
            type="text"
            placeholder="Search for songs, artists, albums..."
            value={query}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="relative w-full bg-white/[0.04] hover:bg-white/[0.06] focus:bg-white/[0.08]
                       border border-white/[0.08] hover:border-white/[0.12] focus:border-violet-500/30
                       rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-zinc-600
                       outline-none transition-all duration-300 backdrop-blur-sm"
            onChange={(e) => {
              const value = e.target.value;
              setQuery(value);
              searchSongs(value);
            }}
          />

          {/* Clear button */}
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg
                           bg-white/[0.08] hover:bg-white/[0.12] text-zinc-500 hover:text-white
                           transition-all duration-200"
                onClick={handleClear}
              >
                <X className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Search suggestions hint */}
        <AnimatePresence>
          {isFocused && !query && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute top-full mt-2 left-0 right-0 p-3 rounded-xl
                         bg-zinc-900/95 backdrop-blur-xl border border-white/[0.08]
                         shadow-2xl"
            >
              <p className="text-xs text-zinc-500 mb-2 font-medium">
                Try searching for:
              </p>
              <div className="flex flex-wrap gap-2">
                {["Pop", "Rock", "Jazz", "Classical"].map((genre) => (
                  <motion.button
                    key={genre}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setQuery(genre);
                      searchSongs(genre);
                    }}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-medium
                               bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white
                               border border-white/[0.06] transition-all duration-200"
                  >
                    {genre}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Right Section */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex items-center gap-3"
      >
        {/* Admin Dashboard Button */}
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/admin"
              className="relative group px-4 py-2 rounded-xl overflow-hidden
                         bg-gradient-to-r from-violet-600/20 to-cyan-600/20
                         border border-violet-500/30 hover:border-violet-500/50
                         text-sm font-semibold text-violet-300 hover:text-white
                         transition-all duration-300 flex items-center gap-2"
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                }}
                animate={{ x: ["-200%", "200%"] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
              />

              <LayoutDashboardIcon className="w-4 h-4 relative z-10" />
              <span className="relative z-10 hidden md:inline">Admin</span>
            </Link>
          </motion.div>
        )}

        {/* Sign In Buttons */}
        <SignedOut>
          <SignInOAuthButtons />
        </SignedOut>

        {/* User Button with custom wrapper */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative"
        >
          {/* Glow ring */}
          <div
            className="absolute -inset-0.5 rounded-full blur-sm opacity-0 hover:opacity-100
                       transition-opacity duration-500"
            style={{
              background:
                "linear-gradient(135deg, rgba(139,92,246,0.4), rgba(6,182,212,0.4))",
            }}
          />
          <div className="relative">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9 ring-2 ring-white/10 hover:ring-violet-500/30 transition-all",
                },
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Topbar;