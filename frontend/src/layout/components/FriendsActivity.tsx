import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import {
  HeadphonesIcon,
  Music,
  Users,
  Radio,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ═══════════════════════════════════════════════════════════════
// ─── MINI EQUALIZER ───────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const MiniEqualizer = () => (
  <div className="flex items-end gap-[2px] h-3">
    {[1, 2, 3].map((bar) => (
      <motion.div
        key={bar}
        className="w-[2px] rounded-full bg-gradient-to-t from-emerald-500 to-cyan-400"
        animate={{
          height: ["2px", "10px", "4px", "8px", "2px"],
        }}
        transition={{
          duration: 1 + Math.random() * 0.5,
          repeat: Infinity,
          delay: bar * 0.15,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

// ═══════════════════════════════════════════════════════════════
// ─── ONLINE PULSE DOT ─────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const OnlineDot = ({ isOnline }: { isOnline: boolean }) => (
  <div className="absolute -bottom-0.5 -right-0.5">
    {isOnline ? (
      <div className="relative">
        <motion.div
          className="absolute inset-0 rounded-full bg-emerald-400"
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.6, 0, 0.6],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <div className="relative h-3 w-3 rounded-full bg-emerald-500 border-2 border-[#0a0a12]" />
      </div>
    ) : (
      <div className="h-3 w-3 rounded-full bg-zinc-600 border-2 border-[#0a0a12]" />
    )}
  </div>
);

// ═══════════════════════════════════════════════════════════════
// ─── USER ACTIVITY CARD ───────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const UserActivityCard = ({
  user,
  activity,
  isOnline,
  index,
}: {
  user: any;
  activity: string | undefined;
  isOnline: boolean;
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isPlaying = activity && activity !== "Idle";

  const songName = isPlaying
    ? activity.replace("Playing ", "").split(" by ")[0]
    : null;
  const artistName = isPlaying ? activity.split(" by ")[1] : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: index * 0.06,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group"
    >
      <motion.div
        whileHover={{ x: -3 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`
          relative p-3 rounded-xl cursor-pointer transition-all duration-500
          border border-transparent
          ${
            isPlaying
              ? "hover:bg-emerald-500/[0.04] hover:border-emerald-500/10"
              : "hover:bg-white/[0.03] hover:border-white/[0.06]"
          }
        `}
      >
        {/* Playing glow background */}
        {isPlaying && (
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            style={{
              background:
                "radial-gradient(ellipse at left center, rgba(16,185,129,0.04), transparent 70%)",
            }}
          />
        )}

        <div className="flex items-start gap-3 relative z-10">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <motion.div
              animate={{
                boxShadow: isHovered
                  ? isPlaying
                    ? "0 0 20px rgba(16,185,129,0.15)"
                    : "0 0 15px rgba(139,92,246,0.1)"
                  : "none",
              }}
              transition={{ duration: 0.4 }}
              className="rounded-full"
            >
              <Avatar
                className={`
                  size-11 border-2 transition-all duration-500
                  ${
                    isPlaying
                      ? "border-emerald-500/30"
                      : isOnline
                        ? "border-white/10"
                        : "border-white/5"
                  }
                `}
              >
                <AvatarImage src={user.imageUrl} alt={user.name} />
                <AvatarFallback
                  className="bg-gradient-to-br from-violet-600/30 to-cyan-600/30 
                             text-white text-xs font-bold"
                >
                  {user.name?.[0] ?? "?"}
                </AvatarFallback>
              </Avatar>
            </motion.div>
            <OnlineDot isOnline={isOnline} />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className="font-semibold text-sm text-zinc-200 truncate
                           group-hover:text-white transition-colors duration-300"
              >
                {user.name}
              </span>
              {isPlaying && <MiniEqualizer />}
            </div>

            {isPlaying ? (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1.5"
              >
                {/* Song info with icon */}
                <div className="flex items-center gap-1.5">
                  <Music className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                  <p
                    className="text-xs font-semibold text-emerald-300/90 truncate
                               group-hover:text-emerald-300 transition-colors duration-300"
                  >
                    {songName}
                  </p>
                </div>
                {artistName && (
                  <p
                    className="text-[11px] text-zinc-500 truncate mt-0.5 pl-[18px]
                               group-hover:text-zinc-400 transition-colors duration-300"
                  >
                    {artistName}
                  </p>
                )}

                {/* Animated progress bar */}
                <div className="mt-2 h-[2px] w-full bg-white/[0.04] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500/60 to-cyan-500/60"
                    animate={{ width: ["0%", "100%"] }}
                    transition={{
                      duration: 30,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </div>
              </motion.div>
            ) : (
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                <span className="text-[11px] text-zinc-600 font-medium">
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════
// ─── SECTION HEADER ───────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const SectionHeader = ({ onlineCount }: { onlineCount: number }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="p-4 flex-shrink-0"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <motion.div
          className="relative w-8 h-8 rounded-lg flex items-center justify-center
                     bg-gradient-to-br from-violet-500/15 to-cyan-500/15"
          whileHover={{ scale: 1.1, rotate: -5 }}
        >
          <Users className="w-4 h-4 text-violet-400" />
        </motion.div>
        <div>
          <h2 className="text-sm font-bold text-white tracking-tight">
            Friends
          </h2>
          <p className="text-[10px] text-zinc-600 font-medium">Activity</p>
        </div>
      </div>

      {/* Online count */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full
                   bg-emerald-500/10 border border-emerald-500/15"
      >
        <div className="relative">
          <motion.div
            className="absolute inset-0 rounded-full bg-emerald-400"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className="relative w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </div>
        <span className="text-[10px] font-bold text-emerald-400 tabular-nums">
          {onlineCount}
        </span>
      </motion.div>
    </div>

    {/* Divider */}
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ delay: 0.4, duration: 0.8 }}
      className="h-px mt-4 origin-left"
      style={{
        background:
          "linear-gradient(90deg, transparent, rgba(139,92,246,0.15), rgba(6,182,212,0.15), transparent)",
      }}
    />
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════
// ─── LOGIN PROMPT ─────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const LoginPrompt = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, type: "spring" }}
    className="h-full flex flex-col items-center justify-center p-6 text-center space-y-5"
  >
    {/* Animated icon */}
    <div className="relative">
      <motion.div
        className="absolute -inset-3 rounded-full blur-xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(6,182,212,0.3))",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="relative w-16 h-16 rounded-2xl flex items-center justify-center
                   bg-gradient-to-br from-violet-500/20 to-cyan-500/20
                   border border-white/[0.08] backdrop-blur-sm"
        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
      >
        <HeadphonesIcon className="w-7 h-7 text-violet-300" />
      </motion.div>
    </div>

    <div className="space-y-2 max-w-[220px]">
      <h3 className="text-base font-bold text-white tracking-tight">
        See What Friends Are Playing
      </h3>
      <p className="text-xs text-zinc-500 leading-relaxed">
        Login to discover what music your friends are enjoying right now
      </p>
    </div>

    {/* Decorative dots */}
    <div className="flex items-center gap-1.5 pt-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1 h-1 rounded-full bg-violet-400/40"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════
// ─── FRIENDS ACTIVITY ─────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const FriendsActivity = () => {
  const { users, fetchUsers, onlineUsers, userActivities } = useChatStore();
  const { user } = useUser();

  useEffect(() => {
    if (user) fetchUsers();
  }, [fetchUsers, user]);

  const onlineCount = users.filter((u) => onlineUsers.has(u.clerkId)).length;

  // Sort: playing first, then online, then offline
  const sortedUsers = [...users].sort((a, b) => {
    const aActivity = userActivities.get(a.clerkId);
    const bActivity = userActivities.get(b.clerkId);
    const aPlaying = aActivity && aActivity !== "Idle" ? 2 : 0;
    const bPlaying = bActivity && bActivity !== "Idle" ? 2 : 0;
    const aOnline = onlineUsers.has(a.clerkId) ? 1 : 0;
    const bOnline = onlineUsers.has(b.clerkId) ? 1 : 0;
    return bPlaying + bOnline - (aPlaying + aOnline);
  });

  return (
    <div
      className="h-full flex flex-col rounded-xl overflow-hidden relative"
      style={{
        background:
          "linear-gradient(180deg, rgba(12,10,26,0.95) 0%, rgba(8,8,14,0.98) 100%)",
      }}
    >
      {/* Subtle border */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none z-0"
        style={{ border: "1px solid rgba(255,255,255,0.04)" }}
      />

      {/* Ambient glow */}
      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139,92,246,0.04) 0%, transparent 100%)",
        }}
      />

      {/* Header */}
      <SectionHeader onlineCount={onlineCount} />

      {/* Login prompt if not authenticated */}
      {!user && <LoginPrompt />}

      {/* User list */}
      {user && (
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <div className="px-3 pb-24 space-y-1">
              <AnimatePresence>
                {sortedUsers.map((u, index) => (
                  <UserActivityCard
                    key={u._id}
                    user={u}
                    activity={userActivities.get(u.clerkId)}
                    isOnline={onlineUsers.has(u.clerkId)}
                    index={index}
                  />
                ))}
              </AnimatePresence>

              {/* Empty state */}
              {users.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-10 px-4"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <WifiOff className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
                  </motion.div>
                  <p className="text-xs text-zinc-600 font-medium">
                    No friends online
                  </p>
                  <p className="text-[10px] text-zinc-700 mt-1">
                    Check back later
                  </p>
                </motion.div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default FriendsActivity;