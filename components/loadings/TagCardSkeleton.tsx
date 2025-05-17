import React from "react";

import { Skeleton } from "../ui/skeleton";

const TagCardSkeleton = () => {
  return (
    <div className="shadow-light100_darknone">
      <article className="background-light900_dark200 light-border flex flex-1 basis-[260px] flex-col rounded-2xl border px-8 py-10">
        {/* Badge skeleton: name and icon */}
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-9 w-24 rounded" />
          <Skeleton className="size-6 rounded" />
        </div>

        {/* Description skeleton: three lines */}
        <div className="mt-5 space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>

        {/* Questions count skeleton */}
        <div className="mt-3.5">
          <Skeleton className="h-3 w-16" />
        </div>
      </article>
    </div>
  );
};

export default TagCardSkeleton;
