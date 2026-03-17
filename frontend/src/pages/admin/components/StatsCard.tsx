import { Card, CardContent } from "@/components/ui/card";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRef } from "react";

type StatsCardProps = {
  icon: React.ElementType;
  label: string;
  value: string;
  bgColor: string;
  iconColor: string;
  index?: number;
};

const StatsCard = ({
  bgColor,
  icon: Icon,
  iconColor,
  label,
  value,
  index = 0,
}: StatsCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Extract the accent color from bgColor for dynamic glow
  const glowColor = bgColor.includes("emerald")
    ? "emerald"
    : bgColor.includes("violet")
    ? "violet"
    : bgColor.includes("orange")
    ? "orange"
    : bgColor.includes("sky")
    ? "sky"
    : bgColor.includes("blue")
    ? "blue"
    : bgColor.includes("rose")
    ? "rose"
    : bgColor.includes("pink")
    ? "pink"
    : bgColor.includes("yellow")
    ? "yellow"
    : "emerald";

  const glowMap: Record<string, string> = {
    emerald: "from-emerald-500/20 via-emerald-500/5 to-transparent shadow-emerald-500/10",
    violet: "from-violet-500/20 via-violet-500/5 to-transparent shadow-violet-500/10",
    orange: "from-orange-500/20 via-orange-500/5 to-transparent shadow-orange-500/10",
    sky: "from-sky-500/20 via-sky-500/5 to-transparent shadow-sky-500/10",
    blue: "from-blue-500/20 via-blue-500/5 to-transparent shadow-blue-500/10",
    rose: "from-rose-500/20 via-rose-500/5 to-transparent shadow-rose-500/10",
    pink: "from-pink-500/20 via-pink-500/5 to-transparent shadow-pink-500/10",
    yellow: "from-yellow-500/20 via-yellow-500/5 to-transparent shadow-yellow-500/10",
  };

  const accentLineMap: Record<string, string> = {
    emerald: "via-emerald-500/50",
    violet: "via-violet-500/50",
    orange: "via-orange-500/50",
    sky: "via-sky-500/50",
    blue: "via-blue-500/50",
    rose: "via-rose-500/50",
    pink: "via-pink-500/50",
    yellow: "via-yellow-500/50",
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 800,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative"
    >
      {/* Outer glow on hover */}
      <div
        className={`
          absolute -inset-[1px] rounded-xl bg-gradient-to-b ${glowMap[glowColor]}
          opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700
        `}
      />

      {/* Border gradient */}
      <div
        className={`
          absolute -inset-[1px] rounded-xl bg-gradient-to-b ${glowMap[glowColor]}
          opacity-0 group-hover:opacity-60 transition-opacity duration-500
        `}
      />

      <Card
        className="
          relative overflow-hidden
          bg-zinc-900/60 backdrop-blur-xl
          border border-zinc-800/60
          group-hover:border-zinc-700/60
          rounded-xl
          shadow-lg shadow-black/20
          group-hover:shadow-2xl group-hover:shadow-black/30
          transition-all duration-500 ease-out
        "
      >
        {/* Top accent line */}
        <div
          className={`
            absolute top-0 left-4 right-4 h-[1px]
            bg-gradient-to-r from-transparent ${accentLineMap[glowColor]} to-transparent
            opacity-0 group-hover:opacity-100 transition-opacity duration-500
          `}
        />

        {/* Shimmer effect on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.03) 55%, transparent 60%)",
            backgroundSize: "200% 100%",
          }}
          animate={{
            backgroundPosition: ["200% 0", "-200% 0"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 1,
            ease: "easeInOut",
          }}
        />

        <CardContent className="relative p-6">
          <div className="flex items-center gap-4">
            {/* Animated icon container */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="relative"
            >
              {/* Icon background glow */}
              <div
                className={`
                  absolute inset-0 rounded-xl ${bgColor}
                  blur-lg opacity-40 group-hover:opacity-70
                  transition-opacity duration-500
                `}
              />
              <div
                className={`
                  relative p-3.5 rounded-xl ${bgColor}
                  ring-1 ring-white/5
                  group-hover:ring-white/10
                  transition-all duration-500
                `}
              >
                <Icon className={`size-6 ${iconColor} drop-shadow-sm`} />
              </div>
            </motion.div>

            {/* Text content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors duration-300 tracking-wide">
                {label}
              </p>
              <motion.p
                className="text-2xl font-bold text-white mt-0.5 tracking-tight"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
              >
                {value}
              </motion.p>
            </div>

            {/* Decorative corner element */}
            <div
              className={`
                absolute top-3 right-3 size-2 rounded-full ${bgColor}
                opacity-40 group-hover:opacity-80
                transition-opacity duration-500
              `}
            />
          </div>

          {/* Bottom subtle gradient bar */}
          <div className="mt-4 pt-3 border-t border-zinc-800/50">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 rounded-full bg-zinc-800/80 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${bgColor}`}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 1.2,
                    delay: index * 0.15 + 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatsCard;