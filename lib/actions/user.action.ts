"use server";

import { FilterQuery } from "mongoose";

import { User, Question, Answer } from "@/database";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { NotFoundError } from "../http-errors";
import dbConnect from "../mongoose";
import {
  GetUserQuestionsSchema,
  GetUserSchema,
  PaginatedSearchSchema,
} from "../validations";

export async function getUsers(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ users: User[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchSchema,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, query, filter } = validationResult.params!;

  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);

  const filterQuery: FilterQuery<typeof User> = {};

  if (query) {
    filterQuery.$or = [
      { name: { $regex: query, $options: "i" } },
      { username: { $regex: query, $options: "i" } },
    ];
  }

  let sortCriteria = {};
  switch (filter) {
    case "newest":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "popular":
      sortCriteria = { reputation: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    const totalUsers = await User.countDocuments(filterQuery);
    const users = await User.find(filterQuery)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);
    const isNext = totalUsers > skip + users.length;
    return {
      success: true,
      data: { users: JSON.parse(JSON.stringify(users)), isNext },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getUser(
  params: GetUserParams
): Promise<
  ActionResponse<{ user: User; totalQuestions: number; totalAnswers: number }>
> {
  const validationResult = await action({
    params,
    schema: GetUserSchema,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { userId } = validationResult.params!;
  try {
    await dbConnect();

    const [user, totalQuestions, totalAnswers] = await Promise.all([
      User.findById(userId).lean(),
      Question.countDocuments({ author: userId }),
      Answer.countDocuments({ author: userId }),
    ]);

    if (!user) throw new NotFoundError("User");

    return {
      success: true,
      data: {
        user: JSON.parse(JSON.stringify(user)),
        totalQuestions,
        totalAnswers,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getUserQuestions(params: GetUserQuestionsParams): Promise<
  ActionResponse<{
    questions: Question[];
    isNext: boolean;
    totalQuestions: number;
  }>
> {
  const validationResult = await action({
    params,
    schema: GetUserQuestionsSchema,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId, page = 1, pageSize = 10 } = validationResult.params!;
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);

  try {
    const [totalQuestions, questions] = await Promise.all([
      Question.countDocuments({ author: userId }),
      Question.find({ author: userId })
        .populate("tags", "name")
        .populate("author", "name image")
        .lean()
        .skip(skip)
        .limit(limit)
        .sort({ views: -1, upvotes: -1 }),
    ]);

    const isNext = totalQuestions > skip + questions.length;
    return {
      success: true,
      data: {
        questions: JSON.parse(JSON.stringify(questions)),
        isNext,
        totalQuestions,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
