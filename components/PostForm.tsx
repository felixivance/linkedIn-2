"use client";
import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useUser } from "@clerk/nextjs";
import { ImageIcon } from "lucide-react";
import { Button } from "./ui/button";
type Props = {};

const PostForm = (props: Props) => {
  const { user, isSignedIn } = useUser();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      <form action="" ref={formRef}>
        <div className="flex">
          <Avatar>
            {user?.id ? (
              <AvatarImage src={user?.imageUrl}></AvatarImage>
            ) : (
              <AvatarImage src={"https://github.com/shadcn.png"}></AvatarImage>
            )}

            <AvatarFallback>
              {user?.firstName?.charAt(0)} {user?.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <input
            type="text"
            name="postInput"
            placeholder="Start writing a post"
            className="flex-1 outline-none rounded-full py-3 px-4 border"
          />

          <input
            ref={fileInputRef}
            type="file"
            name="image"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
          <button type="submit" hidden>
            post
          </button>
        </div>
        {/* preview */}

        <div>
          <Button type="button">
            <ImageIcon className="mr-2" size={16} color="currentColor" />
            Add Image
          </Button>
          {/* remove preview image */}
        </div>
      </form>
    </div>
  );
};

export default PostForm;
