"use client";

import { IPostDocument } from "@/mongodb/models/post";
import { MessageCircle, Repeat2, Send, ThumbsUpIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useUser } from "@clerk/nextjs";
import { LikePostRequestBody } from "@/app/api/posts/[post_id]/like/route";
import { UnlikePostRequestBody } from "@/app/api/posts/[post_id]/unlike/route";
import { cn } from "@/lib/utils";

type Props = {
  post: IPostDocument;
};

const PostOptions = ({ post }: Props) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState();
  const { user } = useUser();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);

  const likeOrUnlikePost = async () => {
    console.log(post);
    if (!user?.id) {
      throw new Error("user not authenticated");
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
      throw new Error("Failed to like post");
    }

    const fetchLikesResponse = await fetch(`/api/posts/${post._id}/like`);

    if (!fetchLikesResponse.ok) {
      setLikes(originalLikes);
      throw new Error("Failed to fetch Likes");
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
          <p className="text-xs text-gray-500 cursor-pointer hover:underline">
            {likes?.length} likes
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500 cursor-pointer hover:underline">
            {post.comments?.length} Comments
          </p>
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
          ></ThumbsUpIcon>
        </Button>

        <Button variant={"ghost"} className="postButton">
          <MessageCircle />
        </Button>

        <Button variant={"ghost"} className="postButton">
          <Repeat2 />
        </Button>

        <Button variant={"ghost"} className="postButton">
          <Send />
        </Button>
      </div>
    </div>
  );
};

export default PostOptions;
