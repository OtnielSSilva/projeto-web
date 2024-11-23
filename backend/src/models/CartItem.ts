import { Schema, model, Document } from 'mongoose';

interface CartItemDocument extends Document {
  user: Schema.Types.ObjectId;
  game: Schema.Types.ObjectId;
  quantity: number;
  addedAt: Date;
}

const CartItemSchema = new Schema<CartItemDocument>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  game: { type: Schema.Types.ObjectId, ref: 'Game', required: true },
  quantity: { type: Number, default: 1 },
  addedAt: { type: Date, default: Date.now },
});

export const CartItem = model<CartItemDocument>('CartItem', CartItemSchema);
