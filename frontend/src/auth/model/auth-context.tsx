import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  signIn,
  signOut,
  type SignInPayload,
} from "../api/auth.api";
import { authStorage } from "./auth-storage";
import { AuthContext } from "./auth-context-instance";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(authStorage.getToken());
  const [user, setUser] = useState(authStorage.getUser());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if ((token && !user) || (!token && user)) {
      authStorage.clear();
      setToken(null);
      setUser(null);
    }
  }, [token, user]);

  const login = useCallback(async (payload: SignInPayload) => {
    setIsLoading(true);
    try {
      const authResult = await signIn(payload);
      setToken(authResult.token);
      setUser(authResult.user);
      authStorage.setToken(authResult.token);
      authStorage.setUser(authResult.user);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    if (token) {
      await signOut(token).catch(() => undefined);
    }

    authStorage.clear();
    setToken(null);
    setUser(null);
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isLoading,
      login,
      logout,
    }),
    [token, user, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
