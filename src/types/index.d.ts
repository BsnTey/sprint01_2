import { Request } from 'express';

declare module 'express' {
  export interface Request {
    userId: string;
    user: string;
  }
}

declare global {
  namespace Express {
    export interface Request {
      userId: string;
      user: string;
    }
  }
}
