import React from "react";

import { Skeleton } from "../ui/skeleton";

const PaginationSkeleton = () => {
  return (
    <div className="mt-5 flex w-full justify-center">
      <Skeleton className="h-[36px] w-[200px]" />
    </div>
  );
};

export default PaginationSkeleton;
