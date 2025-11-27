import { UserApiService } from "@/services";

import { useQuery } from "@tanstack/react-query";

export const useGetUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: UserApiService.getUser,
  });
};
