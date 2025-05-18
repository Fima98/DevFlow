import Link from "next/link";
import React from "react";

import CommonFilter from "@/components/filters/CommonFilter";
import HomeFilter from "@/components/filters/HomeFilter";
import LocalSearchSkeleton from "@/components/loadings/LocalSearchSkeleton";
import PaginationSkeleton from "@/components/loadings/PaginationSkeleton";
import QuestionCardSkeleton from "@/components/loadings/QuestionCardSkeleton";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import ROUTES from "@/constants/routes";

const loading = () => {
  return (
    <section>
      {/* Page title */}
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All questions</h1>
        <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900" asChild>
          <Link href={ROUTES.ASK_QUESTION}>Ask a question</Link>
        </Button>
      </section>

      {/* Search bar + filter */}
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchSkeleton />
        <CommonFilter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-sm:block"
        />
      </div>

      <HomeFilter />

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
