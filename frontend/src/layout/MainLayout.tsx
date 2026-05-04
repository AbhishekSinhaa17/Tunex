import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./components/LeftSidebar";
import FriendsActivity from "./components/FriendsActivity";
import AudioPlayer from "./components/AudioPlayer";
import { PlaybackControls } from "./components/PlaybackControls";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useChatStore } from "@/stores/useChatStore";

import MobileNav from "./components/MobileNav";

const MainLayout = () => {
	const [isMobile, setIsMobile] = useState(false);
	const { user } = useUser();
	const initSocket = useChatStore((state) => state.initSocket);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	useEffect(() => {
		if (user?.id) {
			initSocket(user.id); // ✅ Send Clerk userId to backend socket
		}
	}, [user?.id, initSocket]);

	return (
		<div className='h-screen bg-black text-white flex flex-col overflow-hidden'>
			<div className='flex-1 flex overflow-hidden p-2 relative z-10'>
				<AudioPlayer />

				{isMobile ? (
					<main className='w-full h-[calc(100vh-220px)] overflow-hidden rounded-lg flex flex-col'>
						<Outlet />
					</main>
				) : (
					<ResizablePanelGroup direction='horizontal' className='flex-1 flex h-full overflow-hidden'>
						{/* left sidebar */}
						<ResizablePanel defaultSize={20} minSize={10} maxSize={30}>
							<LeftSidebar />
						</ResizablePanel>

						<ResizableHandle className='w-2 bg-black rounded-lg transition-colors' />

						{/* main content */}
						<ResizablePanel defaultSize={60}>
							<Outlet />
						</ResizablePanel>

						<>
							<ResizableHandle className='w-2 bg-black rounded-lg transition-colors' />
							<ResizablePanel defaultSize={20} minSize={0} maxSize={25} collapsedSize={0}>
								<FriendsActivity />
							</ResizablePanel>
						</>
					</ResizablePanelGroup>
				)}
			</div>

			<div className='fixed bottom-0 left-0 right-0 z-50 flex flex-col pointer-events-none'>
				<div className="pointer-events-auto w-full">
					<PlaybackControls />
				</div>
				<div className="pointer-events-auto w-full pb-6 sm:pb-0">
					<MobileNav />
				</div>
			</div>
		</div>
	);
};

export default MainLayout;
