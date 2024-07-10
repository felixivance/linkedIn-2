import { currentUser } from "@clerk/nextjs/server";
import React from "react";
import { Avatar } from "./ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

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
    </div>
  );
};

export default UserInformation;
