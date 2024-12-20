import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  photoUrl: string;
  wishlist: mongoose.Types.ObjectId[];
}

const userSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  photoUrl: { type: String },
  wishlist: [
    {
      type: Schema.Types.ObjectId,
      ref: "Game",
    },
  ],
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
