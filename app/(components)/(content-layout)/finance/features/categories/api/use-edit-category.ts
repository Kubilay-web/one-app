import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "../../../hono";

type ResponseType = InferResponseType<typeof client.api.onefinance.categories[":id"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.onefinance.categories[":id"]["$patch"]>["json"];

export const useEditCategory = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      const response = await client.api.onefinance.categories[":id"]["$patch"]({ 
        param: { id },
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Category updated");
      queryClient.invalidateQueries({ queryKey: ["category", { id }] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Failed to edit category");
    },
  });

  return mutation;
};
