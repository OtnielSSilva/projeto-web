import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  wishlist: mongoose.Types.ObjectId[];
}

const userSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Add unique constraint
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  wishlist: [
    {
      type: Schema.Types.ObjectId,
      ref: "Game",
    },
  ], // Add this field
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
