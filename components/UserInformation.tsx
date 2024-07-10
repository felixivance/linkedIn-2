import { currentUser } from "@clerk/nextjs/server";
import React from "react";
import { Avatar } from "./ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { SignedIn } from "@clerk/nextjs";

type Props = {};

const UserInformation = async (props: Props) => {
  const user = await currentUser();
  return (
    <div>
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
    </div>
  );
};

export default UserInformation;
