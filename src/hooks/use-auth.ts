import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export const useAuth = () => {
  const user = useQuery(api.users.currentUser);
  return {
    isAuthenticated: !!user,
    isLoading: user === undefined,
    user,
  };
};
