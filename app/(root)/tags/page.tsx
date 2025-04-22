import React from "react";

import { getTags } from "@/lib/actions/tag.action";

const Tags = async () => {
  const { success, data, error } = await getTags({
    page: 1,
    pageSize: 10,
    query: "redis",
  });
  const { tags } = data || {};

  console.log("Tags data:", tags);
  return <div></div>;
};

export default Tags;
