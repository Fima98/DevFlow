import React from "react";

import CommonFilter from "@/components/filters/CommonFilter";
import LocalSearchSkeleton from "@/components/loadings/LocalSearchSkeleton";
import PaginationSkeleton from "@/components/loadings/PaginationSkeleton";
import QuestionCardSkeleton from "@/components/loadings/QuestionCardSkeleton";
import { UserFilters } from "@/constants/filters";

const loading = () => {
  return (
    <section>
      {/* Page title */}
      <h1 className="h1-bold text-dark100_light900 text-3xl">Tags</h1>

      {/* Search bar + filter */}
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchSkeleton />
        <CommonFilter filters={UserFilters} otherClasses="min-h-[56px] sm:min-w-[170px]" />
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
