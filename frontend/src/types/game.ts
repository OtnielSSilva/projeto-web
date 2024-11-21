export interface IGame {
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
}
