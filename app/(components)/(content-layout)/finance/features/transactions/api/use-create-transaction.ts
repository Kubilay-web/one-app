import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "../../../hono";

type ResponseType = InferResponseType<typeof client.api.onefinance.transactions.$post>;
type RequestType = InferRequestType<typeof client.api.onefinance.transactions.$post>["json"];

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      const response = await client.api.onefinance.transactions.$post({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Transaction created");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Failed to create transaction");
    },
  });

  return mutation;
};
