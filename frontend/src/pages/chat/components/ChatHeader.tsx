import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatStore } from "@/stores/useChatStore";
import { X } from "lucide-react";
import { motion } from "framer-motion";

const ChatHeader = () => {
  const { selectedUser, onlineUsers, setSelectedUser } = useChatStore();

  if (!selectedUser) {
    return null;
  }

  return (
    <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="size-10 border-2 border-white/[0.06]">
            <AvatarImage src={selectedUser.imageUrl} className="object-cover" />
            <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
          </Avatar>
          {onlineUsers.has(selectedUser.clerkId) && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0a0a12] rounded-full" />
          )}
        </div>
        <div>
          <h2 className="font-semibold text-white tracking-tight">
            {selectedUser.name}
          </h2>
          <p className="text-xs text-zinc-500 font-medium">
            {onlineUsers.has(selectedUser.clerkId)
              ? "Active now"
              : "Offline"}
          </p>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.08)" }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setSelectedUser(null)}
        className="p-2 rounded-xl text-zinc-400 hover:text-white transition-colors duration-300 pointer-events-auto"
        aria-label="Close Chat"
      >
        <X className="w-5 h-5" />
      </motion.button>
    </div>
  );
};

export default ChatHeader;
