// src/models/Coupon.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ICupon extends Document {
  code: string;
  discount: number; 
  isActive: boolean; 
  expirationDate?: Date; 
}

const CuponSchema: Schema = new Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true }, 
  isActive: { type: Boolean, default: true },
  expirationDate: { type: Date }, 
});

export default mongoose.model<ICupon>("Cupon", CuponSchema);
