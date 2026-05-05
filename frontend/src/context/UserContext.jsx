import { createContext } from "react";

const UserContext = createContext({
  user: null,
  authenticated: false,
  checkingAuth: true,
  checkAuth: () => {},
  setUser: () => {},
  logout: () => {},
});

export default UserContext;
