import React from "react";

import LocalSearchSkeleton from "@/components/loadings/LocalSearchSkeleton";
import PaginationSkeleton from "@/components/loadings/PaginationSkeleton";
import QuestionCardSkeleton from "@/components/loadings/QuestionCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

const loading = () => {
  return (
    <section>
      {/* Page title */}
      <Skeleton className="h-[42px] w-60 rounded-md" />

      {/* Search bar + filter */}
      <div className="mt-11">
        <LocalSearchSkeleton />
      </div>

      {/* Tag cards grid */}
      <div className="mt-10 flex w-full flex-col gap-6">
        {Array.from({ length: 10 }).map((_, idx) => (
          <QuestionCardSkeleton key={idx} />
        ))}
      </div>

      {/* Pagination placeholder */}
      <PaginationSkeleton />
    </section>
  );
};

export default loading;
