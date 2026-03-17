import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { axiosInstance } from "@/lib/axios";
import { useMusicStore } from "@/stores/useMusicStore";
import {
  Plus,
  Upload,
  Music,
  Image,
  User,
  Clock,
  Disc3,
  Loader2,
  Sparkles,
  X,
  FileAudio,
  CheckCircle2,
} from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";

interface NewSong {
  title: string;
  artist: string;
  album: string;
  duration: string;
}

const AddSongDialog = () => {
  const { albums, fetchSongs } = useMusicStore();
  const [songDialogOpen, setSongDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { getToken } = useAuth();

  const [newSong, setNewSong] = useState<NewSong>({
    title: "",
    artist: "",
    album: "",
    duration: "0",
  });

  const [files, setFiles] = useState<{
    audio: File | null;
    image: File | null;
  }>({
    audio: null,
    image: null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      if (!files.audio || !files.image) {
        return toast.error("Please upload both audio and image files");
      }

      const formData = new FormData();

      formData.append("title", newSong.title);
      formData.append("artist", newSong.artist);
      formData.append("duration", newSong.duration);
      if (newSong.album && newSong.album !== "none") {
        formData.append("albumId", newSong.album);
      }

      formData.append("audioFile", files.audio);
      formData.append("imageFile", files.image);

      const token = await getToken();

      await axiosInstance.post("/admin/songs", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNewSong({
        title: "",
        artist: "",
        album: "",
        duration: "0",
      });

      setFiles({
        audio: null,
        image: null,
      });

      setImagePreview(null);
      await fetchSongs();
      setSongDialogOpen(false);
      toast.success("Song added successfully");
    } catch (error: any) {
      toast.error("Failed to add song: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (seconds: string) => {
    const secs = parseInt(seconds);
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  const isFormValid =
    files.audio && files.image && newSong.title && newSong.artist;

  return (
    <Dialog open={songDialogOpen} onOpenChange={setSongDialogOpen}>
      <DialogTrigger asChild>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button className="relative overflow-hidden bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-lg shadow-emerald-500/20 border-0 px-5">
            {/* Button shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
            />
            <Plus className="mr-2 size-4" />
            Add Song
          </Button>
        </motion.div>
      </DialogTrigger>

      <AnimatePresence>
        {songDialogOpen && (
          <DialogContent className="bg-zinc-950/95 backdrop-blur-xl border border-zinc-800/50 max-h-[85vh] overflow-auto rounded-2xl shadow-2xl shadow-black/50 p-0 max-w-lg">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.03, 0.08, 0.03],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-500 rounded-full blur-[80px]"
              />
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.02, 0.06, 0.02],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  delay: 1,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-20 -left-20 w-60 h-60 bg-violet-500 rounded-full blur-[80px]"
              />
            </div>

            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <DialogHeader className="p-6 pb-2">
                <div className="flex items-center gap-3">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      delay: 0.1,
                    }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-emerald-500/20 rounded-xl blur-lg" />
                    <div className="relative p-2.5 bg-emerald-500/10 rounded-xl ring-1 ring-emerald-500/20">
                      <Music className="size-5 text-emerald-400" />
                    </div>
                  </motion.div>
                  <div>
                    <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                      Add New Song
                      <Sparkles className="size-4 text-emerald-400" />
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500 text-sm">
                      Upload your track to the music library
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="px-6 pb-6 space-y-5">
                {/* Hidden file inputs */}
                <input
                  type="file"
                  accept="audio/*"
                  ref={audioInputRef}
                  hidden
                  onChange={(e) => {
                    const file = e.target.files![0];
                    setFiles((prev) => ({ ...prev, audio: file }));
                    const audio = new Audio(URL.createObjectURL(file));
                    audio.onloadedmetadata = () => {
                      const duration = Math.floor(audio.duration);
                      setNewSong((prev) => ({
                        ...prev,
                        duration: duration.toString(),
                      }));
                    };
                  }}
                />

                <input
                  type="file"
                  ref={imageInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />

                {/* Upload Section */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Image Upload */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => imageInputRef.current?.click()}
                    className={`
                      relative group cursor-pointer rounded-xl overflow-hidden
                      aspect-square border-2 border-dashed transition-all duration-300
                      ${
                        files.image
                          ? "border-emerald-500/50 bg-emerald-500/5"
                          : "border-zinc-700/50 hover:border-zinc-600 bg-zinc-900/50"
                      }
                    `}
                  >
                    {imagePreview ? (
                      <>
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="text-center">
                            <Image className="size-6 text-white mx-auto mb-1" />
                            <span className="text-xs text-white">Change</span>
                          </div>
                        </div>
                        {/* Success badge */}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 p-1 bg-emerald-500 rounded-full shadow-lg"
                        >
                          <CheckCircle2 className="size-3 text-white" />
                        </motion.div>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="p-3 bg-zinc-800/80 rounded-full mb-2 ring-1 ring-zinc-700/50 group-hover:ring-emerald-500/30 transition-all"
                        >
                          <Image className="size-5 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
                        </motion.div>
                        <span className="text-xs text-zinc-500 text-center font-medium">
                          Cover Art
                        </span>
                        <span className="text-[10px] text-zinc-600 mt-0.5">
                          Click to upload
                        </span>
                      </div>
                    )}
                  </motion.div>

                  {/* Audio Upload */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => audioInputRef.current?.click()}
                    className={`
                      relative group cursor-pointer rounded-xl overflow-hidden
                      aspect-square border-2 border-dashed transition-all duration-300
                      ${
                        files.audio
                          ? "border-emerald-500/50 bg-emerald-500/5"
                          : "border-zinc-700/50 hover:border-zinc-600 bg-zinc-900/50"
                      }
                    `}
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                      {files.audio ? (
                        <>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="relative"
                          >
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              className="p-3 bg-emerald-500/10 rounded-full ring-1 ring-emerald-500/30"
                            >
                              <Disc3 className="size-6 text-emerald-400" />
                            </motion.div>
                            {/* Success badge */}
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -right-1 p-1 bg-emerald-500 rounded-full shadow-lg"
                            >
                              <CheckCircle2 className="size-3 text-white" />
                            </motion.div>
                          </motion.div>
                          <span className="text-xs text-emerald-400 mt-2 font-medium text-center truncate max-w-full px-2">
                            {files.audio.name.slice(0, 15)}...
                          </span>
                          <span className="text-[10px] text-zinc-500 mt-0.5">
                            {formatDuration(newSong.duration)}
                          </span>
                        </>
                      ) : (
                        <>
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: 0.5,
                              ease: "easeInOut",
                            }}
                            className="p-3 bg-zinc-800/80 rounded-full mb-2 ring-1 ring-zinc-700/50 group-hover:ring-emerald-500/30 transition-all"
                          >
                            <FileAudio className="size-5 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
                          </motion.div>
                          <span className="text-xs text-zinc-500 text-center font-medium">
                            Audio File
                          </span>
                          <span className="text-[10px] text-zinc-600 mt-0.5">
                            MP3, WAV, etc.
                          </span>
                        </>
                      )}
                    </div>
                  </motion.div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  {/* Title */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                      <Music className="size-3.5 text-zinc-500" />
                      Title
                    </label>
                    <div className="relative group">
                      <Input
                        value={newSong.title}
                        onChange={(e) =>
                          setNewSong({ ...newSong, title: e.target.value })
                        }
                        placeholder="Enter song title"
                        className="bg-zinc-900/50 border-zinc-800 focus:border-emerald-500/50 focus:ring-emerald-500/20 rounded-lg h-11 pl-4 transition-all duration-300 placeholder:text-zinc-600"
                      />
                      <div className="absolute inset-0 rounded-lg bg-emerald-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                  </motion.div>

                  {/* Artist */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                      <User className="size-3.5 text-zinc-500" />
                      Artist
                    </label>
                    <div className="relative group">
                      <Input
                        value={newSong.artist}
                        onChange={(e) =>
                          setNewSong({ ...newSong, artist: e.target.value })
                        }
                        placeholder="Enter artist name"
                        className="bg-zinc-900/50 border-zinc-800 focus:border-emerald-500/50 focus:ring-emerald-500/20 rounded-lg h-11 pl-4 transition-all duration-300 placeholder:text-zinc-600"
                      />
                      <div className="absolute inset-0 rounded-lg bg-emerald-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                  </motion.div>

                  {/* Duration (Read-only) */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                      <Clock className="size-3.5 text-zinc-500" />
                      Duration
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        value={
                          files.audio
                            ? formatDuration(newSong.duration)
                            : "Auto-detected"
                        }
                        readOnly
                        className="bg-zinc-900/30 border-zinc-800/50 rounded-lg h-11 pl-4 text-zinc-400 cursor-not-allowed"
                      />
                      {files.audio && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          <CheckCircle2 className="size-4 text-emerald-500" />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>

                  {/* Album Selection */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                      <Disc3 className="size-3.5 text-zinc-500" />
                      Album
                      <span className="text-xs text-zinc-600 font-normal">
                        (Optional)
                      </span>
                    </label>
                    <Select
                      value={newSong.album}
                      onValueChange={(value) =>
                        setNewSong({ ...newSong, album: value })
                      }
                    >
                      <SelectTrigger className="bg-zinc-900/50 border-zinc-800 focus:border-emerald-500/50 focus:ring-emerald-500/20 rounded-lg h-11 transition-all duration-300">
                        <SelectValue placeholder="Select album or release as single" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800 rounded-xl shadow-xl shadow-black/50">
                        <SelectItem
                          value="none"
                          className="focus:bg-zinc-800 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <Music className="size-3.5 text-zinc-500" />
                            No Album (Single)
                          </div>
                        </SelectItem>
                        {albums.map((album) => (
                          <SelectItem
                            key={album._id}
                            value={album._id}
                            className="focus:bg-zinc-800 rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              <Disc3 className="size-3.5 text-violet-400" />
                              {album.title}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </motion.div>
                </div>
              </div>

              {/* Footer */}
              <DialogFooter className="p-6 pt-2 border-t border-zinc-800/50">
                <div className="flex items-center justify-between w-full gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => setSongDialogOpen(false)}
                    disabled={isLoading}
                    className="text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg"
                  >
                    <X className="size-4 mr-2" />
                    Cancel
                  </Button>

                  <motion.div
                    whileHover={{ scale: isFormValid ? 1.02 : 1 }}
                    whileTap={{ scale: isFormValid ? 0.98 : 1 }}
                  >
                    <Button
                      onClick={handleSubmit}
                      disabled={isLoading || !isFormValid}
                      className={`
                        relative overflow-hidden rounded-lg px-6 font-semibold
                        ${
                          isFormValid
                            ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/20"
                            : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                        }
                      `}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="size-4 animate-spin" />
                          Uploading...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Upload className="size-4" />
                          Add Song
                        </span>
                      )}

                      {/* Button shine effect */}
                      {isFormValid && !isLoading && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "100%" }}
                          transition={{ duration: 0.6 }}
                        />
                      )}
                    </Button>
                  </motion.div>
                </div>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

export default AddSongDialog;