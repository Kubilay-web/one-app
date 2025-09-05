"use client";

import { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle";
import IntegrationCard from "./components/integration-card";
import { Loader } from "../components/loader";
import { ErrorAlert } from "../components/ErrorAlert";
import { getAllIntegrationQueryFn } from "../lib/api"; // API fonksiyonun burada kalabilir

interface Integration {
  app_type: string;
  title: string;
  isConnected: boolean;
}

const Integrations = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllIntegrationQueryFn();
        setIntegrations(data?.integrations || []);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchIntegrations();
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <PageTitle
        title="Integrations & apps"
        subtitle="Connect all your apps directly from here. You need to connect these apps"
      />

      <ErrorAlert isError={!!error} error={error} />

      <div className="relative flex flex-col gap-4">
        <section className="flex flex-col gap-4 text-muted-foreground">
          {loading ? (
            <div className="flex items-center justify-center min-h-[30vh]">
              <Loader size="lg" color="black" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center min-h-[30vh]">
              <p className="text-red-500">Failed to load integrations.</p>
            </div>
          ) : integrations.length === 0 ? (
            <div className="flex items-center justify-center min-h-[30vh]">
              <p className="text-gray-500">No integrations found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {integrations.map((integration) => (
                <IntegrationCard
                  key={integration.app_type}
                  isDisabled={
                    integration.app_type === "GOOGLE_MEET_AND_CALENDAR"
                      ? false
                      : true
                  }
                  appType={integration.app_type}
                  title={integration.title}
                  isConnected={integration.isConnected}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Integrations;
