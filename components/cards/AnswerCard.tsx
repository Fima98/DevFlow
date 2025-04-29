import Link from "next/link";

import ROUTES from "@/constants/routes";
import { getTimeStamp } from "@/lib/utils";

import Preview from "../editor/Preview";
import UserAvatar from "../UserAvatar";

const AnswerCard = ({ _id, author, content, createdAt }: Answer) => {
  return (
    <article className="light-border border-b py-10">
      <span id={JSON.stringify(_id)} className="hash-span" />

      <div className="mb-5 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <div className="flex flex-1 items-center gap-2">
          <UserAvatar
            id={author._id}
            name={author.name}
            imageUrl={author.image}
            className="size-7 rounded-full object-cover"
          />

          <Link
            href={ROUTES.PROFILE(author._id)}
            className="flex flex-col max-sm:ml-1 sm:flex-row sm:items-center"
          >
            <p className="body-semibold text-dark300_light700">
              {author.name ?? "Anonymous"}
            </p>

            <p className="small-regular text-light400_light500 sm:ml-1">
              <span className="hidden sm:inline">•</span> answered{" "}
              {getTimeStamp(createdAt)}
            </p>
          </Link>
        </div>

        <div className="flex justify-end">Votes</div>
      </div>

      <Preview content={content} />
    </article>
  );
};

export default AnswerCard;
