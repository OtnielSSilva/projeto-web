import mongoose, { Schema, Document, Types } from "mongoose";

export interface IComment extends Document {
  user: Types.ObjectId; 
  game: number; 
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    game: { type: Number, ref: "Game", required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: true, // Adiciona os campos createdAt e updatedAt automaticamente
  }
);

// Índice único para evitar múltiplos comentários do mesmo usuário no mesmo jogo
CommentSchema.index({ user: 1, game: 1 }, { unique: true });

export default mongoose.model<IComment>("Comment", CommentSchema);
