import mongoose from "mongoose";

import { Interaction, User } from "@/database";
import { IInteractionDoc } from "@/database/interaction.model";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { CreateInteractionSchema } from "../validations";

export async function createInteraction(
  params: CreateInteractionParams
): Promise<ActionResponse<IInteractionDoc>> {
  const validationResult = await action({
    params,
    schema: CreateInteractionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    actionType,
    actionId,
    actionTarget,
    authorId, // person who owns the content (question/answer)
  } = validationResult.params!;
  const userId = validationResult.session!.user!.id!;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existing = await Interaction.findOne({
      user: userId,
      actionId,
      actionTarget,
      actionType: { $in: ["upvote", "downvote"] },
    }).session(session);

    if (existing) {
      // Якщо голосування вже є, і воно інше — оновлюємо його
      if (existing.actionType !== actionType) {
        // Відкотити попередній вплив на репутацію
        await updateReputation({
          interaction: existing,
          session,
          performerId: userId,
          authorId,
          revert: true, // Важливо!
        });

        // Оновлюємо тип голосу
        existing.actionType = actionType;
        await existing.save({ session });

        // Додаємо новий вплив
        await updateReputation({
          interaction: existing,
          session,
          performerId: userId,
          authorId,
        });

        await session.commitTransaction();
        return { success: true, data: existing.toObject() };
      } else {
        // Якщо тип такий самий, нічого не робимо
        await session.abortTransaction();
        return { success: true, data: existing.toObject() };
      }
    }

    const [interaction] = await Interaction.create(
      [
        {
          user: userId,
          actionType,
          actionId,
          actionTarget,
        },
      ],
      { session }
    );

    // Update reputation for both the performer and the content author
    await updateReputation({
      interaction,
      session,
      performerId: userId!,
      authorId,
    });

    await session.commitTransaction();

    return { success: true, data: JSON.parse(JSON.stringify(interaction)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function updateReputation(params: UpdateReputationParams) {
  const { interaction, session, performerId, authorId, revert = false } = params;
  const { actionType, actionTarget } = interaction;

  let performerPoints = 0;
  let authorPoints = 0;

  switch (actionType) {
    case "upvote":
      performerPoints = 2;
      authorPoints = 10;
      break;
    case "downvote":
      authorPoints = -2;
      break;
    case "post":
      authorPoints = actionTarget === "question" ? 5 : 10;
      break;
    case "delete":
      authorPoints = actionTarget === "question" ? -5 : -10;
      break;
  }

  if (revert) {
    performerPoints *= -1;
    authorPoints *= -1;
  }

  if (performerId === authorId) {
    await User.findByIdAndUpdate(performerId, { $inc: { reputation: authorPoints } }, { session });
    return;
  }

  await User.bulkWrite(
    [
      {
        updateOne: {
          filter: { _id: performerId },
          update: { $inc: { reputation: performerPoints } },
        },
      },
      {
        updateOne: {
          filter: { _id: authorId },
          update: { $inc: { reputation: authorPoints } },
        },
      },
    ],
    { session }
  );
}
