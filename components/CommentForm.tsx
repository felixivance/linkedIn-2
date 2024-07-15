"use client";

import React, { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useUser } from "@clerk/nextjs";
import createCommentAction from "@/actions/createCommentAction";

type Props = {
  postId: string;
};

function CommentForm({ postId }: Props) {
  const { user } = useUser();
  const ref = useRef<HTMLFormElement>(null);

  const createCommentActionWithPostId = createCommentAction.bind(null, postId);

  const handleCommentAction = async (formData: FormData): Promise<void> => {
    const formDataCopy = formData;
    ref.current?.reset;

    try {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      await createCommentActionWithPostId(formDataCopy);
    } catch (error) {
      console.error(`Error creating comment: ${error}`);
    }
  };

  return (
    <form
      className="flex items-center space-x-1 py-2 px-4"
      ref={ref}
      action={(formData) => {
        const promise = handleCommentAction(formData);
      }}
    >
      <Avatar>
        <AvatarImage src={user?.imageUrl}></AvatarImage>
        <AvatarFallback>
          {user?.firstName?.charAt(0)}
          {user?.lastName?.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-1  bg-white border rounded-full px-3 py-2">
        <input
          type="text"
          name="commentInput"
          placeholder="Add a comment"
          id=""
          className="outline-none flex-1 text-sm bg-transparent"
        />
        <button type="submit" hidden>
          comment
        </button>
      </div>
    </form>
  );
}

export default CommentForm;
