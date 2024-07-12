import connectDB from "@/mongodb/db";
import { Post } from "@/mongodb/models/post";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(request: Request, { params }: {params: {post_id : string }}){

    try{
        await connectDB();
        const post = await Post.findById(params.post_id);

        if(!post){
            return NextResponse.json({ error: "Post not found "}, { status: 404})
        }

        return NextResponse.json(post);
    }catch(err: any){
        return NextResponse.json(
            { error: "An error occurred fetching the post ", err},
            { status: 500}
        )
    }
}

export  interface DeletePostRequestBody{
    userId: string;
}

export async function DELETE( request: Request, { params }: { params: {post_id: string}}){
    auth().protect();

    try{
        await connectDB();
        const { userId }: DeletePostRequestBody = await request.json();

        const post = await Post.findById(params.post_id);

        if(!post){
            return NextResponse.json({ error: "Post not found"}, { status: 404});
        }

        if(post.user.userId !== userId){
            throw new Error("Post does not belong to the user");
        }

        await post.removePost();

        return NextResponse.json({ message: "Post deleted successfully"});

    }catch(err: any){
        return NextResponse.json(
            { error: "An error occurred deleting the post ", err},
            { status: 500}
        )
    }
}