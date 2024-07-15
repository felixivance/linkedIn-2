import { IPost, IPostDocument } from "@/mongodb/models/post";
import React from "react";
import Post from "./Post";

const PostFeed = ({ posts }: { posts: IPostDocument[] }) => {
  return (
    <div className="space-y-2 pb-20">
      {posts?.map((post) => (
        <Post key={post._id as string} post={post} />
      ))}
    </div>
  );
};

export default PostFeed;
