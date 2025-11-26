"use client";

import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { InfiniteScroll } from "../../../../components/infinite-scroll";
import { VideoGridCard, VideoGridCardSkeleton } from "../../../video/ui/components/video-grid-card";

interface HomeVideosSectionProps {
  categoryId?: string;
}

// Ana component
export const HomeVideosSection = (props: HomeVideosSectionProps) => {
  return (
    <Suspense key={props.categoryId} fallback={<HomeVideosSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error loading videos</p>}>
        <HomeVideosSectionSuspense {...props} />
      </ErrorBoundary>
    </Suspense>
  );
};

// Skeleton
export const HomeVideosSectionSkeleton = () => {
  return (
    <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: 18 }).map((_, i) => (
        <VideoGridCardSkeleton key={i} />
      ))}
    </div>
  );
};

/* ---------------------------------------------------------
   Suspense-friendly fetch (ilk sayfa)
---------------------------------------------------------- */

let _initialPromise: Promise<any> | null = null;

function fetchInitialVideos(categoryId?: string) {
  if (!_initialPromise) {
    const url = new URL("/api/video/studio/videos", window.location.origin);
    if (categoryId) url.searchParams.set("categoryId", categoryId);

    _initialPromise = fetch(url.toString(), { cache: "no-store" }).then(r => r.json());
  }

  throw _initialPromise; // Suspense burada devreye girer
}

/* ---------------------------------------------------------
   Infinite scroll component
---------------------------------------------------------- */
const HomeVideosSectionSuspense = ({ categoryId }: HomeVideosSectionProps) => {
  const firstPage = fetchInitialVideos(categoryId);

  const [pages, setPages] = useState([firstPage]);
  const [nextCursor, setNextCursor] = useState(firstPage.nextCursor);
  const [isFetching, setIsFetching] = useState(false);

  const fetchNextPage = async () => {
    if (!nextCursor || isFetching) return;

    setIsFetching(true);

    const url = new URL("/api/video/studio/videos", window.location.origin);
    if (categoryId) url.searchParams.set("categoryId", categoryId);
    url.searchParams.set("cursor", nextCursor);

    const data = await fetch(url.toString(), { cache: "no-store" }).then(r => r.json());

    setPages(prev => [...prev, data]);
    setNextCursor(data.nextCursor);
    setIsFetching(false);
  };

  const items = pages.flatMap(p => p.items);

  return (
    <div>
      <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
        {items.map((video: any) => (
          <VideoGridCard key={video.id} data={video} />
        ))}
      </div>

      <InfiniteScroll
        hasNextPage={!!nextCursor}
        isFetchingNextPage={isFetching}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
};
