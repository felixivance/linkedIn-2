import { IPostDocument } from "@/mongodb/models/post";
import { useUser } from "@clerk/nextjs";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type Props = {
  post: IPostDocument;
};

const CommentFeed = ({ post }: Props) => {
  const { user } = useUser();

  const isAuthor = user?.id === post.user.userId;

  return (
    <div>
      {post?.comments?.map((comment) => (
        <div key={comment._id as string}>
          <Avatar>
            <AvatarImage src={comment.user.userImage} />
            <AvatarFallback>
              {comment.user.firstName?.charAt(0)}
              {comment.user.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      ))}
    </div>
  );
};

export default CommentFeed;
