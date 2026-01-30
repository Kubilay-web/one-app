import { useQuery } from "@tanstack/react-query";

import { client } from "../../../hono";

export const useGetCategories = () => {
  const query = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await client.api.onefinance.categories.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
