import Filters from "../components/filters";
import Loader from "../components/loader";
import { Suspense } from "react";
import PropertiesData from "./_components/properties-data";



export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;

  const key = JSON.stringify(resolvedSearchParams);

  return (
    <div>
      <Filters searchParams={resolvedSearchParams} />

      <Suspense fallback={<Loader />} key={key}>
        <PropertiesData searchParams={resolvedSearchParams} />
      </Suspense>
    </div>
  );
}

