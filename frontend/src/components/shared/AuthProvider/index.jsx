import {
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import api from "../../../api/api";
import { AuthContext } from "./useAuth";


function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const refreshOnMount = async () => {
      try {
        const response = await api.post("/auth/refresh");
        setAccessToken(() => response.data.accessToken);
      } catch {
        setAccessToken(() => null);
      } finally {
        setLoading(() => false);
      }
    };
    setLoading(() => true);
    refreshOnMount();
  }, []);

  useLayoutEffect(() => {
    const requestInterceptor = api.interceptors.request.use((config) => {
      if (!config._retry && accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    });

    return () => {
      api.interceptors.request.eject(requestInterceptor);
    };
  }, [accessToken]);

  useLayoutEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response.status === 401 &&
          error.response.data.message === "Access token expired!"
        ) {
          try {
            const res = await api.post("/auth/refresh");
            setAccessToken(() => res.data.accessToken);
            originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
            originalRequest._retry = true;
            return api(originalRequest);
          } catch {
            setAccessToken(() => null);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!accessToken) {
        setUser(() => null);
        return;
      }

      try {
        setLoading(() => true);
        const res = await api.get("/user/me");
        setUser(() => res.data.user);
      } catch (err) {
        console.error(err);
        setUser(() => null);
      } finally {
        setLoading(() => false);
      }
    };

    fetchUser();
  }, [accessToken]);



  const logout = async () => {
    setLoading(() => true);
    try {
      await api.post("/auth/logout");
      setAccessToken(() => null);
      setUser(() => null);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(() => false);
    }
  }

  if (loading) {
    return (
      <h1>Loading...</h1>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        user,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
