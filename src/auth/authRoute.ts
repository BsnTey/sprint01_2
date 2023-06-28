import { Router, Request, Response } from "express";
import { checkAuthRoute } from "./schema";
import { authService } from "./service/auth-service";
import { inputValidationMiddleware } from "../middleware/input-validation-middleware";

export const authRoute = Router({});

authRoute.post("/login", checkAuthRoute, inputValidationMiddleware, async (req: Request, res: Response) => {
  const loginOrPass = req.body.loginOrEmail;
  const password = req.body.password;
  const auth = await authService.loginUser(loginOrPass, password);
  if (auth) return res.sendStatus(204);
  return res.sendStatus(401);
});
