import connectDB from "@/mongodb/db";
import { Post } from "@/mongodb/models/post";
import { NextResponse } from "next/server";


export async function GET(request: Request, { params } : { params: { post_id : string }}){
    try{

        await connectDB();

        const post = await Post.findById(params.post_id);

        if(!post){
            return NextResponse.json({ error: " Post not found" }, { status: 404});
        }

        const likes = post.likes;

        return NextResponse.json(likes);
        
    }catch(err: any){
        return NextResponse.json(
            { error: "An error occurred fetching the likes ", err},
            { status: 500}
        )
    }
}

export interface LikePostRequestBody{
    userId: string
}

export async function POST(request: Request, { params } : { params: { post_id : string }}){
    try{
        await connectDB();

        const { userId }: LikePostRequestBody = await request.json();

        const post = await Post.findById(params.post_id);

        if(!post){
            return NextResponse.json({ error: " Post not found "}, { status: 404})
        }

        await post.likePost(userId)

        return NextResponse.json({ message: "Post liked successfully"});

    }catch(err: any){
        return NextResponse.json(
            { error: "An error occurred adding likes to the post", err},
            { status: 500}
        )
    }
}