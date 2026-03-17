import { axiosInstance } from "@/lib/axios";
import { Album, Song, stats } from "@/types";
import toast from "react-hot-toast";
import { create } from "zustand";

interface MusicStore {
  songs: Song[];
  albums: Album[];
  isLoading: boolean;
  isAlbumsLoading: boolean;
  isAlbumLoading: boolean;
  isFeaturedLoading: boolean;
  isMadeForYouLoading: boolean;
  isTrendingLoading: boolean;
  isStatsLoading: boolean;
  isSongsLoading: boolean;
  isDeletingSong: boolean;
  isDeletingAlbum: boolean;
  error: string | null;
  currentAlbum: Album | null;
  featuredSongs: Song[];
  madeForYouSongs: Song[];
  trendingSongs: Song[];
  stats: stats;
  searchResults: Song[];

  fetchAlbums: () => Promise<void>;
  fetchAlbumById: (id: string) => Promise<void>;
  fetchFeaturedSongs: () => Promise<void>;
  fetchMadeForYouSongs: () => Promise<void>;
  fetchTrendingSongs: () => Promise<void>;
  fetchStats: (token: string) => Promise<void>;
  fetchSongs: () => Promise<void>;
  deleteSong: (id: string) => Promise<void>;
  deleteAlbum: (id: string) => Promise<void>;
  searchSongs: (query: string) => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set) => ({
  albums: [],
  songs: [],
  isLoading: false,
  isAlbumsLoading: false,
  isAlbumLoading: false,
  isFeaturedLoading: false,
  isMadeForYouLoading: false,
  isTrendingLoading: false,
  isStatsLoading: false,
  isSongsLoading: false,
  isDeletingSong: false,
  isDeletingAlbum: false,
  error: null,
  currentAlbum: null,
  madeForYouSongs: [],
  featuredSongs: [],
  trendingSongs: [],
  searchResults: [],
  stats: {
    totalSongs: 0,
    totalAlbums: 0,
    totalUsers: 0,
    totalArtists: 0,
  },

  deleteSong: async (id) => {
    set({ isDeletingSong: true, error: null });
    try {
      await axiosInstance.delete(`/admin/songs/${id}`);
      set((state) => ({
        songs: state.songs.filter((song) => song._id !== id),
      }));
      toast.success("Song deleted successfully");
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Error deleting song" });
      toast.error("Error deleting song");
    } finally {
      set({ isDeletingSong: false });
    }
  },

  deleteAlbum: async (id) => {
    set({ isDeletingAlbum: true, error: null });
    try {
      await axiosInstance.delete(`/admin/albums/${id}`);
      set((state) => ({
        albums: state.albums.filter((album) => album._id !== id),
        songs: state.songs.map((song) =>
          song.albumId === state.albums.find((a) => a._id === id)?.title
            ? { ...song, album: null }
            : song,
        ),
      }));
      toast.success("Album deleted successfully");
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Error deleting album" });
      toast.error("Failed to delete album: " + error.message);
    } finally {
      set({ isDeletingAlbum: false });
    }
  },
  fetchSongs: async () => {
    set({ isSongsLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs");
      set({ songs: response.data });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isSongsLoading: false });
    }
  },

  fetchStats: async (token: string) => {
    set({ isStatsLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      set({
        stats: {
          totalSongs: data.totalSongs,
          totalAlbums: data.totalAlbums,
          totalUsers: data.totalUsers,
          totalArtists: data.uniqueArtists,
        },
      });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isStatsLoading: false });
    }
  },

  fetchAlbums: async () => {
    set({ isAlbumsLoading: true, error: null });

    try {
       const response = await axiosInstance.get("/albums");
      set({ albums: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isAlbumsLoading: false });
    }
  },

  fetchAlbumById: async (id) => {
    set({ isAlbumLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/albums/${id}`);
      set({ currentAlbum: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isAlbumLoading: false });
    }
  },

  fetchFeaturedSongs: async () => {
    set({ isFeaturedLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs/featured");
      set({ featuredSongs: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isFeaturedLoading: false });
    }
  },

  fetchMadeForYouSongs: async () => {
    set({ isMadeForYouLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs/made-for-you");
      set({ madeForYouSongs: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isMadeForYouLoading: false });
    }
  },

  fetchTrendingSongs: async () => {
    set({ isTrendingLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs/trending");
      set({ trendingSongs: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isTrendingLoading: false });
    }
  },
  searchSongs: async (query: string) => {
    if (!query) return set({ searchResults: [] });
    const res = await axiosInstance.get(`/songs/search?q=${query}`);
    set({ searchResults: res.data });
  },
}));
