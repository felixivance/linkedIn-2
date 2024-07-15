import { IPostDocument } from "@/mongodb/models/post";
import { useUser } from "@clerk/nextjs";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import ReactTimeago from "react-timeago";

type Props = {
  post: IPostDocument;
};

const CommentFeed = ({ post }: Props) => {
  const { user } = useUser();

  const isAuthor = user?.id === post.user.userId;

  return (
    <div className="space-y-2 mt-3">
      {post?.comments?.map((comment) => (
        <div key={comment._id as string}>
          <Avatar>
            <AvatarImage src={comment.user.userImage} />
            <AvatarFallback>
              {comment.user.firstName?.charAt(0)}
              {comment.user.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="bg-gray-100 px-4 py-2 rounded-md w-full sm:w-auto md:min-w-[300px]">
              <div className="flex justify-between">
                <p className="font-semibold">
                  {comment.user.firstName} {comment.user.lastName}
                </p>
                <p>
                  @{comment.user.firstName}
                  {comment.user.firstName}-
                  {comment.user.userId.toString().slice(-4)}
                </p>
              </div>
              <p className="text-xs text-gray-400">
                <ReactTimeago date={new Date(comment.createdAt)} />
              </p>
            </div>
            <p className="mt-3 text-sm">{comment.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentFeed;
