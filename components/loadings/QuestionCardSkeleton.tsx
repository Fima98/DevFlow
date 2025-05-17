import React from "react";

import { Skeleton } from "@/components/ui/skeleton";

const QuestionCardSkeleton = () => {
  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
      {/* Title and timestamp */}
      <div className="flex flex-col-reverse items-center justify-between gap-5 sm:flex-row">
        <div className="flex-1">
          <Skeleton className="mb-2 h-4 w-1/4 sm:hidden" /> {/* timestamp */}
          <Skeleton className="mb-0 h-6 w-3/4" /> {/* title */}
        </div>
      </div>

      {/* Tags */}
      <div className="mt-3.5 flex w-full flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Skeleton key={idx} className="h-10 w-28 rounded-md" />
        ))}
      </div>

      {/* Author and metrics */}
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        {/* Author avatar/name */}
        <div className="flex-center gap-2">
          <Skeleton className="size-5 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Metrics: upvotes, answers, views */}
        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-12" />
        </div>
      </div>
    </div>
  );
};

export default QuestionCardSkeleton;
