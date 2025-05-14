"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ROUTES from "@/constants/routes";
import { toast } from "@/hooks/use-toast";
import { deleteAnswer } from "@/lib/actions/answer.action";
import { deleteQuestion } from "@/lib/actions/question.action";

interface Props {
  type: "question" | "answer";
  itemId: string;
}

const EditDeleteButtons = ({ type, itemId }: Props) => {
  const handleDelete = async () => {
    if (type === "question") {
      await deleteQuestion({ questionId: itemId });
      toast({
        title: "Question deleted",
        description: "Your question has been deleted successfully.",
      });
    } else if (type === "answer") {
      await deleteAnswer({ answerId: itemId });

      toast({
        title: "Answer deleted",
        description: "Your answer has been deleted successfully.",
      });
    }
  };
  return (
    <div
      className={`flex items-center justify-end gap-3 max-sm:w-full ${type === "answer" && "justify-center gap-0"}`}
    >
      {type === "question" && (
        <Link href={ROUTES.EDIT_QUESTION(itemId)}>
          <Image
            src="/icons/edit.svg"
            alt="edit"
            width={18}
            height={18}
            className="cursor-pointer object-contain"
          />
        </Link>
      )}

      <AlertDialog>
        <AlertDialogTrigger className="cursor-pointer">
          <Image
            src={"/icons/trash.svg"}
            alt={"trash"}
            width={18}
            height={18}
            className="object-contain"
          />
        </AlertDialogTrigger>
        <AlertDialogContent className="background-light800_dark300">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your {type} and remove it
              from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="btn">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="!border-primary-500 !bg-primary-500 !text-light-900"
              onClick={handleDelete}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EditDeleteButtons;
