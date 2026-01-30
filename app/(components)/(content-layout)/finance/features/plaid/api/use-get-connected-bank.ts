import { useQuery } from "@tanstack/react-query";

import { client } from "../../../hono";

export const useGetConnectedBank = () => {
  const query = useQuery({
    queryKey: ["connected-bank"],
    queryFn: async () => {
      const response = await client.api.onefinance.plaid["connected-bank"].$get();

      if (!response.ok) {
        throw new Error("Failed to fetch connected bank");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
