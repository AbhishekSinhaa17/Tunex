import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Slider } from "@/components/ui/slider";
import {
  Laptop2,
  ListMusic,
  Mic2,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
  VolumeX,
  Heart,
  Maximize2,
  Music2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

// ═══════════════════════════════════════════════════════════════
// ─── ANIMATED EQUALIZER BARS ──────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const EqualizerBars = ({ isPlaying }: { isPlaying: boolean }) => (
  <div className="flex items-end gap-[2px] h-4">
    {[1, 2, 3, 4, 5].map((bar) => (
      <motion.div
        key={bar}
        className="w-[3px] rounded-full bg-gradient-to-t from-violet-500 to-cyan-400"
        animate={
          isPlaying
            ? {
                height: ["4px", "16px", "8px", "14px", "4px"],
              }
            : { height: "4px" }
        }
        transition={{
          duration: 1 + Math.random() * 0.5,
          repeat: isPlaying ? Infinity : 0,
          delay: bar * 0.1,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

// ═══════════════════════════════════════════════════════════════
// ─── NOW PLAYING MINI ─────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const NowPlayingMini = () => {
  const { currentSong, isPlaying } = usePlayerStore();
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  if (!currentSong) {
    return (
      <div className="hidden sm:flex items-center gap-4 min-w-[180px] w-[30%]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3 text-zinc-600"
        >
          <div
            className="w-14 h-14 rounded-xl bg-white/[0.03] border border-white/[0.06]
                       flex items-center justify-center"
          >
            <Music2 className="w-5 h-5 text-zinc-700" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-600">No track</p>
            <p className="text-xs text-zinc-700">Select a song to play</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="hidden sm:flex items-center gap-4 min-w-[180px] w-[30%]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Album art with vinyl effect */}
      <div className="relative group">
        {/* Glow effect */}
        <motion.div
          className="absolute -inset-1 rounded-xl blur-lg opacity-0 group-hover:opacity-100
                     transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, rgba(139,92,246,0.3), rgba(6,182,212,0.3))`,
          }}
        />

        <motion.div
          className="relative w-14 h-14 rounded-xl overflow-hidden border border-white/[0.08]
                     shadow-lg shadow-black/20"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <motion.img
            src={currentSong.imageUrl}
            alt={currentSong.title}
            className="w-full h-full object-cover"
            animate={isPlaying ? { scale: [1, 1.05, 1] } : { scale: 1 }}
            transition={{
              duration: 4,
              repeat: isPlaying ? Infinity : 0,
              ease: "easeInOut",
            }}
          />

          {/* Play overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 flex items-center justify-center"
              >
                <Maximize2 className="w-4 h-4 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Playing indicator */}
        {isPlaying && (
          <motion.div
            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full
                       bg-gradient-to-br from-emerald-400 to-cyan-400
                       flex items-center justify-center shadow-lg shadow-emerald-500/30"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
          </motion.div>
        )}
      </div>

      {/* Track info */}
      <div className="flex-1 min-w-0">
        <motion.div
          className="font-semibold text-sm truncate cursor-pointer
                     text-white hover:text-violet-300 transition-colors duration-300"
          whileHover={{ x: 2 }}
        >
          {currentSong.title}
        </motion.div>
        <motion.div
          className="text-xs text-zinc-500 truncate cursor-pointer
                     hover:text-zinc-300 transition-colors duration-300"
          whileHover={{ x: 2 }}
        >
          {currentSong.artist}
        </motion.div>

        {/* Mini equalizer */}
        {isPlaying && (
          <div className="mt-1">
            <EqualizerBars isPlaying={isPlaying} />
          </div>
        )}
      </div>

      {/* Like button */}
      <motion.button
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsLiked(!isLiked)}
        className="flex-shrink-0"
      >
        <Heart
          className={`w-4 h-4 transition-colors duration-300 ${
            isLiked
              ? "text-pink-500 fill-pink-500"
              : "text-zinc-500 hover:text-pink-400"
          }`}
        />
      </motion.button>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════
// ─── CONTROL BUTTON ───────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const ControlButton = ({
  icon: Icon,
  onClick,
  isActive,
  disabled,
  size = "sm",
  primary = false,
  tooltip,
}: {
  icon: React.ElementType;
  onClick?: () => void;
  isActive?: boolean;
  disabled?: boolean;
  size?: "sm" | "lg";
  primary?: boolean;
  tooltip?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  if (primary) {
    return (
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClick}
          disabled={disabled}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`
            relative w-12 h-12 rounded-full flex items-center justify-center
            transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed
            bg-white hover:bg-white shadow-lg shadow-white/20 hover:shadow-white/30
          `}
        >
          {/* Glow ring */}
          <motion.div
            className="absolute -inset-1 rounded-full opacity-0"
            animate={{ opacity: isHovered ? 0.5 : 0 }}
            style={{
              background:
                "linear-gradient(135deg, rgba(139,92,246,0.5), rgba(6,182,212,0.5))",
              filter: "blur(8px)",
            }}
          />
          <Icon className="w-5 h-5 text-black relative z-10" />
        </motion.button>
      </div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative p-2 rounded-lg transition-all duration-300
        disabled:opacity-40 disabled:cursor-not-allowed
        ${
          isActive
            ? "text-emerald-400"
            : "text-zinc-500 hover:text-white hover:bg-white/[0.05]"
        }
      `}
    >
      {/* Active indicator dot */}
      {isActive && (
        <motion.div
          layoutId="control-active"
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-400"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        />
      )}
      <Icon className={size === "lg" ? "w-5 h-5" : "w-4 h-4"} />

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md
                       bg-zinc-800 border border-white/[0.08] text-[10px] font-medium
                       text-zinc-300 whitespace-nowrap z-50"
          >
            {tooltip}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

// ═══════════════════════════════════════════════════════════════
// ─── PROGRESS BAR ─────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const ProgressBar = ({
  currentTime,
  duration,
  onSeek,
}: {
  currentTime: number;
  duration: number;
  onSeek: (value: number[]) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className="hidden sm:flex items-center gap-3 w-full max-w-[600px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="text-[11px] font-mono text-zinc-500 w-10 text-right tabular-nums">
        {formatTime(currentTime)}
      </span>

      <div className="flex-1 relative group">
        {/* Background track */}
        <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
          {/* Progress fill */}
          <motion.div
            className="h-full rounded-full relative"
            style={{
              width: `${progress}%`,
              background: isHovered
                ? "linear-gradient(90deg, #8b5cf6, #06b6d4, #ec4899)"
                : "linear-gradient(90deg, rgba(139,92,246,0.7), rgba(6,182,212,0.7))",
            }}
            transition={{ duration: 0.1 }}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 opacity-50"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
              }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
          </motion.div>
        </div>

        {/* Interactive slider overlay */}
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={1}
          className="absolute inset-0 opacity-0 hover:opacity-100 cursor-grab active:cursor-grabbing"
          onValueChange={onSeek}
        />

        {/* Hover thumb */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full
                         bg-white shadow-lg shadow-white/30 pointer-events-none"
              style={{ left: `calc(${progress}% - 6px)` }}
            />
          )}
        </AnimatePresence>
      </div>

      <span className="text-[11px] font-mono text-zinc-600 w-10 tabular-nums">
        {formatTime(duration)}
      </span>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// ─── VOLUME CONTROL (FIXED) ───────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const VolumeControl = ({
  volume,
  audioRef,
  onVolumeChange,
}: {
  volume: number;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  onVolumeChange: (value: number) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [prevVolume, setPrevVolume] = useState(volume > 0 ? volume : 25);

  // Determine if muted based on current volume
  const isMuted = volume === 0;

  const handleMuteToggle = () => {
    if (isMuted) {
      // Unmute: restore previous volume
      const restoreVolume = prevVolume > 0 ? prevVolume : 25;
      onVolumeChange(restoreVolume);

      // Apply to audio element
      if (audioRef.current) {
        audioRef.current.volume = restoreVolume / 100;
      }
    } else {
      // Mute: save current volume and set to 0
      setPrevVolume(volume);
      onVolumeChange(0);

      // Apply to audio element
      if (audioRef.current) {
        audioRef.current.volume = 0;
      }
    }
  };

  const handleSliderChange = (value: number[]) => {
    const newVolume = value[0];
    onVolumeChange(newVolume);

    // Save non-zero volume for unmute
    if (newVolume > 0) {
      setPrevVolume(newVolume);
    }

    // Apply to audio element
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }

    // Save to localStorage
    localStorage.setItem("volume", String(newVolume));
  };

  // Choose icon based on volume level
  const VolumeIcon = isMuted ? VolumeX : volume < 50 ? Volume1 : Volume2;

  return (
    <div
      className="flex items-center gap-2 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleMuteToggle}
        className={`p-1.5 rounded-lg transition-all duration-300
                   hover:bg-white/[0.05] ${
                     isMuted
                       ? "text-red-400 hover:text-red-300"
                       : "text-zinc-500 hover:text-white"
                   }`}
      >
        <VolumeIcon className="w-4 h-4" />
      </motion.button>

      <div className="relative w-24">
        {/* Background */}
        <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              width: `${volume}%`,
              background: isHovered
                ? "linear-gradient(90deg, #8b5cf6, #06b6d4)"
                : "rgba(255,255,255,0.3)",
            }}
          />
        </div>

        {/* Slider */}
        <Slider
          value={[volume]}
          max={100}
          step={1}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          onValueChange={handleSliderChange}
        />

        {/* Hover thumb */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full
                         bg-white shadow-md pointer-events-none"
              style={{ left: `calc(${volume}% - 5px)` }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Volume percentage */}
      <AnimatePresence>
        {isHovered && (
          <motion.span
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -5 }}
            className="text-[10px] font-mono text-zinc-500 w-8 tabular-nums"
          >
            {volume}%
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// ─── PLAYBACK CONTROLS ────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
export const PlaybackControls = () => {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    playNext,
    playPrevious,
    shuffle,
    repeat,
    toggleShuffle,
    toggleRepeat,
  } = usePlayerStore();

  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem("volume");
    return saved ? Number(saved) : 25;
  });
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio reference and set up event listeners
  useEffect(() => {
    const audio = document.querySelector("audio") as HTMLAudioElement;
    audioRef.current = audio;

    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);

    // Set initial volume from state
    audio.volume = volume / 100;

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
    };
  }, [currentSong]);

  // Sync volume to audio element when volume state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    localStorage.setItem("volume", String(newVolume));
  };

  return (
    <footer
      className="h-20 sm:h-24 px-4 relative z-50"
      style={{
        background:
          "linear-gradient(180deg, rgba(12,10,26,0.95) 0%, rgba(8,8,14,0.98) 100%)",
      }}
    >
      {/* Top border glow */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(139,92,246,0.2), rgba(6,182,212,0.2), transparent)",
        }}
      />

      {/* Ambient glow */}
      {currentSong && isPlaying && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background:
              "radial-gradient(ellipse 50% 80% at 50% 100%, rgba(139,92,246,0.03), transparent)",
          }}
        />
      )}

      <div className="flex justify-between items-center h-full max-w-[1800px] mx-auto relative">
        {/* ─── Now Playing Mini ─── */}
        <NowPlayingMini />

        {/* ─── Player Controls ─── */}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-full sm:max-w-[45%]">
          {/* Control buttons */}
          <div className="flex items-center gap-1 sm:gap-2">
            <ControlButton
              icon={Shuffle}
              onClick={toggleShuffle}
              isActive={shuffle}
              tooltip="Shuffle"
            />

            <ControlButton
              icon={SkipBack}
              onClick={playPrevious}
              disabled={!currentSong}
              tooltip="Previous"
            />

            <ControlButton
              icon={isPlaying ? Pause : Play}
              onClick={togglePlay}
              disabled={!currentSong}
              primary
            />

            <ControlButton
              icon={SkipForward}
              onClick={playNext}
              disabled={!currentSong}
              tooltip="Next"
            />

            <ControlButton
              icon={Repeat}
              onClick={toggleRepeat}
              isActive={repeat}
              tooltip="Repeat"
            />
          </div>

          {/* Progress bar */}
          <ProgressBar
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
          />
        </div>

        {/* ─── Volume & Extra Controls ─── */}
        <div className="hidden sm:flex items-center gap-1 min-w-[180px] w-[30%] justify-end">
          <ControlButton icon={Mic2} tooltip="Lyrics" />
          <ControlButton icon={ListMusic} tooltip="Queue" />
          <ControlButton icon={Laptop2} tooltip="Devices" />

          <div className="w-px h-5 bg-white/[0.06] mx-2" />

          <VolumeControl
            volume={volume}
            audioRef={audioRef}
            onVolumeChange={handleVolumeChange}
          />
        </div>
      </div>
    </footer>
  );
};

export default PlaybackControls;