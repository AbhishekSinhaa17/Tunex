import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Clock,
  Pause,
  Play,
  Heart,
  Download,
  Share2,
  Shuffle,
  Music2,
  Disc3,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

// ═══════════════════════════════════════════════════════════════
// ─── ANIMATED BACKGROUND ──────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const AnimatedBackground = ({ imageUrl }: { imageUrl?: string }) => (
  <div className="absolute inset-0 overflow-hidden">
    {imageUrl && (
      <motion.div
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.12 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0"
      >
        <img
          src={imageUrl}
          alt=""
          className="w-full h-full object-cover blur-3xl"
        />
      </motion.div>
    )}

    <div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(180deg, rgba(12,10,26,0.7) 0%, rgba(8,8,14,0.95) 30%, rgba(8,8,14,1) 100%)",
      }}
    />

    <motion.div
      className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl"
      style={{
        background: "radial-gradient(circle, rgba(139,92,246,0.08), transparent 70%)",
      }}
      animate={{
        x: [0, 50, 0],
        y: [0, 30, 0],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);

// ═══════════════════════════════════════════════════════════════
// ─── ALBUM HEADER (COMPACT) ───────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const AlbumHeader = ({
  album,
  onPlay,
  isPlaying,
}: {
  album: any;
  onPlay: () => void;
  isPlaying: boolean;
}) => {
  const [isLiked, setIsLiked] = useState(false);

  const totalDuration = album?.songs?.reduce(
    (acc: number, song: any) => acc + song.duration,
    0
  );

  return (
    <div className="relative px-6 pt-6 pb-6">
      <div className="flex gap-6 items-end">
        {/* Album Artwork - SMALLER */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          className="relative group flex-shrink-0"
        >
          <motion.div
            className="absolute -inset-2 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background:
                "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(6,182,212,0.2))",
            }}
          />

          <div className="relative w-48 h-48 sm:w-56 sm:h-56">
            <motion.div
              className="w-full h-full rounded-2xl overflow-hidden shadow-2xl"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={album?.imageUrl}
                alt={album?.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/20 pointer-events-none" />
            </motion.div>

            {/* Vinyl disc on hover */}
            <motion.div
              className="absolute -right-6 top-1/2 -translate-y-1/2 w-44 h-44 opacity-0 group-hover:opacity-30"
              animate={{
                x: isPlaying ? 20 : -15,
                rotate: isPlaying ? 360 : 0,
              }}
              transition={{
                x: { duration: 0.5 },
                rotate: { duration: 3, repeat: isPlaying ? Infinity : 0, ease: "linear" },
              }}
            >
              <Disc3 className="w-full h-full text-zinc-700" strokeWidth={0.5} />
            </motion.div>
          </div>
        </motion.div>

        {/* Album Info - COMPACT */}
        <div className="flex-1 min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {/* Badge */}
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r from-violet-500/20 to-cyan-500/20 border border-violet-500/30 text-violet-300">
                <Music2 className="w-2.5 h-2.5" />
                Album
              </span>
              {album?.releaseYear && (
                <span className="text-xs text-zinc-600 font-medium">
                  {album.releaseYear}
                </span>
              )}
            </div>

            {/* Title - SMALLER */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-3 leading-none tracking-tighter">
              <span
                className="inline-block"
                style={{
                  background: "linear-gradient(135deg, #ffffff 0%, #e4e4e7 50%, #a1a1aa 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {album?.title}
              </span>
            </h1>

            {/* Artist & Stats */}
            <div className="flex flex-wrap items-center gap-2 text-sm mb-4">
              <span className="font-bold text-white cursor-pointer hover:underline">
                {album?.artist}
              </span>
              <span className="w-1 h-1 rounded-full bg-zinc-600" />
              <span className="text-zinc-500 font-medium">
                {album?.songs?.length} songs
              </span>
              {totalDuration && (
                <>
                  <span className="w-1 h-1 rounded-full bg-zinc-600" />
                  <span className="text-zinc-500 font-medium">
                    {Math.floor(totalDuration / 60)} min
                  </span>
                </>
              )}
            </div>

            {/* Action Buttons - COMPACT */}
            <div className="flex items-center gap-2">
              {/* Play Button */}
              <motion.button
                onClick={onPlay}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-12 h-12 rounded-full overflow-hidden shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-cyan-500" />
                <div className="absolute inset-[2px] rounded-full bg-emerald-500 group-hover:bg-emerald-400 transition-colors" />
                <div className="relative w-full h-full flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {isPlaying ? (
                      <motion.div
                        key="pause"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Pause className="w-5 h-5 text-black fill-black" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="play"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Play className="w-5 h-5 text-black fill-black ml-0.5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>

              {/* Secondary Actions */}
              <ActionButton icon={Shuffle} onClick={() => {}} />
              <ActionButton icon={Heart} isActive={isLiked} onClick={() => setIsLiked(!isLiked)} />
              <ActionButton icon={Download} onClick={() => {}} />
              <ActionButton icon={Share2} onClick={() => {}} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// ─── ACTION BUTTON (COMPACT) ──────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const ActionButton = ({
  icon: Icon,
  onClick,
  isActive,
}: {
  icon: React.ElementType;
  onClick: () => void;
  isActive?: boolean;
}) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
      isActive
        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
        : "bg-white/[0.05] text-zinc-500 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]"
    }`}
  >
    <Icon className="w-4 h-4" />
  </motion.button>
);

// ═══════════════════════════════════════════════════════════════
// ─── SONG ROW ─────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const SongRow = ({
  song,
  index,
  isCurrentSong,
  isPlaying,
  onClick,
}: {
  song: any;
  index: number;
  isCurrentSong: boolean;
  isPlaying: boolean;
  onClick: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: Math.min(index * 0.02, 0.3),
        duration: 0.3,
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`grid grid-cols-[40px_1fr_140px_70px] sm:grid-cols-[40px_2fr_180px_80px] gap-4 px-3 py-2.5 rounded-lg group cursor-pointer transition-all ${
        isCurrentSong ? "bg-emerald-500/10" : "hover:bg-white/[0.03]"
      }`}
    >
      {/* Index / Play */}
      <div className="flex items-center justify-center">
        <AnimatePresence mode="wait">
          {isCurrentSong && isPlaying ? (
            <motion.div
              key="eq"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-end gap-[2px] h-3.5"
            >
              {[1, 2, 3].map((bar) => (
                <motion.div
                  key={bar}
                  className="w-[2.5px] rounded-full bg-emerald-500"
                  animate={{ height: ["3px", "12px", "5px", "10px", "3px"] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: bar * 0.1 }}
                />
              ))}
            </motion.div>
          ) : isHovered ? (
            <motion.div key="play" initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <Play className="w-3.5 h-3.5 text-white fill-white" />
            </motion.div>
          ) : (
            <motion.span
              key="num"
              className={`text-sm ${isCurrentSong ? "text-emerald-400 font-bold" : "text-zinc-500"}`}
            >
              {index + 1}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Song Info */}
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={song.imageUrl}
          alt={song.title}
          className="w-10 h-10 rounded-md shadow-md flex-shrink-0"
        />
        <div className="min-w-0">
          <div
            className={`font-semibold text-sm truncate ${
              isCurrentSong ? "text-emerald-400" : "text-white group-hover:text-emerald-300"
            }`}
          >
            {song.title}
          </div>
          <div className="text-xs text-zinc-500 truncate">{song.artist}</div>
        </div>
      </div>

      {/* Date */}
      <div className="hidden sm:flex items-center text-xs text-zinc-500">
        {new Date(song.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </div>

      {/* Duration */}
      <div className="flex items-center justify-end text-sm text-zinc-500 font-mono">
        {formatDuration(song.duration)}
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════
// ─── ALBUM PAGE ───────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const AlbumPage = () => {
  const { albumId } = useParams();
  const { fetchAlbumById, currentAlbum, isAlbumLoading } = useMusicStore();
  const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();

  useEffect(() => {
    if (albumId) fetchAlbumById(albumId);
  }, [fetchAlbumById, albumId]);

  if (isAlbumLoading && (!currentAlbum || currentAlbum._id !== albumId)) {
    return (
      <div className="h-full flex items-center justify-center bg-[#0a0a12]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Disc3 className="w-12 h-12 text-emerald-500" strokeWidth={1.5} />
        </motion.div>
      </div>
    );
  }

  const handlePlayAlbum = () => {
    if (!currentAlbum) return;
    const isCurrentAlbumPlaying = currentAlbum?.songs.some(
      (song) => song._id === currentSong?._id
    );
    if (isCurrentAlbumPlaying) togglePlay();
    else playAlbum(currentAlbum?.songs, 0);
  };

  const handlePlaySong = (index: number) => {
    if (!currentAlbum) return;
    playAlbum(currentAlbum?.songs, index);
  };

  const isAlbumPlaying =
    currentAlbum?.songs.some((song) => song._id === currentSong?._id) && isPlaying;

  return (
    <div className="h-full rounded-xl overflow-hidden relative">
      <AnimatedBackground imageUrl={currentAlbum?.imageUrl} />

      <div
        className="absolute inset-0 rounded-xl pointer-events-none z-[1]"
        style={{ border: "1px solid rgba(255,255,255,0.04)" }}
      />

      <div className="relative z-10 flex flex-col h-full">
        <AlbumHeader album={currentAlbum} onPlay={handlePlayAlbum} isPlaying={isAlbumPlaying ? isAlbumPlaying : false} />

        <div className="flex-1 min-h-0 relative">
          <div
            className="absolute top-0 left-0 right-0 h-6 pointer-events-none z-10"
            style={{
              background: "linear-gradient(to bottom, rgba(8,8,14,0.9), transparent)",
            }}
          />

          {/* Table Header */}
          <div className="sticky top-0 z-20 px-3 py-2 backdrop-blur-xl bg-black/40 border-b border-white/[0.06]">
            <div className="grid grid-cols-[40px_1fr_140px_70px] sm:grid-cols-[40px_2fr_180px_80px] gap-4 px-3 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
              <div className="flex items-center justify-center">#</div>
              <div>Title</div>
              <div className="hidden sm:block">Date Added</div>
              <div className="flex items-center justify-end">
                <Clock className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* Songs List */}
          <ScrollArea className="h-[calc(100vh-380px)]">
            <div className="px-3 pt-2 pb-32 space-y-1">
              {currentAlbum?.songs.map((song: any, index: number) => (
                <SongRow
                  key={song._id}
                  song={song}
                  index={index}
                  isCurrentSong={currentSong?._id === song._id}
                  isPlaying={isPlaying}
                  onClick={() => handlePlaySong(index)}
                />
              ))}
            </div>
          </ScrollArea>

          <div
            className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10"
            style={{
              background: "linear-gradient(to top, rgba(8,8,14,1), transparent)",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AlbumPage;