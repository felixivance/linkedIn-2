"use client";

import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useUser } from "@clerk/nextjs";
import createCommentAction from "@/actions/createCommentAction";
import { toast } from "sonner";

type Props = {
  postId: string;
};

function CommentForm({ postId }: Props) {
  const { user } = useUser();
  const ref = useRef<HTMLFormElement>(null);
  const [comment, setComment] = useState("");

  const maxCharacters = 120;

  const createCommentActionWithPostId = createCommentAction.bind(null, postId);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= maxCharacters) {
      setComment(e.target.value);
    }
  };

  const handleCommentAction = async (formData: FormData): Promise<void> => {
    const formDataCopy = formData;
    ref.current?.reset();
    setComment("");

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
        toast.promise(promise, {
          loading: "creating comment..",
          success: "comment created",
          error: "Failed to create comment",
        });
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
          value={comment}
          onChange={handleInputChange}
          maxLength={maxCharacters}
          className="outline-none flex-1 text-sm bg-transparent break-words"
        />
        <button type="submit" hidden>
          comment
        </button>
      </div>
      {maxCharacters - comment.length != maxCharacters && (
        <div className="text-xs text-gray-500">
          {maxCharacters - comment.length} characters left
        </div>
      )}
    </form>
  );
}

export default CommentForm;
