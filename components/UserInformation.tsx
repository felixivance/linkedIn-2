import { currentUser } from "@clerk/nextjs/server";
import React from "react";
import { Avatar } from "./ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { IPostDocument } from "@/mongodb/models/post";

type Props = {
  posts: IPostDocument[];
};

const UserInformation = async ({ posts }: Props) => {
  const user = await currentUser();

  const userPosts = posts?.filter((post) => post.user.userId === user?.id);

  const userComments = posts.flatMap((post) =>
    post?.comments?.filter((comment) => comment.user.userId === user?.id)
  );

  return (
    <div className="flex flex-col justify-center items-center bg-white mr-6 rounded-lg border py-4 ">
      <Avatar>
        {user?.id ? (
          <AvatarImage
            src={user?.imageUrl || "https://github.com/shadcn.png"}
          ></AvatarImage>
        ) : (
          <AvatarImage src={"https://github.com/shadcn.png"}></AvatarImage>
        )}

        <AvatarFallback>
          {user?.firstName?.charAt(0)} {user?.lastName?.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <SignedIn>
        <div className="text-center">
          <p className="font-semibold">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-xs">
            @{user?.firstName} {user?.lastName} - {user?.id?.slice(-4)}
          </p>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="text-center space-y-2">
          <p className="font-semibold">You are not signed in</p>
          <Button asChild className="bg-[#0B63C4] text-white">
            <SignInButton>Sign In</SignInButton>
          </Button>
        </div>
      </SignedOut>

      <hr className="w-full border-gray-200 my-5" />

      <div className="flex justify-between w-full px-4 text-sm">
        <p className="font-semibold text-gray-400">Posts</p>
        <p className="text-blue-400">{userPosts.length}</p>
      </div>

      <div className="flex justify-between w-full px-4 text-sm">
        <p className="font-semibold text-gray-400">Comments</p>
        <p className="text-blue-400">{userComments.length}</p>
      </div>
    </div>
  );
};

export default UserInformation;
