import Topbar from "@/components/Topbar";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect } from "react";
import FeaturedSection from "./components/FeaturedSection";
import SectionGrid from "./components/SectionGrid";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { usePlayerStore } from "@/stores/usePlayerStore";

const HomePage = () => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const {
    fetchFeaturedSongs,
    fetchMadeForYouSongs,
    fetchTrendingSongs,
    isLoading,
    madeForYouSongs,
    featuredSongs,
    trendingSongs,
    searchResults,
  } = useMusicStore();

  const { recentSongs } = usePlayerStore();

  const { initializeQueue } = usePlayerStore();

  useEffect(() => {
    fetchFeaturedSongs();
    fetchMadeForYouSongs();
    fetchTrendingSongs();
  }, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs]);

  useEffect(() => {
    if (
      madeForYouSongs.length > 0 &&
      featuredSongs.length > 0 &&
      trendingSongs.length > 0
    ) {
      const allSongs = [...featuredSongs, ...madeForYouSongs, ...trendingSongs];
      initializeQueue(allSongs);
    }
  }, [initializeQueue, madeForYouSongs, trendingSongs, featuredSongs]);

  return (
    <main className="h-full flex flex-col bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-md overflow-hidden">
      <Topbar />
      <ScrollArea.Root className="h-[calc(100vh-180px)] w-full overflow-hidden">
        <ScrollArea.Viewport className="h-full w-full min-h-full">
          <div className="p-4 sm:p-6 ">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6">
              {getGreeting()}
            </h1>
            {searchResults.length > 0 && (
              <SectionGrid
                title="Search Results"
                songs={searchResults}
                isLoading={false}
              />
            )}
            {recentSongs.length > 0 && (
              <SectionGrid
                title="Recently Played"
                songs={recentSongs}
                isLoading={false}
              />
            )}

            {recentSongs.length === 0 && <FeaturedSection />}

            <div className="space-y-8">
              <SectionGrid
                title="Made For You"
                songs={madeForYouSongs}
                isLoading={isLoading}
              />
              <SectionGrid
                title="Trending"
                songs={trendingSongs}
                isLoading={isLoading}
              />
            </div>
          </div>
        </ScrollArea.Viewport>

        <ScrollArea.Scrollbar
          orientation="vertical"
          className="w-2 bg-zinc-700 rounded"
        >
          <ScrollArea.Thumb className="bg-zinc-500 rounded" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </main>
  );
};

export default HomePage;
