import { IUser } from './user';

export interface IComment {
  _id: string;
  user: IUser;
  content: string;
  createdAt: string; // ou Date, dependendo de como está vindo do backend
  updatedAt: string; // ou Date
}