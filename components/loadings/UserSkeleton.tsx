import React from "react";

import { Skeleton } from "../ui/skeleton";

const UserSkeleton = () => {
  return (
    <div className="shadow-light100_darknone">
      <article className="background-light900_dark200 light-border flex flex-1 basis-[260px] flex-col items-center rounded-2xl border px-8 py-10">
        {/* Avatar skeleton */}
        <Skeleton className="size-[100px] rounded-full" />

        {/* Name and username skeletons */}
        <div className="mt-4 w-full space-y-2 text-center">
          <Skeleton className="mx-auto h-6 w-3/4" />
          <Skeleton className="mx-auto h-3.5 w-1/2" />
        </div>
      </article>
    </div>
  );
};

export default UserSkeleton;
