import { useCallback, useState } from "react";
import UserContext from "./UserContext";
import { api, AUTH } from "../services/api";

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const { data } = await api.get(AUTH.PROFILE);
      if (data?.success) {
        setUser(data.user);
        setAuthenticated(true);
      } else {
        setUser(null);
        setAuthenticated(false);
      }
    } catch {
      setUser(null);
      setAuthenticated(false);
    } finally {
      setCheckingAuth(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post(AUTH.LOGOUT);
    } catch {
      // ignore — clearing client state is what matters
    }
    setUser(null);
    setAuthenticated(false);
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        authenticated,
        checkingAuth,
        checkAuth,
        setUser: (u) => {
          setUser(u);
          setAuthenticated(!!u);
        },
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
