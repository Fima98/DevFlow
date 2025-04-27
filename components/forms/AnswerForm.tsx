"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import dynamic from "next/dynamic";
import { useEffect, useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { CreateAnswer } from "@/lib/actions/answer.action";
import { AnswerSchema } from "@/lib/validations";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});

const AnswerForm = ({ questionId }: { questionId: string }) => {
  const [isAnswering, setIsAnsweringTransition] = useTransition();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleEditorChange = (value: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      form.setValue("content", value);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async (values: z.infer<typeof AnswerSchema>) => {
    setIsAnsweringTransition(async () => {
      const result = await CreateAnswer({
        questionId,
        content: values.content,
      });

      if (result.success) {
        form.reset();
        toast({
          title: "Success",
          description: "Your answer has been posted successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: result.error?.message,
          variant: "destructive",
        });
      }
    });
  };

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      content: "",
    },
  });

  return (
    <Form {...form}>
      <form
        className="mt-6 flex w-full flex-col gap-10"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormControl className="mt-3.5">
                <Editor
                  markdown={field.value}
                  // editorRef={editorRef}
                  onChange={handleEditorChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isAnswering}
            className="primary-gradient w-fit"
          >
            {isAnswering ? (
              <>
                <ReloadIcon className="mr-2 size-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Answer"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AnswerForm;
