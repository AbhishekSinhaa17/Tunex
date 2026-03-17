import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMusicStore } from "@/stores/useMusicStore";
import { Calendar, Trash2, Music2, Loader2, AlertCircle, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const SongsTable = () => {
  const { songs, isSongsLoading, error, deleteSong } = useMusicStore();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await deleteSong(id);
    setDeletingId(null);
  };

  if (isSongsLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20"
      >
        <div className="relative">
          {/* Pulsing background glow */}
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="relative"
          >
            <Loader2 className="size-10 text-emerald-400" />
          </motion.div>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-zinc-400 font-medium tracking-wide"
        >
          Loading your tracks...
        </motion.p>
        {/* Animated dots */}
        <div className="flex gap-1.5 mt-3">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
              className="size-1.5 rounded-full bg-emerald-500"
            />
          ))}
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-16"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-red-500/10 rounded-full blur-xl" />
          <div className="relative p-4 bg-red-500/10 rounded-full ring-1 ring-red-500/20">
            <AlertCircle className="size-8 text-red-400" />
          </div>
        </div>
        <p className="mt-4 text-red-400 font-medium">{error}</p>
        <p className="mt-1 text-sm text-zinc-500">Please try again later</p>
      </motion.div>
    );
  }

  if (songs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-zinc-500/10 rounded-full blur-xl" />
          <div className="relative p-5 bg-zinc-800/50 rounded-full ring-1 ring-zinc-700/50">
            <Music2 className="size-10 text-zinc-500" />
          </div>
        </div>
        <p className="mt-4 text-zinc-400 font-medium text-lg">No songs yet</p>
        <p className="mt-1 text-sm text-zinc-600">
          Upload your first track to get started
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {/* Table container with glassmorphism */}
      <div className="relative overflow-hidden rounded-xl border border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm">
        {/* Top gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

        <Table>
          <TableHeader>
            <TableRow className="border-b border-zinc-800/50 hover:bg-transparent">
              <TableHead className="w-[60px] text-zinc-500 font-semibold text-xs uppercase tracking-wider py-4">
                #
              </TableHead>
              <TableHead className="text-zinc-500 font-semibold text-xs uppercase tracking-wider">
                Track
              </TableHead>
              <TableHead className="text-zinc-500 font-semibold text-xs uppercase tracking-wider">
                Artist
              </TableHead>
              <TableHead className="text-zinc-500 font-semibold text-xs uppercase tracking-wider">
                Released
              </TableHead>
              <TableHead className="text-right text-zinc-500 font-semibold text-xs uppercase tracking-wider pr-6">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <AnimatePresence>
              {songs.map((song, index) => (
                <motion.tr
                  key={song._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{
                    opacity: 0,
                    x: 50,
                    scale: 0.95,
                    filter: "blur(5px)",
                    transition: { duration: 0.3 },
                  }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  onMouseEnter={() => setHoveredRow(song._id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className={`
                    group relative border-b border-zinc-800/30
                    transition-all duration-300 ease-out
                    ${hoveredRow === song._id
                      ? "bg-zinc-800/40"
                      : "bg-transparent hover:bg-zinc-800/20"
                    }
                    ${deletingId === song._id ? "opacity-50" : ""}
                  `}
                >
                  {/* Row hover accent */}
                  <td className="relative py-3 pl-4">
                    {/* Left accent bar on hover */}
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{
                        scaleY: hoveredRow === song._id ? 1 : 0,
                      }}
                      className="absolute left-0 top-2 bottom-2 w-[2px] bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full origin-center"
                      transition={{ duration: 0.2 }}
                    />

                    {/* Image with play overlay */}
                    <div className="relative size-11 rounded-lg overflow-hidden ring-1 ring-white/5 group-hover:ring-white/10 transition-all duration-300 shadow-lg shadow-black/20">
                      <img
                        src={song.imageUrl}
                        alt={song.title}
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {/* Play overlay */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: hoveredRow === song._id ? 1 : 0,
                        }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center"
                      >
                        <Play className="size-4 text-white fill-white" />
                      </motion.div>
                    </div>
                  </td>

                  <td className="py-3">
                    <div className="flex flex-col">
                      <span
                        className={`font-semibold text-sm transition-colors duration-300 ${
                          hoveredRow === song._id
                            ? "text-emerald-400"
                            : "text-white"
                        }`}
                      >
                        {song.title}
                      </span>
                      {/* Subtle ID for reference */}
                      <span className="text-[10px] text-zinc-600 font-mono mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        ID: {song._id.slice(-6)}
                      </span>
                    </div>
                  </td>

                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      {/* Artist avatar placeholder */}
                      <div className="size-6 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 ring-1 ring-white/5 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold text-zinc-400">
                          {song.artist.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-zinc-300 font-medium">
                        {song.artist}
                      </span>
                    </div>
                  </td>

                  <td className="py-3">
                    <span className="inline-flex items-center gap-1.5 text-sm text-zinc-400 bg-zinc-800/40 px-2.5 py-1 rounded-md ring-1 ring-zinc-700/30">
                      <Calendar className="size-3.5 text-zinc-500" />
                      {song.createdAt.split("T")[0]}
                    </span>
                  </td>

                  <td className="py-3 pr-4 text-right">
                    <div className="flex gap-2 justify-end items-center">
                      {/* Delete button with animation */}
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={deletingId === song._id}
                          className={`
                            relative overflow-hidden
                            text-zinc-500 hover:text-red-400
                            hover:bg-red-500/10
                            border border-transparent hover:border-red-500/20
                            rounded-lg px-3 py-2
                            transition-all duration-300
                            disabled:opacity-50
                            group/btn
                          `}
                          onClick={() => handleDelete(song._id)}
                        >
                          {deletingId === song._id ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            >
                              <Loader2 className="size-4" />
                            </motion.div>
                          ) : (
                            <>
                              <Trash2 className="size-4 transition-transform duration-200 group-hover/btn:scale-110" />
                              {/* Red glow on hover */}
                              <div className="absolute inset-0 bg-red-500/0 group-hover/btn:bg-red-500/5 transition-colors duration-300 rounded-lg" />
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>

        {/* Bottom gradient accent */}
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-700/30 to-transparent" />
      </div>

      {/* Footer stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: songs.length * 0.05 + 0.3 }}
        className="mt-3 flex items-center justify-between px-4 py-2.5 rounded-lg bg-zinc-900/30 border border-zinc-800/30"
      >
        <div className="flex items-center gap-2">
          <Music2 className="size-3.5 text-zinc-600" />
          <span className="text-xs text-zinc-500 font-medium">
            {songs.length} {songs.length === 1 ? "track" : "tracks"} total
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex size-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full size-1.5 bg-emerald-500" />
          </span>
          <span className="text-[11px] text-zinc-600 font-medium">
            Synced
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SongsTable;