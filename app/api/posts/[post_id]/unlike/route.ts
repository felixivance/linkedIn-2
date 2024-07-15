import connectDB from "@/mongodb/db";
import { Post } from "@/mongodb/models/post";
import { NextResponse } from "next/server"

export interface UnlikePostRequestBody {
    userId: string;
  }

export async function POST(request: Request, { params }: { params: {post_id : string}}){

    try{
        await connectDB();

        const { userId } : UnlikePostRequestBody = await request.json();

        const post = await Post.findById(params.post_id);

        if(!post){
            return NextResponse.json({ error: " Post not found "}, { status: 404})
        }

        await post.unlikePost(userId);

        return NextResponse.json({ message: "post un liked successfully"})
    }catch(err: any){
        return NextResponse.json(
            { error: "An error occurred fetching the post ", err},
            { status: 500}
        )
    }
}
