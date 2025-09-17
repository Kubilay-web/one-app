"use client";

import { Card, CardContent } from "../components/ui/card";
import TabHeader from "./components/tab-header";
import { Separator } from "../components/ui/separator";
import TabPanel from "./components/tab-panel";
import useMeetingFilter from "../hooks/use-meeting-filter";
import PageTitle from "../components/PageTitle";
import { getUserMeetingsQueryFn } from "../lib/api";
import { ErrorAlert } from "../components/ErrorAlert";
import { Loader } from "../components/loader";
import { useEffect, useState } from "react";

const Meetings = () => {
  const { period } = useMeetingFilter();

  const [meetings, setMeetings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getUserMeetingsQueryFn(period)
      .then((res) => {
        setMeetings(res?.meetings || []);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [period]);

  return (
    <div className="flex flex-col !gap-3">
      <PageTitle title="Meetings" />

      <ErrorAlert isError={!!error} error={error} />

      {loading || error ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <Loader size="lg" color="black" />
        </div>
      ) : (
        <div className="w-full">
          <Card className="p-0 shadow-[0_1px_6px_0_rgb(0_0_0_/_10%)] min-h-[220px] border border-[#D4E16F] bg-white rounded-[8px]">
            <CardContent className="p-0 pb-3">
              <TabHeader />
              <Separator className="border-[#D4E16F]" />
              <TabPanel isFetching={loading} meetings={meetings} period={period} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Meetings;
