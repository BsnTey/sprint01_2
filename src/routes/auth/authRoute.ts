import { Router, Request, Response } from "express";
import { checkAuthRoute } from "./schema";
import { authService } from "./service/auth-service";
import { authBearerMiddleware, inputValidationMiddleware } from "../../middleware/input-validation-middleware";

export const authRoute = Router({});

authRoute.post("/login", checkAuthRoute, inputValidationMiddleware, async (req: Request, res: Response) => {
  const loginOrPass = req.body.loginOrEmail;
  const password = req.body.password;
  const resAuth = await authService.loginUser(loginOrPass, password);
  if (resAuth) return res.status(200).json(resAuth);
  return res.sendStatus(401);
});

authRoute.get("/me", authBearerMiddleware, async (req: Request, res: Response) => {
  return res.status(200).json({
    email: req.body.user.email,
    login: req.body.user.login,
    userId: req.body.user._id.toString(),
  });
});
