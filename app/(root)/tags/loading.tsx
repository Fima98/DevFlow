import CommonFilter from "@/components/filters/CommonFilter";
import LocalSearchSkeleton from "@/components/loadings/LocalSearchSkeleton";
import PaginationSkeleton from "@/components/loadings/PaginationSkeleton";
import TagCardSkeleton from "@/components/loadings/TagCardSkeleton";
import { UserFilters } from "@/constants/filters";

const Loading = () => {
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
      <div className="mt-10 grid w-full grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
        {Array.from({ length: 10 }).map((_, idx) => (
          <TagCardSkeleton key={idx} />
        ))}
      </div>

      {/* Pagination placeholder */}
      <PaginationSkeleton />
    </section>
  );
};

export default Loading;
