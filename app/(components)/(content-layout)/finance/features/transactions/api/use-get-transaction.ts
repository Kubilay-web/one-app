import { useQuery } from "@tanstack/react-query";

import { client } from "../../../hono";
import { convertAmountFromMiliunits } from "../../../utils";

export const useGetTransaction = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["transaction", { id }],
    queryFn: async () => {
      const response = await client.api.onefinance.transactions[":id"].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transaction");
      }

      const { data } = await response.json();
      return {
        ...data,
        amount: convertAmountFromMiliunits(data.amount),
      };
    },
  });

  return query;
};
