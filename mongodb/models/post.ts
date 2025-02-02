import mongoose, { Schema, Document, models, Model, Types } from "mongoose";
import { Comment, IComment, ICommentBase } from "./comment";
import { IUser } from "@/types/user";

export interface IPostBase {
  user: IUser;
  text: string;
  imageUrl?: string;
  comments?: IComment[];
  likes?: string[];
}

export interface IPost extends IPostBase, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// define document methods  ( for each instance of a post )

interface IPostMethods {
  likePost(userId: string): Promise<void>;
  unlikePost(userId: string): Promise<void>;
  commentOnPost(comment: ICommentBase): Promise<void>;
  getAllComments(): Promise<IComment[]>;
  removePost(): Promise<void>;
}

interface IPostStatistics {
  getAllPosts(): Promise<IPostDocument[]>;
}

export interface IPostDocument extends IPost, IPostMethods {} // singular instance of a post

interface IPostModel extends IPostStatistics, Model<IPostDocument> {} // all posts

const PostSchema = new Schema<IPostDocument>(
  {
    user: {
      userId: { type: String, required: true },
      userImage: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String },
    },
    text: { type: String, required: true },
    imageUrl: { type: String },
    comments: { type: [Schema.Types.ObjectId], ref: "Comment", default: [] },
    likes: { type: [String] },
  },
  {
    timestamps: true,
  }
);

PostSchema.methods.likePost = async function (userId: string) {
  try {
    await this.updateOne({ $addToSet: { likes: userId } });
  } catch (error) {
    console.log("Failed to like post", error);
  }
};

PostSchema.methods.unlikePost = async function (userId: string) {
  try {
    await this.updateOne({ $pull: { likes: userId } });
  } catch (error) {
    console.log("error unlinking post ", error);
  }
};

PostSchema.methods.removePost = async function () {
  try {
    await this.model("Post").deleteOne({ _id: this._id });
  } catch (error) {
    console.log("error deleting post ", error);
  }
};

PostSchema.methods.commentOnPost = async function (commentToAdd: ICommentBase) {
  try {
    console.log("comment to add", commentToAdd);

    const comment = await Comment.create(commentToAdd);
    console.log("comment created", comment);

    if (!this.comments) {
      this.comments = [];
    }

    this.comments.push(comment._id);
    console.log("comment pushed to post", this.comments);

    await this.save();
    console.log("post saved with new comment");
  } catch (error) {
    console.log("error commenting post ", error);
  }
};

PostSchema.methods.getAllComments = async function () {
  try {
    await this.populate({
      path: "comments",
      options: { sort: { createdAt: -1 } }, // sort comments by newest to first
    });
    return this.comments;
  } catch (error) {
    console.log("error when getting all comments ", error);
  }
};

PostSchema.statics.getAllPosts = async function () {
  try {
    const posts = await this.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "comments",

        options: { sort: { createdAt: -1 } },
      })
      .populate("likes")
      .lean(); // lean() returns a plain JS object instead of a mongoose document

    return posts.map((post: IPostDocument) => ({
      ...post,
      _id: post._id.toString(),
      comments: post.comments?.map((comment: IComment) => ({
        ...comment,
        _id: comment._id.toString(),
      })),
    }));
  } catch (error) {
    console.log("error when getting all posts", error);
  }
};

export const Post =
  (models.Post as IPostModel) ||
  mongoose.model<IPostDocument, IPostModel>("Post", PostSchema);
