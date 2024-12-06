import mongoose, { Schema, Document, Types } from "mongoose";

export interface IGame extends Document {
  _id: Types.ObjectId;
  appid: number;
  name: string;
  type: string;
  required_age: number;
  is_free: boolean;
  dlc: number[];
  detailed_description: string;
  about_the_game: string;
  short_description: string;
  supported_languages: string;
  reviews: string;
  header_image: string;
  capsule_image: string;
  capsule_imagev5: string;
  website?: string;
  pc_requirements: {
    minimum: string;
  };
  mac_requirements?: {
    minimum: string;
  };
  linux_requirements?: {
    minimum: string;
  };
  developers: string[];
  publishers: string[];
  packages?: number[];
  platforms: {
    windows: boolean;
    mac: boolean;
    linux: boolean;
  };
  metacritic?: {
    score: number;
    url: string;
  };
  categories: { id: number; description: string }[];
  genres: { id: string; description: string }[];
  screenshots: { id: number; path_thumbnail: string; path_full: string }[];
  movies?: {
    id: number;
    name: string;
    thumbnail: string;
    webm?: { [key: string]: string };
    mp4?: { [key: string]: string };
    highlight: boolean;
  }[];
  recommendations?: {
    total: number;
  };
  release_date: {
    coming_soon: boolean;
    date: string;
  };
  support_info?: {
    url?: string;
    email?: string;
  };
  background?: string;
  background_raw?: string;
  content_descriptors?: {
    ids: number[];
    notes?: string;
  };
  ratings?: {
    [key: string]: {
      rating: string;
      descriptors?: string;
    };
  };
  price_overview?: {
    currency: string;
    initial: number;
    final: number;
    discount_percent: number;
    initial_formatted?: string;
    final_formatted: string;
  };
}

const GameSchema: Schema = new Schema({
  appid: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  required_age: { type: Number, default: 0 },
  is_free: { type: Boolean, required: true },
  dlc: { type: [Number], default: [] },
  detailed_description: { type: String },
  about_the_game: { type: String },
  short_description: { type: String },
  supported_languages: { type: String },
  reviews: { type: String },
  header_image: { type: String },
  capsule_image: { type: String },
  capsule_imagev5: { type: String },
  website: { type: String }, // Campos opcionais não precisam de `required`
  pc_requirements: { minimum: { type: String } },
  mac_requirements: { minimum: { type: String } },
  linux_requirements: { minimum: { type: String } },
  developers: { type: [String] },
  publishers: { type: [String] },
  packages: { type: [Number], default: [] },
  platforms: {
    windows: { type: Boolean },
    mac: { type: Boolean },
    linux: { type: Boolean },
  },
  metacritic: {
    score: { type: Number },
    url: { type: String },
  },
  categories: [
    {
      id: { type: Number },
      description: { type: String },
    },
  ],
  genres: [
    {
      id: { type: String },
      description: { type: String },
    },
  ],
  screenshots: [
    {
      id: { type: Number },
      path_thumbnail: { type: String },
      path_full: { type: String },
    },
  ],
  movies: [
    {
      id: { type: Number },
      name: { type: String },
      thumbnail: { type: String },
      webm: { type: Map, of: String },
      mp4: { type: Map, of: String },
      highlight: { type: Boolean },
    },
  ],
  recommendations: {
    total: { type: Number },
  },
  release_date: {
    coming_soon: { type: Boolean },
    date: { type: String },
  },
  support_info: {
    url: { type: String },
    email: { type: String },
  },
  background: { type: String },
  background_raw: { type: String },
  content_descriptors: {
    ids: { type: [Number] },
    notes: { type: String },
  },
  ratings: { type: Map, of: Object },
  price_overview: {
    currency: { type: String },
    initial: { type: Number },
    final: { type: Number },
    discount_percent: { type: Number },
    initial_formatted: { type: String },
    final_formatted: { type: String },
  },
});

export default mongoose.model<IGame>("Game", GameSchema);
