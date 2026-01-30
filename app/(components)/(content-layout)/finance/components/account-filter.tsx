"use client";

import qs from "query-string";
import { 
  useRouter,
  usePathname,
  useSearchParams
} from "next/navigation";

import { useGetSummary } from "../features/summary/api/use-get-summary";
import { useGetAccounts } from "../features/accounts/api/use-get-accounts";

import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from "../components/ui/select";

export const AccountFilter = () => {
  const router = useRouter();
  const pathname = usePathname();

  const params = useSearchParams();
  const accountId = params.get("accountId") || "all";
  const from = params.get("from") || "";
  const to = params.get("to") || "";

  const { isLoading: isLoadingSummary } = useGetSummary();
  const { 
    data: accounts,
    isLoading: isLoadingAccounts,
  } = useGetAccounts();

  const onChange = (newValue: string) => {
    const query: Record<string, string> = {
      accountId: newValue,
      from,
      to,
    };

    if (newValue === "all") {
      query.accountId = "";
    }

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query,
      },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(url);
  };

  return (
    <Select
      value={accountId}
      onValueChange={onChange}
      disabled={isLoadingAccounts || isLoadingSummary}
    >
      <SelectTrigger
        className="
          lg:w-auto w-full h-9 rounded-md px-3 font-normal
          bg-white text-black
          border border-gray-300
          hover:bg-gray-100
          focus:ring-1 focus:ring-gray-300
          focus:outline-none
          transition
        "
      >
        <SelectValue placeholder="Select account" />
      </SelectTrigger>

      <SelectContent className="bg-white text-black border border-gray-200">
        <SelectItem value="all" className="cursor-pointer">
          All accounts
        </SelectItem>

        {accounts?.map((account) => (
          <SelectItem
            key={account.id}
            value={account.id}
            className="cursor-pointer"
          >
            {account.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
