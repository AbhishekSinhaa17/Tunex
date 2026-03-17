import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SignedIn } from "@clerk/clerk-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  HomeIcon,
  Library,
  MessageCircle,
  Disc3,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayerStore } from "@/stores/usePlayerStore";

// ═══════════════════════════════════════════════════════════════
// ─── NAV LINK ─────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const NavLink = ({
  to,
  icon: Icon,
  label,
  isActive,
  index,
}: {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.15 + index * 0.08, duration: 0.4 }}
  >
    <Link to={to} className="block relative group">
      <AnimatePresence>
        {isActive && (
          <motion.div
            layoutId="nav-active-bar"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-full
                       bg-gradient-to-b from-violet-400 to-cyan-400"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            exit={{ scaleY: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background:
                "linear-gradient(90deg, rgba(139,92,246,0.08), transparent)",
            }}
          />
        )}
      </AnimatePresence>

      <div
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 relative",
          isActive
            ? "text-white"
            : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
        )}
      >
        <motion.div
          whileHover={{ scale: 1.15, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          className={cn(
            "relative w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300",
            isActive
              ? "bg-gradient-to-br from-violet-500/20 to-cyan-500/20 shadow-inner"
              : "bg-white/[0.03] group-hover:bg-white/[0.06]"
          )}
        >
          <Icon
            className={cn(
              "w-[18px] h-[18px] transition-all duration-300",
              isActive
                ? "text-violet-300"
                : "text-zinc-400 group-hover:text-zinc-200"
            )}
          />

          {isActive && (
            <motion.div
              className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full
                         bg-cyan-400 shadow-lg shadow-cyan-400/50"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.div>

        <span className="hidden md:block text-sm font-semibold tracking-tight">
          {label}
        </span>
      </div>
    </Link>
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════
// ─── ALBUM CARD ───────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const AlbumCard = ({
  album,
  index,
}: {
  album: any;
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { currentSong, isPlaying } = usePlayerStore();
  const location = useLocation();

  const isSelected = location.pathname === `/albums/${album._id}`;
  const isAlbumPlaying = currentSong?.albumId === album._id;

  const isActive = isSelected || isAlbumPlaying;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: index * 0.05,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link
        to={`/albums/${album._id}`}
        className="block group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence>
          {isActive && (
            <motion.div
              layoutId="sidebar-album-active"
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/10 to-transparent border border-violet-500/15"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </AnimatePresence>

        <motion.div
          whileHover={{ x: 4 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={cn(
            "relative flex items-center gap-3 p-2.5 rounded-xl transition-all duration-500",
            "border border-transparent"
          )}
        >
          <div className="relative flex-shrink-0">
            <motion.div
              className="w-12 h-12 rounded-lg overflow-hidden shadow-lg"
              animate={{
                boxShadow: isHovered
                  ? "0 8px 25px rgba(0,0,0,0.4), 0 0 15px rgba(139,92,246,0.1)"
                  : "0 4px 12px rgba(0,0,0,0.2)",
              }}
              transition={{ duration: 0.4 }}
            >
              <motion.img
                src={album.imageUrl}
                alt={album.title}
                className="w-full h-full object-cover"
                animate={{ scale: isHovered ? 1.1 : 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />

              <motion.div
                className="absolute inset-0 bg-black/40 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isAlbumPlaying && isPlaying ? (
                  <div className="flex items-end gap-[2px] h-4">
                    {[1, 2, 3].map((bar) => (
                      <motion.div
                        key={bar}
                        className="w-[2px] rounded-full bg-white"
                        animate={{
                          height: ["2px", "12px", "5px", "10px", "2px"],
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: bar * 0.1,
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: isHovered ? 1 : 0 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <div
                      className="w-7 h-7 rounded-full bg-white/90 flex items-center 
                                 justify-center shadow-xl"
                    >
                      <div
                        className="w-0 h-0 ml-0.5
                                   border-t-[5px] border-t-transparent
                                   border-l-[8px] border-l-black
                                   border-b-[5px] border-b-transparent"
                      />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>

            {isAlbumPlaying && (
              <motion.div
                className="absolute -inset-1 rounded-xl border border-violet-500/30 pointer-events-none"
                animate={{
                  borderColor: [
                    "rgba(139,92,246,0.3)",
                    "rgba(6,182,212,0.3)",
                    "rgba(139,92,246,0.3)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            )}
          </div>

          <div className="flex-1 min-w-0 hidden md:block">
            <motion.p
              className={cn(
                "text-sm font-semibold truncate transition-colors duration-300",
                isActive
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-cyan-300"
                  : "text-zinc-200 group-hover:text-white"
              )}
            >
              {album.title}
            </motion.p>
            <p className="text-[11px] text-zinc-500 truncate font-medium group-hover:text-zinc-400 transition-colors duration-300">
              Album • {album.artist}
            </p>
          </div>

          <motion.div
            className="hidden md:flex flex-shrink-0"
            initial={{ opacity: 0, x: -5 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              x: isHovered ? 0 : -5,
            }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-5 h-5 rounded-full bg-white/[0.06] flex items-center justify-center">
              <svg
                className="w-3 h-3 text-zinc-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </motion.div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════
// ─── SECTION DIVIDER ──────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const SidebarDivider = () => (
  <motion.div
    initial={{ scaleX: 0, opacity: 0 }}
    animate={{ scaleX: 1, opacity: 1 }}
    transition={{ delay: 0.3, duration: 0.8 }}
    className="mx-4 my-1 h-px origin-left"
    style={{
      background:
        "linear-gradient(90deg, transparent, rgba(139,92,246,0.15), rgba(6,182,212,0.15), transparent)",
    }}
  />
);

// ═══════════════════════════════════════════════════════════════
// ─── LEFT SIDEBAR ─────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const LeftSidebar = () => {
  const { albums, fetchAlbums, isAlbumsLoading } = useMusicStore();
  const location = useLocation();

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  const navItems = [{ to: "/", icon: HomeIcon, label: "Home" }];

  return (
    <div
      className="h-full flex flex-col rounded-xl overflow-hidden relative z-20"
      style={{
        background:
          "linear-gradient(180deg, rgba(12,10,26,0.95) 0%, rgba(8,8,14,0.98) 100%)",
      }}
    >
      {/* Subtle border glow */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none z-0"
        style={{
          border: "1px solid rgba(255,255,255,0.04)",
        }}
      />

      {/* Ambient glow at top */}
      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139,92,246,0.06) 0%, transparent 100%)",
        }}
      />

      {/* ─── Navigation ─── */}
      <div className="px-3 pt-4 pb-3 relative z-10">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="hidden md:block text-[10px] font-bold uppercase tracking-[0.15em] 
                     text-zinc-600 px-3 mb-2"
        >
          Menu
        </motion.p>

        <div className="space-y-0.5">
          {navItems.map((item, i) => (
            <NavLink
              key={item.to}
              {...item}
              isActive={location.pathname === item.to}
              index={i}
            />
          ))}

          <SignedIn>
            <NavLink
              to="/chat"
              icon={MessageCircle}
              label="Messages"
              isActive={location.pathname === "/chat"}
              index={navItems.length}
            />
          </SignedIn>
        </div>
      </div>

      <SidebarDivider />

      {/* ─── Library Section ─── */}
      <div className="flex-1 px-3 py-3 overflow-hidden relative z-10 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-3 px-2 flex-shrink-0">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
            className="flex items-center gap-2"
          >
            <motion.div
              className="relative w-7 h-7 rounded-lg flex items-center justify-center
                         bg-gradient-to-br from-violet-500/15 to-cyan-500/15"
              whileHover={{ scale: 1.1, rotate: -5 }}
            >
              <Library className="w-3.5 h-3.5 text-violet-400" />
            </motion.div>
            <span className="hidden md:block text-xs font-bold uppercase tracking-[0.12em] text-zinc-400">
              Playlists
            </span>
          </motion.div>

          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
            className="hidden md:flex px-2 py-0.5 rounded-md text-[10px] font-bold
                       text-zinc-500 bg-white/[0.04] border border-white/[0.06]
                       tabular-nums"
          >
            {albums.length}
          </motion.span>
        </div>

        {/* ScrollArea takes remaining space with bottom padding for footer */}
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <div className="space-y-0.5 pr-2 pb-24">
              {isAlbumsLoading && albums.length === 0 ? (
                <PlaylistSkeleton />
              ) : (
                <AnimatePresence>
                  {albums.map((album, index) => (
                    <AlbumCard key={album._id} album={album} index={index} />
                  ))}
                </AnimatePresence>
              )}

              {!isAlbumsLoading && albums.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8 px-4"
                >
                  <Disc3 className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                  <p className="text-xs text-zinc-600 font-medium">
                    No playlists yet
                  </p>
                </motion.div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;