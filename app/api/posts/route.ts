import { IUser } from "@/types/user";
import connectDB from "@/mongodb/db";
import { IPostBase, Post } from "@/mongodb/models/post";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";


export interface AddPostRequestBody{
    user: IUser;
    text: string;
    imageUrl?:string |null
}

export async function POST(request: Request){
    auth().protect(); // protect with clerk authentication
    const { user, text, imageUrl }: AddPostRequestBody = await request.json();

    try{
        await connectDB();

        const postData: IPostBase = {
            user, text, ...(imageUrl && {imageUrl})
        };

        const post = await Post.create(postData);
        return NextResponse.json({ message: "Post created successfully", post});
    }catch(error){
        return NextResponse.json(
            { error: `An error occurred while creating the post ${error}`},
            { status : 500}
        )
    }

}



export async function GET(request:Request){
    try{
        await connectDB();
        const posts = await Post.getAllPosts();
        return NextResponse.json(posts);
    }catch(error){
        return NextResponse.json(
            {
            error: "An error occurred while fetching posts"
            },
            {status: 500}
        )
    }
}