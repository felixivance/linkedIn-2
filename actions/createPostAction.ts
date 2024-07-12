"use server";

import { AddPostRequestBody } from "@/app/api/posts/route";
import { Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { currentUser } from "@clerk/nextjs/server";

export default async function createPostAction(formData: FormData){
    
    const user = await currentUser();

    if(!user){
        throw new Error("User not authenticated");
    }

    const postInput = formData.get("postInput") as string;
    const image = formData.get("image") as File;
    let ImageUrl: string | undefined;

    if(!postInput){
        throw new Error("post input is required");
    }

    try{
        // define user
        const userDB: IUser = {
            userId: user.id,
            userImage: user.imageUrl,
            firstName: user.firstName || "",
            lastName: user.lastName || "",
        }
        // upload image

        if(image.size > 0){
            console.log("uploading image to azure")

            const body: AddPostRequestBody = {
                user: userDB,
                text: postInput
            }

            await Post.create(body);
        }else{
            // create post without image
            const body : AddPostRequestBody = {
                user: userDB,
                text: postInput
            }
            await Post.create(body);
        }
    }catch(error:any){
        console.log("failed to create post ",error);
    }

    

    // create post in db

    // revalidate path '/' - home page
    
}