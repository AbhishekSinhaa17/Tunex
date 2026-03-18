import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import MainLayout from "./layout/MainLayout";
import ChatPage from "./pages/chat/ChatPage";
import AlbumPage from "./pages/album/AlbumPage";
import AdminPage from "./pages/admin/AdminPage";
import { Toaster } from "react-hot-toast";
import NotFoundPage from "./pages/404/NotFoundPage";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

function App() {
  const { isAdmin } = useAuthStore();
  return (
    <>
      <Routes>
        <Route
          path="/auth-callback"
          element={
            <AuthenticateWithRedirectCallback
              afterSignInUrl="/"
              afterSignUpUrl="/"
            />
          }
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
      <Toaster />
    </>
  );
}

export default App;
