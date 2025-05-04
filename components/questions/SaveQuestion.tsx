"use client";
import Image from "next/image";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

import { toast } from "@/hooks/use-toast";
import { toggleSaveQuestion } from "@/lib/actions/collection.action";

const SaveQuestion = ({ questionId }: { questionId: string }) => {
  const session = useSession();
  const userId = session.data?.user?.id;

  const [isLoading, setIsLoading] = useState(false);

  const hasSaved = false;

  const handleSaveQuestion = async () => {
    if (!userId) {
      return toast({
        title: "Please login to save",
        description: "Only logged-in users can save",
      });
    }

    setIsLoading(true);

    try {
      const { success, data, error } = await toggleSaveQuestion({ questionId });

      if (!success) {
        throw new Error(error?.message || "An error occured");
      }
      console.log(data);
      return;
    } catch (error) {
      toast({
        title: "Failed to save",
        description:
          error instanceof Error ? error.message : "An error occured",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Image
      src={hasSaved ? "/icons/star-filled.svg" : "/icons/star-red.svg"}
      width={18}
      height={18}
      alt="Save"
      className={`cursor-pointer ${isLoading && "opacity-50"}`}
      aria-label="Save question"
      onClick={handleSaveQuestion}
    />
  );
};

export default SaveQuestion;
