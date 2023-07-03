import { Router, Request, Response } from "express";
import { checkAuthCodeRoute, checkAuthEmailRoute, checkAuthRoute, isExistUserAuthRoute } from "./schema";
import { authService } from "./service/auth-service";
import { authBearerMiddleware, chekTokenInArray, inputValidationMiddleware, verifyTokenRefresh } from "../../middleware/input-validation-middleware";
import { userQueryRepository } from "../users/repository/query-users-repository";

export const authRoute = Router({});
const secureHttp = false;

authRoute.post("/registration", isExistUserAuthRoute, inputValidationMiddleware, async (req: Request, res: Response) => {
  const resAuth = await authService.registerUser(req.body.login, req.body.email, req.body.password);
  if (resAuth) return res.sendStatus(204);
  return res.sendStatus(500);
});

authRoute.post("/login", checkAuthRoute, inputValidationMiddleware, async (req: Request, res: Response) => {
  const { loginOrEmail, password } = req.body;
  const resTokens = await authService.loginUser(loginOrEmail, password);

  if (resTokens) {
    res.cookie("refreshToken", resTokens.refreshToken, {
      httpOnly: true,
      secure: secureHttp,
    });
    return res.status(200).json({ accessToken: resTokens.accessToken });
  }
  return res.sendStatus(401);
});

authRoute.post("/refresh-token", verifyTokenRefresh, chekTokenInArray, async (req: Request, res: Response) => {
  const userId = req.userId;
  const refreshToken = req.cookies.refreshToken;
  const tokenss = await userQueryRepository.findUserById(userId);
  console.log("Before refresh", tokenss?.tokenData.refreshTokens);

  const tokens = await authService.doTokens(userId);
  if (!tokens) return res.sendStatus(500);

  const resDel = await authService.removeRefresh(userId, refreshToken);
  if (!resDel) return res.sendStatus(500);

  const tokensss = await userQueryRepository.findUserById(userId);
  console.log("After refresh", tokensss?.tokenData.refreshTokens);

  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: secureHttp,
  });
  return res.status(200).json({ accessToken: tokens.accessToken });
});

authRoute.post("/logout", verifyTokenRefresh, chekTokenInArray, async (req: Request, res: Response) => {
  const userId = req.userId;
  const refreshToken = req.cookies.refreshToken;

  const resDel = await authService.removeRefresh(userId, refreshToken);
  if (!resDel) return res.sendStatus(500);

  return res.sendStatus(204);
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
    email: req.user.accountData.email,
    login: req.user.accountData.login,
    userId: req.user._id.toString(),
  });
});
