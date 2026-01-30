import { useQuery } from "@tanstack/react-query";

import { client } from "../../../hono";

export const useGetSubscription = () => {
  const query = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const response = await client.api.onefinance.subscriptions.current.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch subscription");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
