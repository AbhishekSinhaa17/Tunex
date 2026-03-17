import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Music, Disc3, Sparkles } from "lucide-react";
import SongsTable from "./SongsTable";
import AddSongDialog from "./AddSongDialog";
import { motion } from "framer-motion";
import { useMusicStore } from "@/stores/useMusicStore";

const SongsTabContent = () => {
  const { songs } = useMusicStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative group/card"
    >
      {/* Outer glow */}
      <div className="absolute -inset-1 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent rounded-2xl blur-xl opacity-0 group-hover/card:opacity-60 transition-opacity duration-700" />

      <Card className="relative overflow-hidden bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 rounded-2xl shadow-2xl shadow-black/20">
        {/* Animated background pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating music notes decoration */}
          <motion.div
            animate={{
              y: [-20, -80],
              x: [0, 30],
              opacity: [0, 0.15, 0],
              rotate: [0, 15],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 right-20"
          >
            <Music className="size-8 text-emerald-500" />
          </motion.div>
          <motion.div
            animate={{
              y: [-10, -100],
              x: [0, -20],
              opacity: [0, 0.1, 0],
              rotate: [0, -20],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              delay: 2,
              ease: "easeInOut",
            }}
            className="absolute top-2/3 right-40"
          >
            <Disc3 className="size-6 text-emerald-500" />
          </motion.div>
          <motion.div
            animate={{
              y: [0, -60],
              x: [0, 15],
              opacity: [0, 0.12, 0],
              rotate: [0, 25],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              delay: 4,
              ease: "easeInOut",
            }}
            className="absolute top-1/2 right-60"
          >
            <Sparkles className="size-5 text-emerald-500" />
          </motion.div>

          {/* Gradient orbs */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-500/5 rounded-full blur-[80px]" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-emerald-500/3 rounded-full blur-[60px]" />
        </div>

        {/* Top accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent origin-center"
        />

        <CardHeader className="relative pb-2">
          <div className="flex items-center justify-between">
            {/* Left side - Title section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex items-start gap-4"
            >
              {/* Icon with glow */}
              <div className="relative mt-1">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 bg-emerald-500/20 rounded-xl blur-lg"
                />
                <div className="relative p-2.5 bg-emerald-500/10 rounded-xl ring-1 ring-emerald-500/20 shadow-lg shadow-emerald-500/5">
                  <Music className="size-5 text-emerald-400" />
                </div>
              </div>

              <div>
                <CardTitle className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  Songs Library
                  {/* Song count badge */}
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.5,
                      type: "spring",
                      stiffness: 300,
                    }}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
                  >
                    {songs.length}
                  </motion.span>
                </CardTitle>
                <CardDescription className="text-zinc-500 font-medium mt-1">
                  Manage your music tracks, upload new songs, and organize your
                  library
                </CardDescription>

                {/* Mini stats */}
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-4 mt-3"
                >
                  <div className="flex items-center gap-1.5">
                    <div className="size-1.5 rounded-full bg-emerald-500" />
                    <span className="text-xs text-zinc-500 font-medium">
                      {songs.length} Tracks
                    </span>
                  </div>
                  <div className="h-3 w-px bg-zinc-800" />
                  <div className="flex items-center gap-1.5">
                    <div className="size-1.5 rounded-full bg-violet-500" />
                    <span className="text-xs text-zinc-500 font-medium">
                      {new Set(songs.map((s) => s.artist)).size} Artists
                    </span>
                  </div>
                  <div className="h-3 w-px bg-zinc-800" />
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex size-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full size-1.5 bg-emerald-500" />
                    </span>
                    <span className="text-xs text-zinc-500 font-medium">
                      Live
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right side - Add Song Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative"
            >
              {/* Button glow */}
              <div className="absolute -inset-1 bg-emerald-500/20 rounded-xl blur-lg opacity-0 hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <AddSongDialog />
              </div>
            </motion.div>
          </div>

          {/* Divider with gradient */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="mt-6 h-px bg-gradient-to-r from-emerald-500/20 via-zinc-800/50 to-transparent origin-left"
          />
        </CardHeader>

        <CardContent className="relative pt-2">
          <SongsTable />
        </CardContent>

        {/* Bottom gradient accent */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
      </Card>
    </motion.div>
  );
};

export default SongsTabContent;