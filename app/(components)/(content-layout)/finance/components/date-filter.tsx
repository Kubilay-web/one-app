"use client";

import { useState } from "react";
import { format, subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { ChevronDown } from "lucide-react";
import qs from "query-string";
import { 
  useRouter,
  usePathname,
  useSearchParams
} from "next/navigation";

import { useGetSummary } from "../features/summary/api/use-get-summary";
import { formatDateRange } from "../utils";
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "../components/ui/popover";

export const DateFilter = () => {
  const router = useRouter();
  const pathname = usePathname();

  const params = useSearchParams();
  const accountId = params.get("accountId");
  const from = params.get("from") || "";
  const to = params.get("to") || "";

  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  const paramState = {
    from: from ? new Date(from) : defaultFrom,
    to: to ? new Date(to) : defaultTo,
  };

  const [date, setDate] = useState<DateRange | undefined>(paramState);

  const pushToUrl = (dateRange: DateRange | undefined) => {
    const query = {
      from: format(dateRange?.from || defaultFrom, "yyyy-MM-dd"),
      to: format(dateRange?.to || defaultTo, "yyyy-MM-dd"),
      accountId,
    };

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query,
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  };

  const onReset = () => {
    setDate(undefined);
    pushToUrl(undefined);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="
            lg:w-auto w-full h-9 rounded-md px-3 font-normal
            bg-white text-black
            border border-gray-300
            hover:bg-gray-100
            focus:outline-none focus:ring-1 focus:ring-gray-300
            transition
          "
        >
          <span>{formatDateRange(paramState)}</span>
          <ChevronDown className="ml-2 size-4 text-gray-500" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="
          lg:w-auto w-full p-0
          bg-white text-black
          border border-gray-200
          shadow-md
        "
      >
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
          className="bg-white text-black"
        />

        <div className="p-4 w-full flex items-center gap-x-2 border-t border-gray-200">
          <PopoverClose asChild>
            <Button
              onClick={onReset}
              disabled={!date?.from || !date?.to}
              variant="outline"
              className="w-full text-black border-gray-300 hover:bg-gray-100"
            >
              Reset
            </Button>
          </PopoverClose>

          <PopoverClose asChild>
            <Button
              onClick={() => pushToUrl(date)}
              disabled={!date?.from || !date?.to}
              className="w-full bg-black text-white hover:bg-gray-800"
            >
              Apply
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
};
