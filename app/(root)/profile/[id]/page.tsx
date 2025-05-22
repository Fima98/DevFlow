import dayjs from "dayjs";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

import { auth } from "@/auth";
import AnswerCard from "@/components/cards/AnswerCard";
import QuestionCard from "@/components/cards/QuestionCard";
import TagCard from "@/components/cards/TagCard";
import DataRenderer from "@/components/DataRenderer";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileLink from "@/components/user/ProfileLink";
import Stats from "@/components/user/Stats";
import UserAvatar from "@/components/UserAvatar";
import { EMPTY_ANSWERS, EMPTY_QUESTION, EMPTY_TAGS } from "@/constants/states";
import {
  getUser,
  getUserAnswers,
  getUserQuestions,
  getUserStats,
  getUserTopTags,
} from "@/lib/actions/user.action";

const Profile = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  const { page, pageSize } = await searchParams;

  if (!id) notFound();

  const loggedInUser = await auth();

  const pageNum = Number(page) || 1;
  const questionsPageSize = Number(pageSize) || 10;
  const answersPageSize = Number(pageSize) || 5;

  const [
    userResponse,
    userQuestionsResponse,
    userAnswersResponse,
    userTopTagsResponse,
    userStatsResponse,
  ] = await Promise.all([
    getUser({ userId: id }),
    getUserQuestions({
      userId: id,
      page: pageNum,
      pageSize: questionsPageSize,
    }),
    getUserAnswers({
      userId: id,
      page: pageNum,
      pageSize: answersPageSize,
    }),
    getUserTopTags({ userId: id }),
    getUserStats({ userId: id }),
  ]);

  if (!userResponse.success) {
    return (
      <div>
        <div className="h1-bold text-dark100_light900">{userResponse.error?.message}</div>
      </div>
    );
  }
  const { user } = userResponse.data!;

  const { _id, name, username, bio, image, location, portfolio, reputation, createdAt } = user;

  const {
    totalQuestions = 0,
    totalAnswers = 0,
    badges = { bronze: 0, silver: 0, gold: 0 },
  } = userStatsResponse.data || {};

  const {
    success: userQuestionsSuccess,
    data: userQuestionsData,
    error: userQuestionsError,
  } = userQuestionsResponse;
  const { questions = [], isNext: hasMoreQuestions = false } = userQuestionsData || {};

  const {
    success: userAnswersSuccess,
    data: userAnswersData,
    error: userAnswersError,
  } = userAnswersResponse;
  const { answers = [], isNext: hasMoreAnswers = false } = userAnswersData || {};

  const {
    success: userTopTagsSuccess,
    data: userTopTagsData,
    error: userTopTagsError,
  } = userTopTagsResponse;
  const { tags = [] } = userTopTagsData || {};

  return (
    <>
      <section className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <UserAvatar
            id={_id}
            name={name}
            imageUrl={image}
            className="size-[140px] object-cover"
            fallbackClassName="text-6xl font-bolder"
            imageSizes="140px"
          />
          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900">{name}</h2>
            <p className="paragraph-regular text-dark200_light800">@{username}</p>
            <div className="mt-3 flex flex-wrap items-center justify-start gap-5">
              {portfolio && (
                <ProfileLink imgUrl="/icons/link.svg" href={portfolio} title="Portfolio" />
              )}
              {location && <ProfileLink imgUrl="/icons/location.svg" title={location} />}

              <ProfileLink
                imgUrl="/icons/calendar.svg"
                title={dayjs(createdAt).format("MMMM YYYY")}
              />
            </div>
            {bio && <p className="paragraph-regular text-dark400_light800 mt-8">{bio}</p>}
          </div>
        </div>

        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          {loggedInUser?.user?.id === id && (
            <Link href={`/profile/edit`}>
              <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-12 min-w-20 px-4 py-3">
                Edit
              </Button>
            </Link>
          )}
        </div>
      </section>
      <Stats
        totalQuestions={totalQuestions}
        totalAnswers={totalAnswers}
        badges={badges}
        reputationPoints={reputation || 0}
      />

      <section className="mt-10 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-[2]">
          <TabsList className="background-light800_dark400 min-h-[h2px] p-1">
            <TabsTrigger value="top-posts" className="tab">
              Top Posts
            </TabsTrigger>
            <TabsTrigger value="top-answers" className="tab">
              Top Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent value="top-posts">
            <DataRenderer<Question>
              success={userQuestionsSuccess}
              error={userQuestionsError}
              data={questions}
              empty={EMPTY_QUESTION}
              render={(questionsToRender) => (
                <div className="mt-5 flex w-full flex-col gap-6">
                  {questionsToRender.map((question) => (
                    <QuestionCard
                      key={question._id}
                      question={question}
                      showActionBtns={loggedInUser?.user?.id === question.author._id}
                    />
                  ))}
                </div>
              )}
            />
            <Pagination page={page} isNext={hasMoreQuestions} />{" "}
          </TabsContent>
          <TabsContent value="top-answers">
            <DataRenderer<Answer>
              success={userAnswersSuccess}
              error={userAnswersError}
              data={answers}
              empty={EMPTY_ANSWERS}
              render={(answersToRender) => (
                <div className="mt-5 flex w-full flex-col gap-10">
                  {answersToRender.map((answer) => (
                    <AnswerCard
                      key={answer._id}
                      {...answer}
                      content={answer.content.slice(0, 270)}
                      containerClasses="card-wrapper rounded-[10px] px-7 py-9 sm:px-11"
                      showReadMore
                      showActionBtns={loggedInUser?.user?.id === answer.author._id}
                    />
                  ))}
                </div>
              )}
            />
            <Pagination page={page} isNext={hasMoreAnswers} />
          </TabsContent>
        </Tabs>

        <div className="flex w-full min-w-[250px] flex-1 flex-col max-2xl:hidden">
          <h3 className="h3-bold text-dark200_light900">Top Tags</h3>
          <DataRenderer
            data={tags}
            empty={EMPTY_TAGS}
            success={userTopTagsSuccess}
            error={userTopTagsError}
            render={(userTags) => (
              <div className="mt-7 flex w-full flex-col gap-4">
                {userTags.map(({ _id: tagId, name: tagName, count: tagQuestions }) => (
                  <TagCard
                    key={tagId}
                    _id={tagId}
                    name={tagName}
                    questions={tagQuestions}
                    showCount
                    compact
                  />
                ))}
              </div>
            )}
          />
        </div>
      </section>
    </>
  );
};

export default Profile;
