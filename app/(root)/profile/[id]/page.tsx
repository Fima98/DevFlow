import dayjs from "dayjs";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileLink from "@/components/user/ProfileLink";
import Stats from "@/components/user/Stats";
import UserAvatar from "@/components/UserAvatar";
import { getUser } from "@/lib/actions/user.action";

const Profile = async ({ params }: RouteParams) => {
  const { id } = await params;
  if (!id) notFound();

  const loggedInUser = await auth();

  const { success, data, error } = await getUser({ userId: id });

  if (!success)
    return (
      <div>
        <div className="h1-bold text-dark100_light900">{error?.message}</div>
      </div>
    );

  const { user, totalQuestions, totalAnswers } = data!;
  const {
    _id,
    name,
    username,
    bio,
    image,
    location,
    portfolio,
    reputation,
    createdAt,
  } = user;

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
            <p className="paragraph-regular text-dark200_light800">
              @{username}
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-start gap-5">
              {portfolio && (
                <ProfileLink
                  imgUrl="/icons/link.svg"
                  href={portfolio}
                  title="Portfolio"
                />
              )}
              {location && (
                <ProfileLink imgUrl="/icons/location.svg" title={location} />
              )}

              <ProfileLink
                imgUrl="/icons/calendar.svg"
                title={dayjs(createdAt).format("MMMM YYYY")}
              />
            </div>
            {bio && (
              <p className="paragraph-regular text-dark400_light800 mt-8">
                {bio}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          {loggedInUser?.user?.id == id && (
            <Link href={`/profile/edit/${id}`}>
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
        badges={{ gold: 0, silver: 0, bronze: 0 }}
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
            <div className="mt-5 flex w-full flex-col gap-6">
              List of top posts
            </div>
          </TabsContent>
          <TabsContent value="top-answers">
            <div className="mt-5 flex w-full flex-col gap-6">
              List of top answers
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex w-full min-w-[250px] flex-1 flex-col max-lg:hidden">
          <h3 className="h3-bold text-dark200_light900">Top Tags</h3>
          <div className="mt-7 flex flex-col gap-4">
            <p>List of top tags</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
