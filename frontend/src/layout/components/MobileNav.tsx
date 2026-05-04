import { Home, MessageCircle, Library as LibraryIcon, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { SignedIn } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/stores/useUIStore";
import LeftSidebar from "./LeftSidebar";

const MobileNav = () => {
  const location = useLocation();
  const { isLibraryOpen, setIsLibraryOpen, toggleLibrary } = useUIStore();

  const navItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/chat", icon: MessageCircle, label: "Messages", auth: true },
  ];

  return (
    <>
      <AnimatePresence>
        {isLibraryOpen && (
          <motion.div key="library-drawer" className="md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLibraryOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
            />
            {/* Drawer */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 h-[85vh] bg-[#0c0c14] rounded-t-[40px] z-[70] overflow-hidden border-t border-white/10 shadow-[0_-20px_40px_rgba(0,0,0,0.5)] flex flex-col"
            >
              {/* Handle bar */}
              <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mt-4 mb-2 flex-shrink-0" />

              <div className="flex items-center justify-between p-6 pt-2 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center border border-violet-500/20">
                    <LibraryIcon className="size-6 text-violet-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white tracking-tight">
                      Your Library
                    </h2>
                    <p className="text-xs text-zinc-500 font-medium">
                      Playlists & Saved Albums
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsLibraryOpen(false)}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white border border-white/5"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="flex-1 overflow-hidden">
                <LeftSidebar isMobileDrawer />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-[92%] max-w-md mx-auto md:hidden">
        <div className="relative flex items-center justify-around bg-[#161622]/90 backdrop-blur-2xl border border-white/10 rounded-[28px] px-2 py-2.5 shadow-2xl shadow-black/50">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to && !isLibraryOpen;

            const Content = (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "relative flex flex-col items-center gap-1 px-5 py-2 transition-all duration-300",
                  isActive ? "text-white" : "text-zinc-500",
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-pill"
                    className="absolute inset-0 bg-white/10 rounded-2xl border border-white/5"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <motion.div whileTap={{ scale: 0.9 }} className="relative z-10">
                  <Icon
                    className={cn(
                      "size-6 transition-transform duration-300",
                      isActive && "scale-110",
                    )}
                  />
                </motion.div>
                <span className="text-[10px] font-bold uppercase tracking-widest relative z-10">
                  {item.label}
                </span>
              </Link>
            );

            if (item.auth) {
              return <SignedIn key={item.to}>{Content}</SignedIn>;
            }

            return Content;
          })}

          <button
            onClick={toggleLibrary}
            className={cn(
              "relative flex flex-col items-center gap-1 px-5 py-2 transition-all duration-300",
              isLibraryOpen ? "text-white" : "text-zinc-500",
            )}
          >
            {isLibraryOpen && (
              <motion.div
                layoutId="mobile-nav-pill"
                className="absolute inset-0 bg-violet-500/20 rounded-2xl border border-violet-500/20"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <motion.div whileTap={{ scale: 0.9 }} className="relative z-10">
              <LibraryIcon
                className={cn(
                  "size-6 transition-transform duration-300",
                  isLibraryOpen && "scale-110",
                )}
              />
            </motion.div>
            <span className="text-[10px] font-bold uppercase tracking-widest relative z-10">
              Library
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileNav;
