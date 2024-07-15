"use client";

import { IPostDocument } from "@/mongodb/models/post";
import { MessageCircle, Repeat2, Send, ThumbsUpIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { SignedIn, useUser } from "@clerk/nextjs";
import { LikePostRequestBody } from "@/app/api/posts/[post_id]/like/route";
import { UnlikePostRequestBody } from "@/app/api/posts/[post_id]/unlike/route";
import { cn } from "@/lib/utils";
import CommentForm from "./CommentForm";
import CommentFeed from "./CommentFeed";
import { toast } from "sonner";

type Props = {
  post: IPostDocument;
};

const PostOptions = ({ post }: Props) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const { user } = useUser();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);

  const likeOrUnlikePost = async () => {
    console.log(post);
    if (!user?.id) {
      toast.error("You have to login in to like posts");
      //   throw new Error("user not authenticated");
      return;
    }

    const originalLiked = liked;
    const originalLikes = likes;

    const newLikes = liked
      ? likes?.filter((like) => like !== user.id)
      : [...(likes ?? []), user.id];

    const body: LikePostRequestBody | UnlikePostRequestBody = {
      userId: user.id,
    };

    setLiked(!liked);
    setLikes(newLikes);

    const response = await fetch(
      `/api/posts/${post._id}/${liked ? "unlike" : "like"}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...body }),
      }
    );

    if (!response.ok) {
      setLiked(originalLiked);
      toast.error("Failed to like or unlike post");
      return;
      //   throw new Error("Failed to like or unlike post");
    }

    const fetchLikesResponse = await fetch(`/api/posts/${post._id}/like`);

    if (!fetchLikesResponse.ok) {
      setLikes(originalLikes);
      toast.error("Failed to fetch likes");
      return;
      //   throw new Error("Failed to fetch Likes");
    }

    const newLikesData = await fetchLikesResponse.json();

    setLikes(newLikesData);
  };

  useEffect(() => {
    if (user?.id && post.likes?.includes(user.id)) {
      setLiked(true);
    }
  }, [post, user]);

  return (
    <div>
      <div className="flex justify-between p-4">
        <div>
          {likes && likes.length > 0 && (
            <p className="text-xs text-gray-500 cursor-pointer hover:underline">
              {likes?.length} likes
            </p>
          )}
        </div>

        <div>
          {post?.comments && post.comments.length > 0 && (
            <p className="text-xs text-gray-500 cursor-pointer hover:underline">
              {post.comments?.length} Comments
            </p>
          )}
        </div>
      </div>

      <div className="flex p-2 justify-between px-2 border-t">
        <Button
          variant={"ghost"}
          className="postButton"
          onClick={likeOrUnlikePost}
        >
          <ThumbsUpIcon
            className={cn("mr-1", liked && "text-[#4881c2] fill-[#4881c2]")}
          ></ThumbsUpIcon>{" "}
          Like
        </Button>

        <Button
          variant={"ghost"}
          className="postButton"
          onClick={() => setIsCommentsOpen(!isCommentsOpen)}
        >
          <MessageCircle
            className={cn(
              "mr-1",
              isCommentsOpen && "text-gray-600 fill-gray-600"
            )}
          />{" "}
          Comment
        </Button>

        <Button variant={"ghost"} className="postButton">
          <Repeat2 /> Repost
        </Button>

        <Button variant={"ghost"} className="postButton">
          <Send /> Send
        </Button>
      </div>

      {isCommentsOpen && (
        <div className="">
          <SignedIn>
            <CommentForm postId={post._id as string} />
          </SignedIn>
          <CommentFeed post={post} />
        </div>
      )}
    </div>
  );
};

export default PostOptions;
