"use client";
import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useUser } from "@clerk/nextjs";
import { ImageIcon, XIcon } from "lucide-react";
import { Button } from "./ui/button";
import createPostAction from "@/actions/createPostAction";
import { toast } from "sonner";
type Props = {};

const PostForm = (props: Props) => {
  const { user, isSignedIn } = useUser();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [postInput, setPostInput] = useState("");
  const maxCharacters = 200;

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
    // console.log("coming soon")
  };

  const handlePostAction = async (formData: FormData) => {
    const formDataCopy = formData;

    formRef.current?.reset();
    setPostInput("");

    const text = formDataCopy.get("postInput") as string;

    if (!text.trim()) {
      throw new Error("you must provide a post input");
    }
    setPreview(null);

    try {
      await createPostAction(formDataCopy);
    } catch (error) {
      console.log("error creating post: ", error);
    }
  };

  const handlePostTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= maxCharacters) {
      setPostInput(e.target.value);
    }
  };

  return (
    <div className=" mb-2">
      <form
        action={(formData) => {
          // handle form submission with server action
          const promise = handlePostAction(formData);
          toast.promise(promise, {
            loading: "creating post..",
            success: "Post created",
            error: "Failed to create post",
          });
          // display toast notification
        }}
        ref={formRef}
        className="p-3 bg-white rounded-lg border"
      >
        <div className="flex items-center space-x-1">
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
            className="flex-1 outline-none rounded-full py-2 px-4 border"
            onChange={handlePostTextChange}
            maxLength={maxCharacters}
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
        {preview && (
          <div className="mt-3">
            <img src={preview} alt="preview" className="w-full object-cover" />
          </div>
        )}

        <div className="flex space-x-2 justify-end mt-2">
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            variant={preview ? "secondary" : "outline"}
          >
            <ImageIcon className="mr-2" size={16} color="currentColor" />
            {preview ? "Change" : "Add "} Image
          </Button>
          {/* remove preview image */}
          {preview && (
            <Button
              variant={"outline"}
              type="button"
              onClick={() => setPreview(null)}
            >
              <XIcon className="mr-2" size={16} color="currentColor" />
              Remove
            </Button>
          )}
        </div>
        <div>
          {maxCharacters - postInput.length != maxCharacters && (
            <div className="text-xs text-gray-500">
              {maxCharacters - postInput.length} characters left
            </div>
          )}
        </div>
      </form>
      <hr className="mt-2 border-gray-300" />
    </div>
  );
};

export default PostForm;
