import dotenv from "dotenv";
dotenv.config();

export const port = process.env.PORT || 5000;
export const uri_mongo = process.env.URI_MONGO;
export const jwt_secret = process.env.JWT_SECRET || "fsdff";
