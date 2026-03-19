import Topbar from "@/components/Topbar";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect, useState } from "react";
import FeaturedSection from "./components/FeaturedSection";
import SectionGrid from "./components/SectionGrid";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { usePlayerStore } from "@/stores/usePlayerStore";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";

// ═══════════════════════════════════════════════════════════════
// ─── CURSOR SPOTLIGHT ─────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const CursorSpotlight = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 25, stiffness: 150 });
  const springY = useSpring(mouseY, { damping: 25, stiffness: 150 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
      aria-hidden
    >
      <motion.div
        className="absolute w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          left: springX,
          top: springY,
          background:
            "radial-gradient(circle, rgba(168,85,247,0.06) 0%, rgba(59,130,246,0.03) 30%, transparent 70%)",
        }}
      />
      <motion.div
        className="absolute w-[300px] h-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          left: springX,
          top: springY,
          background:
            "radial-gradient(circle, rgba(236,72,153,0.04) 0%, transparent 60%)",
        }}
      />
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════
// ─── FLOATING PARTICLES ───────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const FloatingParticles = () => {
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.2 + 0.1,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -80, -160, -80, 0],
            x: [0, 30, -20, 40, 0],
            opacity: [p.opacity, p.opacity * 2, p.opacity, p.opacity * 1.5, p.opacity],
            scale: [1, 1.5, 1, 1.8, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// ─── FLOATING MUSIC NOTES ─────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const FloatingNotes = () => {
  const notes = ["♪", "♫", "♬", "♩", "♭", "♮"];
  const items = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    note: notes[i % notes.length],
    x: Math.random() * 100,
    duration: Math.random() * 12 + 8,
    delay: Math.random() * 6,
    size: Math.random() * 12 + 10,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {items.map((item) => (
        <motion.span
          key={item.id}
          className="absolute text-white/[0.04] select-none"
          style={{
            left: `${item.x}%`,
            fontSize: item.size,
            bottom: -30,
          }}
          animate={{
            y: [0, -window.innerHeight - 100],
            x: [0, Math.sin(item.id) * 100],
            rotate: [0, 360],
            opacity: [0, 0.06, 0.04, 0],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            delay: item.delay,
            ease: "linear",
          }}
        >
          {item.note}
        </motion.span>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// ─── AUDIO WAVE DECORATION ────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const AudioWaveDecoration = () => {
  const bars = 40;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 1 }}
      className="flex items-end gap-[2px] h-8 opacity-20"
    >
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="w-[2px] rounded-full bg-gradient-to-t from-violet-500 to-cyan-400"
          animate={{
            height: [
              `${Math.random() * 60 + 10}%`,
              `${Math.random() * 100 + 10}%`,
              `${Math.random() * 40 + 10}%`,
              `${Math.random() * 80 + 10}%`,
              `${Math.random() * 60 + 10}%`,
            ],
          }}
          transition={{
            duration: 1.5 + Math.random(),
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.03,
          }}
        />
      ))}
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════
// ─── TYPEWRITER TEXT ──────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const TypewriterText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        if (index <= text.length) {
          setDisplayText(text.slice(0, index));
          index++;
        } else {
          clearInterval(interval);
          setTimeout(() => setShowCursor(false), 2000);
        }
      }, 80);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [text, delay]);

  return (
    <span className="inline-flex items-center">
      <span
        className="bg-gradient-to-r from-white via-violet-200 to-cyan-200 
                   bg-clip-text text-transparent"
      >
        {displayText}
      </span>
      {showCursor && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity }}
          className="inline-block w-[3px] h-[1em] bg-violet-400 ml-1 rounded-full"
        />
      )}
    </span>
  );
};

// ═══════════════════════════════════════════════════════════════
// ─── MESH GRADIENT BACKGROUND ─────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const MeshBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden">
    {/* Base */}
    <div className="absolute inset-0 bg-[#050510]" />

    {/* Mesh blobs */}
    <motion.div
      className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[120px]"
      style={{ background: "rgba(88,28,135,0.15)" }}
      animate={{
        x: [0, 100, -50, 0],
        y: [0, 60, -30, 0],
        scale: [1, 1.3, 0.8, 1],
      }}
      transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px]"
      style={{ background: "rgba(6,78,130,0.12)" }}
      animate={{
        x: [0, -80, 60, 0],
        y: [0, -50, 70, 0],
        scale: [1, 0.9, 1.2, 1],
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute top-[40%] left-[30%] w-[40%] h-[40%] rounded-full blur-[100px]"
      style={{ background: "rgba(14,116,144,0.08)" }}
      animate={{
        x: [0, 60, -80, 0],
        y: [0, -40, 50, 0],
        scale: [1, 1.1, 0.85, 1],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
    />

    {/* Grid pattern overlay */}
    <div
      className="absolute inset-0 opacity-[0.02]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }}
    />

    {/* Scan line effect */}
    <motion.div
      className="absolute inset-0 opacity-[0.015]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
      }}
      animate={{ y: [0, 4, 0] }}
      transition={{ duration: 0.3, repeat: Infinity }}
    />
  </div>
);

// ═══════════════════════════════════════════════════════════════
// ─── NEON LINE ACCENT ─────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const NeonLine = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    initial={{ scaleX: 0, opacity: 0 }}
    animate={{ scaleX: 1, opacity: 1 }}
    transition={{ delay, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    className="relative h-px w-full origin-left my-8 overflow-visible"
  >
    <div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.5) 20%, rgba(6,182,212,0.5) 50%, rgba(236,72,153,0.5) 80%, transparent 100%)",
      }}
    />
    <div
      className="absolute inset-0 blur-sm"
      style={{
        background:
          "linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.3) 20%, rgba(6,182,212,0.3) 50%, rgba(236,72,153,0.3) 80%, transparent 100%)",
      }}
    />
    {/* Traveling light */}
    <motion.div
      className="absolute top-1/2 -translate-y-1/2 w-20 h-[3px] rounded-full blur-sm"
      style={{
        background:
          "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)",
      }}
      animate={{ left: ["-10%", "110%"] }}
      transition={{
        duration: 3,
        repeat: Infinity,
        delay: delay + 1,
        ease: "easeInOut",
        repeatDelay: 4,
      }}
    />
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════
// ─── STATS BAR ────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const StatsBar = () => {
  const { featuredSongs = [], madeForYouSongs = [], trendingSongs = [] } = useMusicStore();
  const totalSongs = (featuredSongs?.length || 0) + (madeForYouSongs?.length || 0) + (trendingSongs?.length || 0);

  const stats = [
    { label: "Tracks", value: totalSongs, icon: "🎵" },
    { label: "Featured", value: featuredSongs.length, icon: "⭐" },
    { label: "Trending", value: trendingSongs.length, icon: "🔥" },
    { label: "For You", value: madeForYouSongs.length, icon: "💜" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6"
    >
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 + i * 0.1, type: "spring", stiffness: 200 }}
          whileHover={{
            scale: 1.05,
            borderColor: "rgba(139,92,246,0.3)",
          }}
          className="relative group px-4 py-3 rounded-xl border border-white/[0.06]
                     bg-white/[0.02] backdrop-blur-sm cursor-default
                     transition-colors duration-500"
        >
          {/* Hover glow */}
          <div
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100
                        transition-opacity duration-500 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at center, rgba(139,92,246,0.06), transparent 70%)",
            }}
          />
          <div className="flex items-center gap-2 relative z-10">
            <span className="text-lg">{stat.icon}</span>
            <div>
              <motion.p
                className="text-lg font-bold text-white tabular-nums"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 + i * 0.1 }}
              >
                {stat.value}
              </motion.p>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">
                {stat.label}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};


// ═══════════════════════════════════════════════════════════════
// ─── SECTION REVEAL WRAPPER ───────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const RevealSection = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 60, rotateX: 8 }}
    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{
      delay,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    }}
    className={className}
    style={{ perspective: 1000 }}
  >
    {children}
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════
// ─── HOME PAGE ────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const HomePage = () => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const {
    fetchHomeData,
    isMadeForYouLoading,
    isTrendingLoading,
    madeForYouSongs,
    featuredSongs,
    trendingSongs,
    searchResults,
  } = useMusicStore();

  const { recentSongs, initializeQueue } = usePlayerStore();

  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  useEffect(() => {
    if (
      madeForYouSongs?.length > 0 &&
      featuredSongs?.length > 0 &&
      trendingSongs?.length > 0
    ) {
      const allSongs = [...featuredSongs, ...madeForYouSongs, ...trendingSongs];
      initializeQueue(allSongs);
    }
  }, [initializeQueue, madeForYouSongs, trendingSongs, featuredSongs]);

  return (
    <main className="h-full flex flex-col rounded-md overflow-hidden relative">
      {/* ── Background layers ── */}
      <MeshBackground />
      <FloatingParticles />
      <FloatingNotes />
      <CursorSpotlight />

      {/* ── Topbar ── */}
      <div className="relative z-20">
        <Topbar />
      </div>

      <ScrollArea.Root className="h-[calc(100vh-180px)] w-full overflow-hidden relative z-10">
        <ScrollArea.Viewport className="h-full w-full min-h-full">
          <div className="p-4 sm:p-6 lg:p-10 max-w-[1600px] mx-auto">
            {/* ═══ HERO SECTION ═══ */}
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative mb-4"
            >
              {/* Time badge */}
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5
                           border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl"
              >
                <div className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[11px] font-medium text-zinc-400 tracking-wide">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  •{" "}
                  {new Date().toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </motion.div>

              {/* Greeting */}
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tighter leading-[0.9]">
                <TypewriterText text={getGreeting()} delay={0.3} />
              </h1>

              {/* Subtitle with wave */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                className="flex items-center gap-4 mt-4"
              >
                <p className="text-zinc-500 text-sm sm:text-base max-w-sm leading-relaxed">
                  Your personal soundtrack awaits. Explore curated collections
                  and trending tracks.
                </p>
                <AudioWaveDecoration />
              </motion.div>


              <StatsBar />
            </motion.section>

            <NeonLine delay={1.2} />

            {/* ═══ SEARCH RESULTS ═══ */}
            <AnimatePresence mode="wait">
              {searchResults.length > 0 && (
                <RevealSection className="mb-10">
                  <SectionGrid
                    title="Search Results"
                    songs={searchResults}
                    isLoading={false}
                  />
                </RevealSection>
              )}
            </AnimatePresence>

            {/* ═══ RECENTLY PLAYED ═══ */}
            <AnimatePresence mode="wait">
              {recentSongs.length > 0 && (
                <RevealSection delay={0.1} className="mb-10">
                  <SectionGrid
                    title="Recently Played"
                    songs={recentSongs}
                    isLoading={false}
                  />
                </RevealSection>
              )}
            </AnimatePresence>

            {/* ═══ FEATURED ═══ */}
            <AnimatePresence mode="wait">
              <RevealSection delay={0.15} className="mb-10">
                <FeaturedSection />
              </RevealSection>
            </AnimatePresence>

            {/* ═══ MAIN SECTIONS ═══ */}
            <div className="space-y-10 pb-12">
              <RevealSection delay={0}>
                <SectionGrid
                  title="Made For You"
                  songs={madeForYouSongs}
                  isLoading={isMadeForYouLoading && (madeForYouSongs?.length || 0) === 0}
                />
              </RevealSection>

              <NeonLine />

              <RevealSection delay={0}>
                <SectionGrid
                  title="Trending"
                  songs={trendingSongs}
                  isLoading={isTrendingLoading && (trendingSongs?.length || 0) === 0}
                />
              </RevealSection>
            </div>
          </div>
        </ScrollArea.Viewport>

        {/* ── Scrollbar ── */}
        <ScrollArea.Scrollbar
          orientation="vertical"
          className="flex w-1.5 touch-none select-none p-[1px]
                     transition-all duration-500 hover:w-2.5
                     bg-transparent rounded-full mr-1"
        >
          <ScrollArea.Thumb
            className="relative flex-1 rounded-full transition-colors duration-300
                       bg-gradient-to-b from-violet-500/30 via-cyan-500/20 to-pink-500/30
                       hover:from-violet-500/50 hover:via-cyan-500/40 hover:to-pink-500/50"
          />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </main>
  );
};

export default HomePage;