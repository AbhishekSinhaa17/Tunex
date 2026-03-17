import { useAuthStore } from "@/stores/useAuthStore";
import Header from "./components/Header";
import DashboardStats from "./components/DashboardStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Album, Music, ShieldAlert, Loader2 } from "lucide-react";
import SongsTabContent from "./components/SongsTabContent";
import AlbumsTabContent from "./components/AlbumsTabContent";
import { useEffect, useState } from "react";
import { useMusicStore } from "@/stores/useMusicStore";
import { useAuth } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";

const AdminPage = () => {
  const { isAdmin, isLoading } = useAuthStore();
  const { fetchSongs, fetchAlbums, fetchStats } = useMusicStore();
  const { getToken, isLoaded } = useAuth();
  const [activeTab, setActiveTab] = useState("songs");

  useEffect(() => {
    if (!isLoaded) return;

    const loadData = async () => {
      const token = await getToken();
      if (!token) return;

      fetchAlbums();
      fetchSongs();
      fetchStats(token);
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="size-12 text-emerald-500" />
          </motion.div>
          <p className="text-zinc-400 text-lg font-medium tracking-wide">
            Loading admin panel...
          </p>
        </motion.div>
      </div>
    );
  }

  if (!isAdmin && !isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative"
        >
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-red-600/20 via-red-500/10 to-red-600/20 rounded-2xl blur-xl" />
          <div className="relative bg-zinc-900/80 backdrop-blur-xl border border-red-500/20 rounded-2xl p-12 text-center max-w-md">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="mx-auto w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 ring-2 ring-red-500/20"
            >
              <ShieldAlert className="size-10 text-red-400" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-bold text-white mb-2"
            >
              Access Denied
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-zinc-400"
            >
              You don't have permission to access this page.
            </motion.p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* ── Animated background blobs ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: [0, 80, -40, 0],
            y: [0, -60, 40, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -60, 80, 0],
            y: [0, 80, -40, 0],
            scale: [1, 0.9, 1.2, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, 40, -80, 0],
            y: [0, -40, 60, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]"
        />
      </div>

      {/* ── Subtle grid overlay ── */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Main content ── */}
      <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header with staggered entrance */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <Header />
        </motion.div>

        {/* Dashboard Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <DashboardStats />
        </motion.div>

        {/* Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <Tabs
            defaultValue="songs"
            className="space-y-6"
            onValueChange={setActiveTab}
          >
            {/* Glassmorphism Tab List */}
            <div className="relative inline-block">
              {/* Glow behind tabs */}
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 via-transparent to-violet-500/10 rounded-xl blur-lg opacity-60" />
              <TabsList className="relative p-1.5 bg-zinc-900/70 backdrop-blur-xl border border-zinc-800/50 rounded-xl shadow-2xl shadow-black/20">
                <TabsTrigger
                  value="songs"
                  className="
                    relative px-6 py-2.5 rounded-lg font-medium text-sm
                    transition-all duration-300 ease-out
                    data-[state=inactive]:text-zinc-400
                    data-[state=inactive]:hover:text-zinc-200
                    data-[state=inactive]:hover:bg-zinc-800/50
                    data-[state=active]:text-white
                    data-[state=active]:bg-gradient-to-r
                    data-[state=active]:from-emerald-500/20
                    data-[state=active]:to-emerald-500/5
                    data-[state=active]:border
                    data-[state=active]:border-emerald-500/20
                    data-[state=active]:shadow-lg
                    data-[state=active]:shadow-emerald-500/5
                  "
                >
                  <Music className="mr-2 size-4" />
                  Songs
                  {activeTab === "songs" && (
                    <motion.div
                      layoutId="activeTabGlow"
                      className="absolute inset-0 rounded-lg bg-emerald-500/5"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="albums"
                  className="
                    relative px-6 py-2.5 rounded-lg font-medium text-sm
                    transition-all duration-300 ease-out
                    data-[state=inactive]:text-zinc-400
                    data-[state=inactive]:hover:text-zinc-200
                    data-[state=inactive]:hover:bg-zinc-800/50
                    data-[state=active]:text-white
                    data-[state=active]:bg-gradient-to-r
                    data-[state=active]:from-violet-500/20
                    data-[state=active]:to-violet-500/5
                    data-[state=active]:border
                    data-[state=active]:border-violet-500/20
                    data-[state=active]:shadow-lg
                    data-[state=active]:shadow-violet-500/5
                  "
                >
                  <Album className="mr-2 size-4" />
                  Albums
                  {activeTab === "albums" && (
                    <motion.div
                      layoutId="activeTabGlow"
                      className="absolute inset-0 rounded-lg bg-violet-500/5"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Content with AnimatePresence */}
            <AnimatePresence mode="wait">
              <TabsContent value="songs" key="songs">
                <motion.div
                  initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative"
                >
                  {/* Card wrapper with glassmorphism */}
                  <div className="relative rounded-2xl bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 p-6 shadow-2xl shadow-black/20">
                    {/* Top accent line */}
                    <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
                    <SongsTabContent />
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="albums" key="albums">
                <motion.div
                  initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative"
                >
                  <div className="relative rounded-2xl bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 p-6 shadow-2xl shadow-black/20">
                    {/* Top accent line */}
                    <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
                    <AlbumsTabContent />
                  </div>
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </motion.div>

        {/* Bottom decorative gradient line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
          className="mt-12 h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent"
        />
      </div>
    </div>
  );
};

export default AdminPage;