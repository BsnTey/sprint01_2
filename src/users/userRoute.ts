import { Router, Request, Response } from "express";
import { inputValidationMiddleware, isAuthMiddleware } from "../middleware/input-validation-middleware";
import { checkUserRoute } from "./schema";
import { usersService } from "./service/users-service";

export const userRoute = Router({});

userRoute.post("/", isAuthMiddleware, checkUserRoute, inputValidationMiddleware, async (req: Request, res: Response) => {
  const user = await usersService.createUser(req.body);
  if (user) return res.status(201).send(user);
  return res.sendStatus(520);
});
