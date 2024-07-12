import connectDB from "@/mongodb/db";
import { Post } from "@/mongodb/models/post";
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