import { Request } from "express";

declare module "express" {
  export interface Request {
    userId: string;
    user: WithId<UserDatabase>;
  }
}

declare global {
  namespace Express {
    export interface Request {
      userId: string;
      user: WithId<UserDatabase>;
    }
  }
}
