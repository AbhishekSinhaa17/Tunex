import { Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import MainLayout from "./layout/MainLayout";
import { Toaster } from "react-hot-toast";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { Loader } from "lucide-react";

// Lazy load pages
const HomePage = lazy(() => import("./pages/home/HomePage"));
const ChatPage = lazy(() => import("./pages/chat/ChatPage"));
const AlbumPage = lazy(() => import("./pages/album/AlbumPage"));
const AdminPage = lazy(() => import("./pages/admin/AdminPage"));
const NotFoundPage = lazy(() => import("./pages/404/NotFoundPage"));

const LoadingSpinner = () => (
  <div className="h-screen w-full flex items-center justify-center">
    <Loader className="size-8 text-emerald-500 animate-spin" />
  </div>
);

function App() {
  const { isAdmin } = useAuthStore();
  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route
            path="/auth-callback"
            element={<AuthenticateWithRedirectCallback />}
          />

          <Route
            path="/admin"
            element={isAdmin ? <AdminPage /> : <Navigate to="/" />}
          />

          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/albums/:albumId" element={<AlbumPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
      <Toaster />
    </>
  );
}

export default App;
