import PostFeed from "@/components/PostFeed";
import PostForm from "@/components/PostForm";
import UserInformation from "@/components/UserInformation";
import connectDB from "@/mongodb/db";
import { Post } from "@/mongodb/models/post";
import { SignedIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  await connectDB();

  const posts = await Post.getAllPosts();
  console.log(posts);
  return (
    <div className="grid grid-cols-8 mt-5 sm:px-5 ">
      <section className=" hidden md:inline md:col-span-2">
        <UserInformation posts={posts} />
      </section>

      <section className="col-span-full md:col-span-6 xl:col-span-4 xl:max-w-xl mx-auto w-full ">
        {/* post form */}
        <SignedIn>
          <PostForm />
        </SignedIn>
        <PostFeed posts={posts} />
      </section>

      <section className="hidden xl:inline justify-center col-span-2 ">
        {/* right widget */}
        <div className="ml-6 h-[790px]">
          <p className="text-sm pb-2 text-left">
            Checkout my{" "}
            <Link
              href="https://felixrunye.com"
              className="text-blue-600 underline"
            >
              Website
            </Link>
          </p>
          <iframe
            src="https://felixrunye.com"
            title="Embedded post"
            className="w-fit 2xl:min-w-[400px] h-full"
          ></iframe>
        </div>
      </section>
    </div>
  );
}
