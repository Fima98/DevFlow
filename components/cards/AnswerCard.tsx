import Link from "next/link";
import { Suspense } from "react";

import ROUTES from "@/constants/routes";
import { hasVoted } from "@/lib/actions/vote.action";
import { cn, getTimeStamp } from "@/lib/utils";

import Preview from "../editor/Preview";
import EditDeleteButtons from "../user/EditDeleteButtons";
import UserAvatar from "../UserAvatar";
import Votes from "../votes/Votes";

interface Props extends Answer {
  containerClasses?: string;
  showReadMore?: boolean;
  showActionBtns?: boolean;
}

const AnswerCard = ({
  _id,
  author,
  content,
  createdAt,
  upvotes,
  downvotes,
  question,
  containerClasses,
  showReadMore = false,
  showActionBtns = false,
}: Props) => {
  const hasVotedPromise = hasVoted({
    targetId: _id,
    targetType: "answer",
  });

  return (
    <article className={cn("light-border border-b py-5", containerClasses)}>
      <span id={`answer-${_id}`} className="hash-span" />

      <div className="mb-5 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <div className="flex flex-1 items-center gap-2">
          <UserAvatar
            id={author._id}
            name={author.name}
            imageUrl={author.image}
            className="size-7 rounded-full object-cover"
            imageSizes="28px"
          />

          <Link
            href={ROUTES.PROFILE(author._id)}
            className="flex flex-col max-md:ml-1 md:flex-row md:items-center"
          >
            <p className="body-semibold text-dark300_light700">{author.name ?? "Anonymous"}</p>

            <p className="small-regular text-light400_light500 md:ml-1">
              <span className="hidden md:inline">•</span> answered {getTimeStamp(createdAt)}
            </p>
          </Link>
        </div>

        <div className="flex justify-end gap-4">
          <Suspense fallback={<div>Loading...</div>}>
            <Votes
              upvotes={upvotes}
              downvotes={downvotes}
              targetType="answer"
              targetId={_id}
              hasVotedPromise={hasVotedPromise}
            />
          </Suspense>
          {showActionBtns && (
            <div className="background-light800 flex-center rounded-full">
              <EditDeleteButtons type="answer" itemId={_id} />
            </div>
          )}
        </div>
      </div>

      <Preview content={content} />

      {showReadMore && (
        <Link
          href={`/questions/${question}#answer-${_id}`}
          className="body-semibold relative z-10 font-space-grotesk text-primary-500"
        >
          <p className="mt-1">Read more...</p>
        </Link>
      )}
    </article>
  );
};

export default AnswerCard;
