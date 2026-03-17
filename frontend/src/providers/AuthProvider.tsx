import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const updateApiToken = (token: string | null) => {
  if (token)
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete axiosInstance.defaults.headers.common["Authorization"];
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const { user, isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const { checkAdminStatus } = useAuthStore();
  const { initSocket, disconnectSocket } = useChatStore();

  useEffect(() => {
    if (!isLoaded) return;

    if (location.pathname === "/auth-callback") {
      setLoading(false);
      return;
    }

    setLoading(true);

    const initAuth = async () => {
      try {
        if (isSignedIn) {
          const token = await getToken();
          updateApiToken(token);

          await checkAdminStatus();

          if (user?.id) initSocket(user.id);
        } else {
          updateApiToken(null);
        }
      } catch (error) {
        updateApiToken(null);
        console.log("Error in auth provider", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    return () => disconnectSocket();
  }, [isLoaded, isSignedIn, user?.id]);

  if (location.pathname === "/auth-callback") {
    return <>{children}</>;
  }

  if (!isLoaded || loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader className="size-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
};
export default AuthProvider;
