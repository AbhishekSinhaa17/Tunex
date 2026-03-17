import Topbar from "@/components/Topbar";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useRef, useState } from "react";
import UsersList from "./components/UsersList";
import ChatHeader from "./components/ChatHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import MessageInput from "./components/MessageInput";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Sparkles, Music2, Send } from "lucide-react";

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// ═══════════════════════════════════════════════════════════════
// ─── MESSAGE BUBBLE ───────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const MessageBubble = ({
  message,
  isCurrentUser,
  userImage,
  selectedUserImage,
  index,
}: {
  message: any;
  isCurrentUser: boolean;
  userImage: string;
  selectedUserImage: string;
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: Math.min(index * 0.03, 0.5), // Cap delay for old messages
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`flex items-end gap-2.5 ${isCurrentUser ? "flex-row-reverse" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Avatar */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="relative flex-shrink-0"
      >
        <Avatar className="size-8 border-2 border-white/[0.06]">
          <AvatarImage
            src={isCurrentUser ? userImage : selectedUserImage}
            className="object-cover"
          />
        </Avatar>

        {/* Online dot */}
        {!isCurrentUser && (
          <div className="absolute -bottom-0.5 -right-0.5">
            <div className="relative">
              <motion.div
                className="absolute inset-0 rounded-full bg-emerald-400"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.6, 0, 0.6],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="relative h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-[#0a0a12]" />
            </div>
          </div>
        )}
      </motion.div>

      {/* Message bubble */}
      <div className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"} max-w-[70%]`}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="relative group"
        >
          {/* Bubble glow */}
          <motion.div
            className={`absolute -inset-1 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
              isCurrentUser
                ? "bg-gradient-to-br from-violet-500/20 to-cyan-500/20"
                : "bg-white/[0.03]"
            }`}
          />

          <div
            className={`relative rounded-2xl p-3.5 shadow-lg transition-all duration-300 ${
              isCurrentUser
                ? "bg-gradient-to-br from-violet-500 to-cyan-500 text-white"
                : "bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] text-zinc-200"
            }`}
          >
            <p className="text-sm leading-relaxed break-words">
              {message.content}
            </p>

            {/* Shimmer effect on own messages */}
            {isCurrentUser && (
              <motion.div
                className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 0.15 : 0 }}
              >
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
                  }}
                  animate={{ x: ["-200%", "200%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                />
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Timestamp */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className={`text-[10px] text-zinc-600 mt-1 px-1 font-medium ${
            isCurrentUser ? "text-right" : ""
          }`}
        >
          {formatTime(message.createdAt)}
        </motion.span>
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════
// ─── TYPING INDICATOR ─────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 10 }}
    className="flex items-center gap-2.5 mb-4"
  >
    <Avatar className="size-8 border-2 border-white/[0.06]">
      <div className="w-full h-full bg-gradient-to-br from-violet-600/30 to-cyan-600/30" />
    </Avatar>

    <div className="bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] rounded-2xl px-4 py-3">
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-zinc-500"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════
// ─── DATE DIVIDER ─────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const DateDivider = ({ date }: { date: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex items-center gap-3 my-6"
  >
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
    <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06]">
      {date}
    </span>
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════
// ─── NO CONVERSATION PLACEHOLDER ──────────────────────────────
// ═══════════════════════════════════════════════════════════════
const NoConversationPlaceholder = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="flex flex-col items-center justify-center h-full px-6"
  >
    <div className="relative mb-6">
      <motion.div
        className="absolute -inset-4 rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.15), rgba(6,182,212,0.1), transparent)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <motion.div
        className="relative w-24 h-24 rounded-3xl flex items-center justify-center
                   bg-gradient-to-br from-violet-500/10 to-cyan-500/10
                   border border-white/[0.08] backdrop-blur-sm"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <MessageCircle className="w-10 h-10 text-violet-400" />

        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute"
            animate={{
              x: [0, Math.cos(i * 120) * 30, 0],
              y: [0, Math.sin(i * 120) * 30, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.7,
            }}
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
          </motion.div>
        ))}
      </motion.div>
    </div>

    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-center space-y-2 max-w-sm"
    >
      <h3 className="text-lg font-bold text-white tracking-tight">
        No conversation selected
      </h3>
      <p className="text-sm text-zinc-500 leading-relaxed">
        Choose a friend from the list to start chatting and sharing your favorite music
      </p>
    </motion.div>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="flex items-center gap-3 mt-8"
    >
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
        <Music2 className="w-3 h-3 text-violet-400" />
        <span className="text-[10px] font-medium text-zinc-600">Share tracks</span>
      </div>
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
        <Send className="w-3 h-3 text-cyan-400" />
        <span className="text-[10px] font-medium text-zinc-600">Send messages</span>
      </div>
    </motion.div>
  </motion.div>
);


// ═══════════════════════════════════════════════════════════════
// ─── CHAT PAGE ────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const ChatPage = () => {
  const { user } = useUser();
  const { messages, selectedUser, fetchUsers, fetchMessages } =
    useChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showTyping] = useState(false);

  useEffect(() => {
    if (user) fetchUsers();
  }, [user, fetchUsers]);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.clerkId);
    }
  }, [selectedUser, fetchMessages]);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Group messages by date
  const groupedMessages = messages.reduce(
    (groups: { [key: string]: any[] }, message) => {
      const date = new Date(message.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    },
    {}
  );



  return (
    <main
      className="h-full rounded-xl overflow-hidden relative"
      style={{
        background:
          "linear-gradient(180deg, rgba(12,10,26,0.95) 0%, rgba(8,8,14,0.98) 100%)",
      }}
    >
      {/* Subtle border */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none z-0"
        style={{ border: "1px solid rgba(255,255,255,0.04)" }}
      />

      {/* Ambient background */}
      <div
        className="absolute top-0 left-0 right-0 h-40 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(139,92,246,0.04) 0%, transparent 100%)",
        }}
      />

      <div className="relative z-10">
        <Topbar />
      </div>

      <div className="h-[calc(100vh-180px)] relative z-10 flex flex-col">
        {/* Mobile: Toggle between list and chat */}
        <div className="lg:hidden h-full flex flex-col">
          {selectedUser ? (
            // Chat view
            <div className="flex flex-col h-full">
              {/* Header with back button */}
              <div className="flex-shrink-0">
                <ChatHeader />
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-hidden relative">
                <ScrollArea className="h-full">
                  <div className="p-4 space-y-4">
                    {Object.entries(groupedMessages).map(([date, msgs]) => (
                      <div key={date}>
                        <DateDivider date={date} />
                        <div className="space-y-3">
                          {msgs.map((message: any, index: number) => (
                            <MessageBubble
                              key={message._id}
                              message={message}
                              isCurrentUser={message.senderId === user?.id}
                              userImage={user?.imageUrl || ""}
                              selectedUserImage={selectedUser.imageUrl}
                              index={index}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                    <AnimatePresence>
                      {showTyping && <TypingIndicator />}
                    </AnimatePresence>
                    {/* Ensure this ref is at the very vertical bottom of the content */}
                    <div ref={scrollRef} className="h-4" />
                  </div>
                </ScrollArea>
              </div>

              {/* Message input */}
              <div className="flex-shrink-0">
                <MessageInput />
              </div>
            </div>
          ) : (
            // Users list view
            <UsersList />
          )}
        </div>

        {/* Desktop: Side by side */}
        <div className="hidden lg:grid lg:grid-cols-[300px_1fr] h-full overflow-hidden">
          <UsersList />

          <div className="flex flex-col h-full border-l border-white/[0.04] overflow-hidden">
            {selectedUser ? (
              <>
                <div className="flex-shrink-0">
                  <ChatHeader />
                </div>

                <div className="flex-1 overflow-hidden relative">
                  <ScrollArea className="h-full">
                    <div className="p-4 space-y-4">
                      {Object.entries(groupedMessages).map(([date, msgs]) => (
                        <div key={date}>
                          <DateDivider date={date} />
                          <div className="space-y-3">
                            {msgs.map((message: any, index: number) => (
                              <MessageBubble
                                key={message._id}
                                message={message}
                                isCurrentUser={message.senderId === user?.id}
                                userImage={user?.imageUrl || ""}
                                selectedUserImage={selectedUser.imageUrl}
                                index={index}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                      <AnimatePresence>
                        {showTyping && <TypingIndicator />}
                      </AnimatePresence>
                      <div ref={scrollRef} className="h-4" />
                    </div>
                  </ScrollArea>
                </div>

                <div className="flex-shrink-0">
                  <MessageInput />
                </div>
              </>
            ) : (
              <NoConversationPlaceholder />
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ChatPage;