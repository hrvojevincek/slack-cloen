import { api } from "../../../../convex/_generated/api";
import { useQuery } from "convex/react";

const useCurrentUser = () => {
  const data = useQuery(api.users.currentUser);
  const isLoading = data === undefined;

  return { data, isLoading };
};

export default useCurrentUser;
 