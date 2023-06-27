import { Router, Request, Response } from "express";
import { checkAuthRoute } from "./schema";
import { authService } from "./service/auth-service";

export const authRoute = Router({});

authRoute.post("/login", checkAuthRoute, async (req: Request, res: Response) => {
  const loginOrPass = req.body.loginOrEmail;
  const password = req.body.password;
  const auth = await authService.loginUser(loginOrPass, password);
  if (auth) return res.sendStatus(204);
  return res.sendStatus(401);
});
