"use server";

import { AddPostRequestBody } from "@/app/api/posts/route";
import { Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export default async function createPostAction(formData: FormData) {
  const user = await currentUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const postInput = formData.get("postInput") as string;
  const image = formData.get("image") as File;
  let ImageUrl: string | undefined;

  if (!postInput) {
    throw new Error("post input is required");
  }

  try {
    // define user
    const userDB: IUser = {
      userId: user.id,
      userImage: user.imageUrl,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
    };
    // upload image

    if (image.size > 0) {
      console.log("uploading image to azure");
      /*
            console.log("Uploading image to Azure Blob Storage...", image);

            const accountName = process.env.AZURE_STORAGE_NAME;

            const sasToken = await generateSASToken();

            const blobServiceClient = new BlobServiceClient(
                `https://${accountName}.blob.core.windows.net?${sasToken}`
            );

            const containerClient =
                blobServiceClient.getContainerClient(containerName);

            // generate current timestamp
            const timestamp = new Date().getTime();
            const file_name = `${randomUUID()}_${timestamp}.png`;

            const blockBlobClient = containerClient.getBlockBlobClient(file_name);

            const imageBuffer = await image.arrayBuffer();
            const res = await blockBlobClient.uploadData(imageBuffer);
            image_url = res._response.request.url;

            console.log("File uploaded successfully!", image_url);
            */

      const body: AddPostRequestBody = {
        user: userDB,
        text: postInput,
      };

      await Post.create(body);
    } else {
      // create post without image
      const body: AddPostRequestBody = {
        user: userDB,
        text: postInput,
      };
      await Post.create(body);
    }
  } catch (error: any) {
    console.log("failed to create post ", error);
  }

  // create post in db

  // revalidate path '/' - home page
  revalidatePath("/");
}
