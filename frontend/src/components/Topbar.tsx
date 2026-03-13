import { SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon } from "lucide-react";
import { Link } from "react-router-dom";
import SignInOAuthButtons from "./SignInOAuthButtons";
import { useAuthStore } from "@/stores/useAuthStore";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { useMusicStore } from "@/stores/useMusicStore";
import { useState } from "react";
import { X } from "lucide-react";

const Topbar = () => {
  const [query, setQuery] = useState("");

  const { isAdmin } = useAuthStore();
  const { searchSongs } = useMusicStore();

  console.log({ isAdmin });

  return (
    <div
      className="flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75
    backdrop-blur-md z-10
    "
    >
      <div className="flex items-center gap-3 animate-logo-entry">
        <img
          src="/logo.png"
          alt="Vibely Logo"
          className="w-12 h-12 object-cover rounded-xl border-2 border-[#1d9ab9] shadow-xl"
        />

        <span
          className="text-3xl font-extrabold text-[#7B61FF] tracking-wide drop-shadow-sm"
          style={{ fontFamily: "'Trebuchet MS', sans-serif" }}
        >
          Tunex
        </span>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search songs..."
          value={query}
          className="bg-zinc-800 px-3 py-2 rounded-md text-sm w-64 outline-none"
          onChange={(e) => {
            const value = e.target.value;
            setQuery(value);
            searchSongs(value);
          }}
        />

        {query && (
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
            onClick={() => {
              setQuery("");
              searchSongs("");
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        {isAdmin && (
          <Link
            to={"/admin"}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <LayoutDashboardIcon className="size-4 mr-2" />
            Admin Dashboard
          </Link>
        )}

        <SignedOut>
          <SignInOAuthButtons />
        </SignedOut>

        <UserButton />
      </div>
    </div>
  );
};

export default Topbar;
