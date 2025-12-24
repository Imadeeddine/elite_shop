
import { useAppState } from '../context/AppContext';

export const useAuth = () => {
  const { user, setUser, users, setUsers } = useAppState();

  const isAuthenticated = !!user;

  return {
    user,
    isAuthenticated,
    setUser
  };
};
