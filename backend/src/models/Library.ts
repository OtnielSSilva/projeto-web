import mongoose, { Schema, Document } from "mongoose";

export interface ILibrary extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  games: mongoose.Schema.Types.ObjectId[]; 
}

const LibrarySchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  games: [{ type: Schema.Types.ObjectId, ref: "Game" }],
});

export default mongoose.model<ILibrary>("Library", LibrarySchema);
