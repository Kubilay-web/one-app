import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "../../../hono";

type ResponseType = InferResponseType<typeof client.api.onefinance.transactions["bulk-delete"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.onefinance.transactions["bulk-delete"]["$post"]>["json"];

export const useBulkDeleteTransactions = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      const response = await client.api.onefinance.transactions["bulk-delete"]["$post"]({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Transactions deleted");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Failed to delete transactions");
    },
  });

  return mutation;
};
