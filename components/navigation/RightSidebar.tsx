import Image from "next/image";
import Link from "next/link";
import React from "react";

import ROUTES from "@/constants/routes";
import { getHotQuestions } from "@/lib/actions/question.action";

import TagCard from "../cards/TagCard";
import DataRenderer from "../DataRenderer";

const popularTags = [
  { _id: "1", name: "react", questions: 100 },
  { _id: "2", name: "javascript", questions: 50 },
  { _id: "3", name: "html", questions: 30 },
  { _id: "4", name: "css", questions: 20 },
  { _id: "5", name: "nodejs", questions: 10 },
];

const RightSidebar = async () => {
  const { success, data: hotQuestions, error } = await getHotQuestions();
  return (
    <section className="custom-scrollbar background-light900_dark200 light-border sticky right-0 top-0 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top questions</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          <DataRenderer
            success={success}
            error={error}
            data={hotQuestions}
            empty={{
              title: "No questions found",
              message: "No questions have been asked yet.",
            }}
            render={(hotQuestions) => (
              <div className="mt-7 flex w-full flex-col gap-[30px]">
                {hotQuestions.map(({ _id, title }) => (
                  <Link
                    key={_id}
                    href={ROUTES.QUESTION(_id)}
                    className="flex cursor-pointer items-center justify-between gap-7"
                  >
                    <p className="body-medium text-dark500_light700 line-clamp-2">
                      {title}
                    </p>

                    <Image
                      src="/icons/chevron-right.svg"
                      alt="Chevron"
                      width={20}
                      height={20}
                      className="invert-colors"
                    />
                  </Link>
                ))}
              </div>
            )}
          />
        </div>
      </div>
      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular tags</h3>
        <div className="mt-7 flex flex-col gap-[30px]">
          {popularTags.map(({ _id, name, questions }) => (
            <TagCard
              key={_id}
              _id={_id}
              name={name}
              questions={questions}
              showCount
              compact
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
