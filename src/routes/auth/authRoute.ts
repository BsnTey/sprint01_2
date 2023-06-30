import { Router, Request, Response } from "express";
import { checkAuthCodeRoute, checkAuthEmailRoute, checkAuthRoute, isExistUserAuthRoute } from "./schema";
import { authService } from "./service/auth-service";
import { authBearerMiddleware, inputValidationMiddleware } from "../../middleware/input-validation-middleware";

export const authRoute = Router({});

authRoute.post("/registration", isExistUserAuthRoute, inputValidationMiddleware, async (req: Request, res: Response) => {
  const resAuth = await authService.registerUser(req.body.login, req.body.email, req.body.password);
  if (resAuth) return res.sendStatus(204);
  return res.sendStatus(500);
});

authRoute.post("/login", checkAuthRoute, inputValidationMiddleware, async (req: Request, res: Response) => {
  const loginOrEmail = req.body.loginOrEmail;
  const password = req.body.password;
  const resAuth = await authService.loginUser(loginOrEmail, password);
  if (resAuth) return res.status(200).json(resAuth);
  return res.sendStatus(401);
});

authRoute.get("/confirm-email/", checkAuthCodeRoute, inputValidationMiddleware, async (req: Request, res: Response) => {
  const code = req.query.code;
  const resAuth = await authService.confirmEmail(code!.toString());
  if (resAuth) return res.send("<h1>Email подтвержден</h1>");
  return res.send("<h1>Email Не был подтвержден</h1>");
});

authRoute.post("/registration-confirmation", checkAuthCodeRoute, inputValidationMiddleware, async (req: Request, res: Response) => {
  const code = req.body.code;
  const resAuth = await authService.confirmEmail(code);
  if (resAuth) return res.sendStatus(204);
  return res.sendStatus(400);
});

authRoute.post("/registration-email-resending", checkAuthEmailRoute, inputValidationMiddleware, async (req: Request, res: Response) => {
  const user = req.body.user;
  const reWriteRes = await authService.reSendEmail(user);
  if (reWriteRes) return res.sendStatus(204);
  return res.sendStatus(400);
});

authRoute.get("/me", authBearerMiddleware, async (req: Request, res: Response) => {
  return res.status(200).json({
    email: req.body.user.email,
    login: req.body.user.login,
    userId: req.body.user._id.toString(),
  });
});
