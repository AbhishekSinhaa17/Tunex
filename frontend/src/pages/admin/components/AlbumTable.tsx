import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMusicStore } from "@/stores/useMusicStore";
import {
  Calendar,
  Music,
  Trash2,
  Disc3,
  Loader2,
  Library,
  Play,
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AlbumsTable = () => {
  const { albums, deleteAlbum, fetchAlbums, isAlbumsLoading } = useMusicStore();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await deleteAlbum(id);
    setDeletingId(null);
  };

  if (isAlbumsLoading && albums.length === 0) {
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
              scale: [1, 1.4, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-violet-500/20 rounded-full blur-xl"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="relative"
          >
            <Disc3 className="size-12 text-violet-400" />
          </motion.div>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-5 text-zinc-400 font-medium tracking-wide text-lg"
        >
          Loading albums...
        </motion.p>
        {/* Animated bars */}
        <div className="flex items-end gap-1 mt-4 h-6">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              animate={{
                height: ["30%", "100%", "30%"],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
              className="w-1.5 rounded-full bg-gradient-to-t from-violet-600/40 to-violet-400/80"
            />
          ))}
        </div>
      </motion.div>
    );
  }

  if (albums.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center justify-center py-20"
      >
        <div className="relative">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-zinc-500/10 rounded-full blur-xl"
          />
          <div className="relative p-6 bg-zinc-800/50 rounded-2xl ring-1 ring-zinc-700/50">
            <Library className="size-12 text-zinc-500" />
          </div>
        </div>
        <p className="mt-5 text-zinc-400 font-semibold text-lg">
          No albums yet
        </p>
        <p className="mt-1 text-sm text-zinc-600">
          Create your first album to start organizing your music
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
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

        <Table>
          <TableHeader>
            <TableRow className="border-b border-zinc-800/50 hover:bg-transparent">
              <TableHead className="w-[60px] text-zinc-500 font-semibold text-xs uppercase tracking-wider py-4">
                #
              </TableHead>
              <TableHead className="text-zinc-500 font-semibold text-xs uppercase tracking-wider">
                Album
              </TableHead>
              <TableHead className="text-zinc-500 font-semibold text-xs uppercase tracking-wider">
                Artist
              </TableHead>
              <TableHead className="text-zinc-500 font-semibold text-xs uppercase tracking-wider">
                Released
              </TableHead>
              <TableHead className="text-zinc-500 font-semibold text-xs uppercase tracking-wider">
                Tracks
              </TableHead>
              <TableHead className="text-right text-zinc-500 font-semibold text-xs uppercase tracking-wider pr-6">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <AnimatePresence>
              {albums.map((album, index) => (
                <motion.tr
                  key={album._id}
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
                  onMouseEnter={() => setHoveredRow(album._id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className={`
                    group relative border-b border-zinc-800/30
                    transition-all duration-300 ease-out
                    ${
                      hoveredRow === album._id
                        ? "bg-zinc-800/40"
                        : "bg-transparent hover:bg-zinc-800/20"
                    }
                    ${deletingId === album._id ? "opacity-50" : ""}
                  `}
                >
                  {/* Left accent bar on hover */}
                  <td className="relative py-3 pl-4">
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{
                        scaleY: hoveredRow === album._id ? 1 : 0,
                      }}
                      className="absolute left-0 top-2 bottom-2 w-[2px] bg-gradient-to-b from-violet-400 to-violet-600 rounded-full origin-center"
                      transition={{ duration: 0.2 }}
                    />

                    {/* Album cover with hover overlay */}
                    <div className="relative size-12 rounded-lg overflow-hidden ring-1 ring-white/5 group-hover:ring-white/10 transition-all duration-300 shadow-lg shadow-black/30">
                      <img
                        src={album.imageUrl}
                        alt={album.title}
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {/* Play overlay */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: hoveredRow === album._id ? 1 : 0,
                        }}
                        className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center"
                      >
                        <Play className="size-5 text-white fill-white" />
                      </motion.div>

                      {/* Vinyl record peek effect */}
                      <motion.div
                        initial={{ x: 0 }}
                        animate={{
                          x: hoveredRow === album._id ? 6 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className="absolute -right-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-zinc-900 ring-2 ring-zinc-700/50"
                        style={{
                          background:
                            "radial-gradient(circle at center, #27272a 20%, #18181b 21%, #18181b 40%, #27272a 41%, #27272a 42%, #18181b 43%, #18181b 60%, #27272a 61%)",
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="size-2 rounded-full bg-zinc-600" />
                        </div>
                      </motion.div>
                    </div>
                  </td>

                  {/* Title */}
                  <td className="py-3">
                    <div className="flex flex-col">
                      <span
                        className={`font-semibold text-sm transition-colors duration-300 ${
                          hoveredRow === album._id
                            ? "text-violet-400"
                            : "text-white"
                        }`}
                      >
                        {album.title}
                      </span>
                      <span className="text-[10px] text-zinc-600 font-mono mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        ID: {album._id.slice(-6)}
                      </span>
                    </div>
                  </td>

                  {/* Artist */}
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      {/* Artist avatar */}
                      <div className="size-7 rounded-full bg-gradient-to-br from-violet-500/20 to-violet-700/20 ring-1 ring-violet-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-[11px] font-bold text-violet-300">
                          {album.artist.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-zinc-300 font-medium">
                        {album.artist}
                      </span>
                    </div>
                  </td>

                  {/* Release Year */}
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1.5 text-sm text-zinc-400 bg-zinc-800/40 px-2.5 py-1 rounded-md ring-1 ring-zinc-700/30">
                      <Calendar className="size-3.5 text-zinc-500" />
                      {album.releaseYear}
                    </span>
                  </td>

                  {/* Songs Count */}
                  <td className="py-3">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="inline-flex items-center gap-2"
                    >
                      <div className="flex items-center gap-1.5 bg-violet-500/10 px-2.5 py-1 rounded-md ring-1 ring-violet-500/15">
                        <Music className="size-3.5 text-violet-400" />
                        <span className="text-sm font-semibold text-violet-300">
                          {album.songs.length}
                        </span>
                        <span className="text-xs text-violet-400/60">
                          {album.songs.length === 1 ? "track" : "tracks"}
                        </span>
                      </div>

                      {/* Mini progress dots */}
                      <div className="hidden lg:flex items-center gap-0.5">
                        {[...Array(Math.min(album.songs.length, 5))].map(
                          (_, i) => (
                            <motion.div
                              key={i}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{
                                delay: index * 0.05 + i * 0.1 + 0.3,
                                type: "spring",
                                stiffness: 300,
                              }}
                              className="size-1.5 rounded-full bg-violet-500/40"
                            />
                          )
                        )}
                        {album.songs.length > 5 && (
                          <span className="text-[9px] text-violet-500/50 ml-0.5">
                            +{album.songs.length - 5}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 pr-4 text-right">
                    <div className="flex gap-2 justify-end items-center">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={deletingId === album._id}
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
                          onClick={() => handleDelete(album._id)}
                        >
                          {deletingId === album._id ? (
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
        transition={{ delay: albums.length * 0.05 + 0.3 }}
        className="mt-3 flex items-center justify-between px-4 py-2.5 rounded-lg bg-zinc-900/30 border border-zinc-800/30"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Library className="size-3.5 text-zinc-600" />
            <span className="text-xs text-zinc-500 font-medium">
              {albums.length} {albums.length === 1 ? "album" : "albums"}
            </span>
          </div>
          <div className="h-3 w-px bg-zinc-800" />
          <div className="flex items-center gap-2">
            <Music className="size-3.5 text-zinc-600" />
            <span className="text-xs text-zinc-500 font-medium">
              {albums.reduce((acc, a) => acc + a.songs.length, 0)} total tracks
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex size-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
            <span className="relative inline-flex rounded-full size-1.5 bg-violet-500" />
          </span>
          <span className="text-[11px] text-zinc-600 font-medium">Synced</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AlbumsTable;