import { Song } from "@/types";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Play, Pause, Music2 } from "lucide-react";
import React, { useRef, useState } from "react";

interface SectionGridProps {
  title: string;
  songs: Song[];
  isLoading: boolean;
}

// ─── SKELETON ────────────────────────────────────────────────
const SkeletonCard = ({ index }: { index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08, duration: 0.5 }}
    className="rounded-2xl p-3 space-y-3
               bg-white/[0.02] border border-white/[0.05]"
  >
    <div className="aspect-square rounded-xl bg-white/[0.04] animate-pulse overflow-hidden relative">
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 50%, transparent 60%)",
        }}
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
      />
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-white/[0.04] rounded-full w-3/4 animate-pulse" />
      <div className="h-2.5 bg-white/[0.03] rounded-full w-1/2 animate-pulse" />
    </div>
  </motion.div>
);

// ─── 3D TILT CARD ────────────────────────────────────────────
const TiltCard = ({ song, index }: { song: Song; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { currentSong, isPlaying, setCurrentSong, togglePlay } = usePlayerStore();

  const isCurrentSong = currentSong?._id === song._id;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    damping: 20,
    stiffness: 150,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    damping: 20,
    stiffness: 150,
  });

  // Holographic shine position
  const shineX = useTransform(mouseX, [-0.5, 0.5], [0, 100]);
  const shineY = useTransform(mouseY, [-0.5, 0.5], [0, 100]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const handlePlay = () => {
    if (isCurrentSong) togglePlay();
    else setCurrentSong(song);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.06,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 800,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handlePlay}
      className="group cursor-pointer"
    >
      <div
        className={`
          relative rounded-2xl p-3 transition-all duration-700
          border backdrop-blur-sm overflow-hidden
          ${
            isCurrentSong
              ? "bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border-violet-500/20"
              : "bg-white/[0.02] border-white/[0.05] hover:border-white/[0.12]"
          }
        `}
      >
        {/* Holographic shine overlay */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 z-10 pointer-events-none rounded-2xl"
            style={{
              background: `radial-gradient(
                circle at ${shineX.get()}% ${shineY.get()}%,
                rgba(255,255,255,0.06) 0%,
                rgba(139,92,246,0.03) 30%,
                transparent 60%
              )`,
            }}
          />
        )}

        {/* Iridescent border glow */}
        {isCurrentSong && (
          <motion.div
            className="absolute -inset-px rounded-2xl pointer-events-none z-0"
            animate={{
              background: [
                "linear-gradient(0deg, rgba(139,92,246,0.3), rgba(6,182,212,0.3), rgba(236,72,153,0.3))",
                "linear-gradient(120deg, rgba(236,72,153,0.3), rgba(139,92,246,0.3), rgba(6,182,212,0.3))",
                "linear-gradient(240deg, rgba(6,182,212,0.3), rgba(236,72,153,0.3), rgba(139,92,246,0.3))",
                "linear-gradient(360deg, rgba(139,92,246,0.3), rgba(6,182,212,0.3), rgba(236,72,153,0.3))",
              ],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
        )}

        {/* Image */}
        <div className="relative aspect-square rounded-xl overflow-hidden mb-3 z-10">
          {song.imageUrl ? (
            <motion.img
              src={song.imageUrl}
              alt={song.title}
              className="w-full h-full object-cover"
              animate={{
                scale: isHovered ? 1.08 : 1,
                filter: isHovered ? "brightness(1.1)" : "brightness(1)",
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center
                         bg-gradient-to-br from-violet-900/40 to-cyan-900/40"
            >
              <Music2 className="w-10 h-10 text-zinc-600" />
            </div>
          )}

          {/* Dark gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
            animate={{ opacity: isHovered || isCurrentSong ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Play button with ripple */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-20"
            initial={false}
            animate={{
              opacity: isHovered || isCurrentSong ? 1 : 0,
              scale: isHovered || isCurrentSong ? 1 : 0.3,
            }}
            transition={{ duration: 0.35, type: "spring", stiffness: 400, damping: 25 }}
          >
            {/* Ripple rings */}
            {isCurrentSong && isPlaying && (
              <>
                {[0, 1, 2].map((ring) => (
                  <motion.div
                    key={ring}
                    className="absolute w-14 h-14 rounded-full border border-white/20"
                    animate={{
                      scale: [1, 2.5],
                      opacity: [0.4, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: ring * 0.6,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </>
            )}
            <motion.div
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className={`
                relative w-12 h-12 rounded-full flex items-center justify-center
                shadow-2xl backdrop-blur-md z-30
                ${
                  isCurrentSong && isPlaying
                    ? "bg-gradient-to-br from-violet-500 to-cyan-500 shadow-violet-500/30"
                    : "bg-white/90 shadow-white/20"
                }
              `}
            >
              {isCurrentSong && isPlaying ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-black ml-0.5" />
              )}
            </motion.div>
          </motion.div>

          {/* Vinyl spinning indicator */}
          {isCurrentSong && isPlaying && (
            <motion.div
              className="absolute bottom-2 left-2 w-6 h-6 rounded-full
                         border-2 border-white/40 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
            </motion.div>
          )}

          {/* Duration badge */}
          {isHovered && (
            <motion.span
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute top-2 right-2 px-2 py-0.5 rounded-md
                         bg-black/60 backdrop-blur-md text-[10px] text-white/80
                         font-mono border border-white/10"
            >
              {song.duration
                ? `${Math.floor(song.duration / 60)}:${String(song.duration % 60).padStart(2, "0")}`
                : "3:45"}
            </motion.span>
          )}
        </div>

        {/* Text */}
        <div className="space-y-0.5 px-1 relative z-10">
          <h3
            className={`
              font-bold text-sm truncate transition-colors duration-500
              ${isCurrentSong ? "text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-cyan-300" : "text-white/90 group-hover:text-white"}
            `}
          >
            {song.title}
          </h3>
          <p className="text-[11px] text-zinc-500 truncate group-hover:text-zinc-400 transition-colors duration-300 font-medium">
            {song.artist}
          </p>
        </div>

        {/* Bottom progress bar for current song */}
        {isCurrentSong && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[2px] z-20"
            style={{
              background:
                "linear-gradient(90deg, rgba(139,92,246,0.8), rgba(6,182,212,0.8), rgba(236,72,153,0.8))",
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        )}
      </div>
    </motion.div>
  );
};

// ─── SECTION GRID ────────────────────────────────────────────
const SectionGrid = ({ title, songs, isLoading }: SectionGridProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const displaySongs = isExpanded ? songs : songs.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className="relative w-1 h-7 rounded-full overflow-hidden"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                background: [
                  "linear-gradient(180deg, #8b5cf6, #06b6d4)",
                  "linear-gradient(180deg, #06b6d4, #ec4899)",
                  "linear-gradient(180deg, #ec4899, #8b5cf6)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {title}
          </h2>
        </div>

        {songs.length > 4 && (
          <motion.button
            whileHover={{ scale: 1.05, x: 3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[11px] font-semibold uppercase tracking-widest
                       text-zinc-500 hover:text-white
                       transition-colors duration-500 flex items-center gap-1.5"
          >
            {isExpanded ? "Show less" : "View all"}
            <motion.span
              animate={isExpanded ? { x: [0, -3, 0] } : { x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="inline-block"
            >
              {isExpanded ? "←" : "→"}
            </motion.span>
          </motion.button>
        )}
      </div>

      {/* Grid */}
      <div
        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} index={i} />
            ))
          : displaySongs.map((song, index) => (
              <TiltCard key={song._id} song={song} index={index} />
            ))}
      </div>
    </div>
  );
};

export default SectionGrid;