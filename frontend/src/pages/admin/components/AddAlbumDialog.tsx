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
import { axiosInstance } from "@/lib/axios";
import {
  Plus,
  Upload,
  Library,
  User,
  Calendar,
  Disc3,
  Loader2,
  Sparkles,
  X,
  Image,
  CheckCircle2,
} from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useMusicStore } from "@/stores/useMusicStore";

const AddAlbumDialog = () => {
  const [albumDialogOpen, setAlbumDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { fetchAlbums } = useMusicStore();

  const [newAlbum, setNewAlbum] = useState({
    title: "",
    artist: "",
    releaseYear: new Date().getFullYear(),
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
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
      if (!imageFile) {
        return toast.error("Please upload an image");
      }

      const formData = new FormData();
      formData.append("title", newAlbum.title);
      formData.append("artist", newAlbum.artist);
      formData.append("releaseYear", newAlbum.releaseYear.toString());
      formData.append("imageFile", imageFile);

      await axiosInstance.post("/admin/albums", formData);

      setNewAlbum({
        title: "",
        artist: "",
        releaseYear: new Date().getFullYear(),
      });
      setImageFile(null);
      setImagePreview(null);
      await fetchAlbums();
      setAlbumDialogOpen(false);
      toast.success("Album created successfully");
    } catch (error: any) {
      toast.error("Failed to create album: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = imageFile && newAlbum.title && newAlbum.artist;

  return (
    <Dialog open={albumDialogOpen} onOpenChange={setAlbumDialogOpen}>
      <DialogTrigger asChild>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button className="relative overflow-hidden bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white font-semibold shadow-lg shadow-violet-500/20 border-0 px-5">
            {/* Button shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
            />
            <Plus className="mr-2 size-4" />
            Add Album
          </Button>
        </motion.div>
      </DialogTrigger>

      <AnimatePresence>
        {albumDialogOpen && (
          <DialogContent className="bg-zinc-950/95 backdrop-blur-xl border border-zinc-800/50 max-h-[85vh] overflow-auto rounded-2xl shadow-2xl shadow-black/50 p-0 max-w-lg">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.03, 0.08, 0.03],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-20 -right-20 w-60 h-60 bg-violet-500 rounded-full blur-[80px]"
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
                className="absolute -bottom-20 -left-20 w-60 h-60 bg-fuchsia-500 rounded-full blur-[80px]"
              />
            </div>

            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

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
                    <div className="absolute inset-0 bg-violet-500/20 rounded-xl blur-lg" />
                    <div className="relative p-2.5 bg-violet-500/10 rounded-xl ring-1 ring-violet-500/20">
                      <Library className="size-5 text-violet-400" />
                    </div>
                  </motion.div>
                  <div>
                    <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                      Add New Album
                      <Sparkles className="size-4 text-violet-400" />
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500 text-sm">
                      Create a new album for your collection
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="px-6 pb-6 space-y-5">
                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  className="hidden"
                />

                {/* Album Art Upload - Larger centered */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex justify-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                      relative group cursor-pointer rounded-2xl overflow-hidden
                      w-48 h-48 border-2 border-dashed transition-all duration-300
                      ${
                        imageFile
                          ? "border-violet-500/50 bg-violet-500/5"
                          : "border-zinc-700/50 hover:border-zinc-600 bg-zinc-900/50"
                      }
                    `}
                  >
                    {imagePreview ? (
                      <>
                        <img
                          src={imagePreview}
                          alt="Album Preview"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        {/* Vinyl peek effect */}
                        <motion.div
                          initial={{ x: 0 }}
                          animate={{ x: 20 }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                          className="absolute -right-10 top-1/2 -translate-y-1/2 size-36 rounded-full"
                          style={{
                            background:
                              "radial-gradient(circle at center, #27272a 20%, #18181b 21%, #18181b 40%, #27272a 41%, #27272a 42%, #18181b 43%, #18181b 60%, #27272a 61%)",
                          }}
                        >
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="size-4 rounded-full bg-zinc-600" />
                          </div>
                        </motion.div>

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                          <div className="text-center">
                            <Image className="size-8 text-white mx-auto mb-2" />
                            <span className="text-sm text-white font-medium">
                              Change Artwork
                            </span>
                          </div>
                        </div>

                        {/* Success badge */}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className="absolute top-3 right-3 p-1.5 bg-violet-500 rounded-full shadow-lg"
                        >
                          <CheckCircle2 className="size-4 text-white" />
                        </motion.div>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                        <motion.div
                          animate={{ y: [0, -8, 0] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="relative"
                        >
                          {/* Rotating disc effect */}
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 8,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="absolute inset-0 rounded-full"
                            style={{
                              background:
                                "conic-gradient(from 0deg, transparent, rgba(139,92,246,0.1), transparent)",
                            }}
                          />
                          <div className="p-4 bg-zinc-800/80 rounded-full ring-1 ring-zinc-700/50 group-hover:ring-violet-500/30 transition-all">
                            <Disc3 className="size-8 text-zinc-400 group-hover:text-violet-400 transition-colors" />
                          </div>
                        </motion.div>
                        <span className="text-sm text-zinc-400 mt-4 font-medium">
                          Album Artwork
                        </span>
                        <span className="text-xs text-zinc-600 mt-1">
                          Click to upload cover image
                        </span>
                      </div>
                    )}
                  </motion.div>
                </motion.div>

                {/* Image name display */}
                {imageFile && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <span className="text-xs text-violet-400 font-medium bg-violet-500/10 px-3 py-1 rounded-full">
                      {imageFile.name.slice(0, 30)}
                      {imageFile.name.length > 30 && "..."}
                    </span>
                  </motion.div>
                )}

                {/* Form Fields */}
                <div className="space-y-4 pt-2">
                  {/* Album Title */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                      <Library className="size-3.5 text-zinc-500" />
                      Album Title
                    </label>
                    <div className="relative group">
                      <Input
                        value={newAlbum.title}
                        onChange={(e) =>
                          setNewAlbum({ ...newAlbum, title: e.target.value })
                        }
                        placeholder="Enter album title"
                        className="bg-zinc-900/50 border-zinc-800 focus:border-violet-500/50 focus:ring-violet-500/20 rounded-lg h-11 pl-4 transition-all duration-300 placeholder:text-zinc-600"
                      />
                      <div className="absolute inset-0 rounded-lg bg-violet-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                  </motion.div>

                  {/* Artist */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                      <User className="size-3.5 text-zinc-500" />
                      Artist
                    </label>
                    <div className="relative group">
                      <Input
                        value={newAlbum.artist}
                        onChange={(e) =>
                          setNewAlbum({ ...newAlbum, artist: e.target.value })
                        }
                        placeholder="Enter artist name"
                        className="bg-zinc-900/50 border-zinc-800 focus:border-violet-500/50 focus:ring-violet-500/20 rounded-lg h-11 pl-4 transition-all duration-300 placeholder:text-zinc-600"
                      />
                      <div className="absolute inset-0 rounded-lg bg-violet-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                  </motion.div>

                  {/* Release Year */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                      <Calendar className="size-3.5 text-zinc-500" />
                      Release Year
                    </label>
                    <div className="relative group">
                      <Input
                        type="number"
                        value={newAlbum.releaseYear}
                        onChange={(e) =>
                          setNewAlbum({
                            ...newAlbum,
                            releaseYear: parseInt(e.target.value),
                          })
                        }
                        placeholder="Enter release year"
                        min={1900}
                        max={new Date().getFullYear()}
                        className="bg-zinc-900/50 border-zinc-800 focus:border-violet-500/50 focus:ring-violet-500/20 rounded-lg h-11 pl-4 transition-all duration-300 placeholder:text-zinc-600"
                      />
                      <div className="absolute inset-0 rounded-lg bg-violet-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />

                      {/* Year quick select buttons */}
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                        {[2024, 2023, 2022].map((year) => (
                          <motion.button
                            key={year}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              setNewAlbum({ ...newAlbum, releaseYear: year })
                            }
                            className={`
                              text-[10px] px-2 py-0.5 rounded-md font-medium transition-all
                              ${
                                newAlbum.releaseYear === year
                                  ? "bg-violet-500/20 text-violet-400"
                                  : "bg-zinc-800/50 text-zinc-500 hover:text-zinc-300"
                              }
                            `}
                          >
                            {year}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Footer */}
              <DialogFooter className="p-6 pt-2 border-t border-zinc-800/50">
                <div className="flex items-center justify-between w-full gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => setAlbumDialogOpen(false)}
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
                            ? "bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white shadow-lg shadow-violet-500/20"
                            : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                        }
                      `}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="size-4 animate-spin" />
                          Creating...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Upload className="size-4" />
                          Add Album
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

export default AddAlbumDialog;