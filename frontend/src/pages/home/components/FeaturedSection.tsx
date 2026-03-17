import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Disc3,
  Sparkles,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const FeaturedSection = () => {
  const { featuredSongs, isFeaturedLoading, error } = useMusicStore();
  const { currentSong, isPlaying, setCurrentSong, togglePlay } = usePlayerStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 1.1,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-30%" : "30%",
      opacity: 0,
      scale: 0.95,
    }),
  };

  const next = useCallback(() => {
    if (featuredSongs.length === 0) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % featuredSongs.length);
  }, [featuredSongs.length]);

  const prev = useCallback(() => {
    if (featuredSongs.length === 0) return;
    setDirection(-1);
    setCurrentIndex(
      (prev) => (prev - 1 + featuredSongs.length) % featuredSongs.length
    );
  }, [featuredSongs.length]);

  useEffect(() => {
    if (featuredSongs.length === 0) return;
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [next, featuredSongs.length]);

  // Safety: Reset index if it exceeds new data length
  useEffect(() => {
    if (currentIndex >= featuredSongs.length && featuredSongs.length > 0) {
      setCurrentIndex(0);
    }
  }, [featuredSongs.length, currentIndex]);

  if (isFeaturedLoading && featuredSongs.length === 0) {
    return (
      <div className="mb-10">
        <div
          className="h-[350px] sm:h-[420px] rounded-3xl animate-pulse
                     bg-white/[0.02] border border-white/[0.05]"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-10 p-8 rounded-3xl bg-red-500/10 border border-red-500/20 text-center">
        <p className="text-red-400 font-medium">{error}</p>
      </div>
    );
  }

  if (featuredSongs.length === 0) return null;

  const song = featuredSongs[currentIndex];
  if (!song) return null; // Safety check

  const isCurrentSong = currentSong?._id === song?._id;

  const handlePlay = () => {
    if (isCurrentSong) togglePlay();
    else setCurrentSong(song);
  };

  return (
    <div className="mb-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <motion.div
          className="relative w-1 h-7 rounded-full overflow-hidden"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                "linear-gradient(180deg, #f59e0b, #ef4444)",
                "linear-gradient(180deg, #ef4444, #ec4899)",
                "linear-gradient(180deg, #ec4899, #f59e0b)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.div>
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          Featured
        </h2>
      </div>

      {/* Hero Card */}
      <div
        className="relative h-[350px] sm:h-[420px] rounded-3xl overflow-hidden
                   border border-white/[0.06] group"
      >
        {/* Background with parallax-like effect */}
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <img
              src={song?.imageUrl}
              alt={song?.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-[#050510]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050510]/80 via-transparent to-transparent" />

        {/* Lens flare */}
        <motion.div
          className="absolute top-10 right-20 w-32 h-32 rounded-full blur-3xl"
          style={{ background: "rgba(255,255,255,0.03)" }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* Content */}
        <div className="absolute inset-0 flex items-end p-6 sm:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(5px)" }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="max-w-lg"
            >
              <div className="flex items-center gap-2 mb-3">
                <Disc3
                  className={`w-4 h-4 text-amber-400 ${
                    isCurrentSong && isPlaying ? "animate-spin" : ""
                  }`}
                  style={{ animationDuration: "3s" }}
                />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400/80">
                  Featured Track #{currentIndex + 1}
                </span>
              </div>

              <h3 className="text-3xl sm:text-5xl font-black text-white mb-1 leading-[1.05] tracking-tight">
                {song?.title}
              </h3>
              <p className="text-zinc-400 text-sm sm:text-lg mb-5 font-medium">
                {song?.artist}
              </p>

              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={handlePlay}
                  className={`
                    relative flex items-center gap-2.5 px-7 py-3.5 rounded-full
                    font-bold text-sm tracking-wide transition-all duration-500
                    overflow-hidden
                    ${
                      isCurrentSong && isPlaying
                        ? "text-white shadow-2xl shadow-violet-500/30"
                        : "bg-white text-black shadow-2xl shadow-white/10 hover:shadow-white/20"
                    }
                  `}
                >
                  {/* Animated gradient bg for playing state */}
                  {isCurrentSong && isPlaying && (
                    <motion.div
                      className="absolute inset-0"
                      animate={{
                        background: [
                          "linear-gradient(135deg, #8b5cf6, #06b6d4)",
                          "linear-gradient(135deg, #06b6d4, #ec4899)",
                          "linear-gradient(135deg, #ec4899, #8b5cf6)",
                        ],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {isCurrentSong && isPlaying ? (
                      <>
                        <Pause className="w-4 h-4" /> Now Playing
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" /> Play Now
                      </>
                    )}
                  </span>
                </motion.button>

                {/* Track counter */}
                <span className="text-xs text-zinc-600 font-mono">
                  {String(currentIndex + 1).padStart(2, "0")}/
                  {String(featuredSongs.length).padStart(2, "0")}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Nav arrows */}
        <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between pointer-events-none">
          {[
            { action: prev, icon: ChevronLeft, side: "left" },
            { action: next, icon: ChevronRight, side: "right" },
          ].map(({ action, icon: Icon, side }) => (
            <motion.button
              key={side}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.85 }}
              onClick={action}
              className="pointer-events-auto w-10 h-10 rounded-full
                         bg-white/[0.05] backdrop-blur-xl border border-white/[0.08]
                         flex items-center justify-center text-white/70
                         opacity-0 group-hover:opacity-100 transition-all duration-500
                         hover:bg-white/10 hover:text-white hover:border-white/20"
            >
              <Icon className="w-5 h-5" />
            </motion.button>
          ))}
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/[0.05]">
          <motion.div
            key={currentIndex}
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #8b5cf6, #06b6d4, #ec4899)",
            }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 7, ease: "linear" }}
          />
        </div>

        {/* Dot indicators */}
        <div className="absolute bottom-5 right-6 flex items-center gap-2">
          {featuredSongs.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => {
                setDirection(i > currentIndex ? 1 : -1);
                setCurrentIndex(i);
              }}
              className="relative"
              whileHover={{ scale: 1.3 }}
            >
              <div
                className={`
                  h-2 rounded-full transition-all duration-700
                  ${
                    i === currentIndex
                      ? "w-8 bg-gradient-to-r from-violet-400 to-cyan-400"
                      : "w-2 bg-white/20 hover:bg-white/40"
                  }
                `}
              />
              {i === currentIndex && (
                <motion.div
                  layoutId="featured-dot"
                  className="absolute inset-0 rounded-full blur-sm bg-violet-400/50"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedSection;