import { Home, MessageCircle, Library as LibraryIcon, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { SignedIn } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/stores/useUIStore";
import LeftSidebar from "./LeftSidebar";

const MobileNav = () => {
	const location = useLocation();
	const { isLibraryOpen, setIsLibraryOpen, toggleLibrary } = useUIStore();

	// No automatic closing here anymore to allow "Back to Library" behavior
	/*
	useEffect(() => {
		setIsLibraryOpen(false);
	}, [location.pathname, setIsLibraryOpen]);
	*/

	const navItems = [
		{ to: "/", icon: Home, label: "Home" },
		{ to: "/chat", icon: MessageCircle, label: "Messages", auth: true },
	];

	return (
		<>
			<AnimatePresence>
				{isLibraryOpen && (
					<>
						{/* Backdrop */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setIsLibraryOpen(false)}
							className='fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden'
						/>
						{/* Drawer */}
						<motion.div
							initial={{ y: "100%" }}
							animate={{ y: 0 }}
							exit={{ y: "100%" }}
							transition={{ type: "spring", damping: 25, stiffness: 200 }}
							className='fixed bottom-0 left-0 right-0 h-[80vh] bg-[#08080e] rounded-t-[32px] z-[70] md:hidden overflow-hidden border-t border-white/5 shadow-2xl flex flex-col'
						>
							<div className='flex items-center justify-between p-6 border-b border-white/5'>
								<div className='flex items-center gap-3'>
									<div className='w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center'>
										<LibraryIcon className='size-5 text-violet-400' />
									</div>
									<div>
										<h2 className='text-lg font-bold text-white'>Your Library</h2>
										<p className='text-xs text-zinc-500'>All your playlists and albums</p>
									</div>
								</div>
								<button
									onClick={() => setIsLibraryOpen(false)}
									className='w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white'
								>
									<X className='size-5' />
								</button>
							</div>

							<div className='flex-1 overflow-hidden p-2'>
								<LeftSidebar isMobileDrawer />
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>

			<div className='fixed bottom-0 left-0 right-0 bg-zinc-900/90 backdrop-blur-lg border-t border-white/5 px-6 py-3 flex justify-around items-center z-[50] md:hidden'>
				{navItems.map((item) => {
					const Icon = item.icon;
					const isActive = location.pathname === item.to && !isLibraryOpen;

					const Content = (
						<Link
							key={item.to}
							to={item.to}
							className={cn(
								"flex flex-col items-center gap-1 transition-colors",
								isActive ? "text-white" : "text-zinc-400"
							)}
						>
							<Icon className='size-6' />
							<span className='text-[10px] font-medium'>{item.label}</span>
						</Link>
					);

					if (item.auth) {
						return (
							<SignedIn key={item.to}>
								{Content}
							</SignedIn>
						);
					}

					return Content;
				})}

				<button
					onClick={toggleLibrary}
					className={cn(
						"flex flex-col items-center gap-1 transition-colors",
						isLibraryOpen ? "text-white" : "text-zinc-400"
					)}
				>
					<LibraryIcon className='size-6' />
					<span className='text-[10px] font-medium'>Library</span>
				</button>
			</div>
		</>
	);
};

export default MobileNav;
