import { useMusicStore } from "@/stores/useMusicStore";
import { Library, ListMusic, PlayCircle, Users2, BarChart3 } from "lucide-react";
import StatsCard from "./StatsCard";
import { useEffect } from "react";
import { motion } from "framer-motion";

const DashboardStats = () => {
  const { stats } = useMusicStore();

  useEffect(() => {
    console.log("📊 stats kya aa raha hai:", stats);
  }, [stats]);

  const statsData = [
    {
      icon: ListMusic,
      label: "Total Songs",
      value: stats?.totalSongs?.toString() ?? "0",
      bgColor: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
    },
    {
      icon: Library,
      label: "Total Albums",
      value: stats?.totalAlbums?.toString() ?? "0",
      bgColor: "bg-violet-500/10",
      iconColor: "text-violet-500",
    },
    {
      icon: Users2,
      label: "Total Artists",
      value: stats?.totalArtists?.toString() ?? "0",
      bgColor: "bg-orange-500/10",
      iconColor: "text-orange-500",
    },
    {
      icon: PlayCircle,
      label: "Total Users",
      value: stats?.totalUsers?.toLocaleString() ?? "0",
      bgColor: "bg-sky-500/10",
      iconColor: "text-sky-500",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mb-10"
    >
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-3 mb-6"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500/20 rounded-lg blur-md" />
          <div className="relative p-2 bg-emerald-500/10 rounded-lg ring-1 ring-emerald-500/20">
            <BarChart3 className="size-5 text-emerald-400" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-sm text-zinc-500 font-medium">
            Real-time platform statistics
          </p>
        </div>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex-1 h-px bg-gradient-to-r from-zinc-800 via-zinc-700/50 to-transparent ml-4 origin-left"
        />
      </motion.div>

      {/* Stats Grid */}
      <div className="relative">
        {/* Background glow behind the grid */}
        <div className="absolute inset-0 -m-4">
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-60 h-60 bg-emerald-500/5 rounded-full blur-[80px]" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-60 h-60 bg-violet-500/5 rounded-full blur-[80px]" />
        </div>

        {/* Grid */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsData.map((stat, i) => (
            <StatsCard
              key={stat.label}
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              bgColor={stat.bgColor}
              iconColor={stat.iconColor}
              index={i}
            />
          ))}
        </div>
      </div>

      {/* Bottom summary bar */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mt-4 flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/40"
      >
        <div className="flex items-center gap-2">
          <span className="relative flex size-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full size-2 bg-emerald-500" />
          </span>
          <span className="text-xs font-medium text-zinc-500">
            Live data · Auto-refreshing
          </span>
        </div>
        <div className="flex items-center gap-4">
          {statsData.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + i * 0.1, type: "spring", stiffness: 300 }}
              className="hidden sm:flex items-center gap-1.5"
            >
              <div className={`size-1.5 rounded-full ${stat.bgColor.replace("/10", "/60")}`} />
              <span className="text-xs text-zinc-500 font-medium">{stat.value}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardStats;