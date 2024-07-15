import { IUser } from "@/types/user";
import mongoose, { Schema, Document, models, Model, Types } from "mongoose";

export interface ICommentBase {
  user: IUser;
  text: string;
}

export interface IComment extends Document, ICommentBase {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    user: {
      userId: { type: String, required: true },
      userImage: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String },
    },
    text: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// check if comment is initialised or initialise a new one
export const Comment =
  models.Comment || mongoose.model<IComment>("Comment", commentSchema);
