import { Router, Request, Response } from "express";
import { inputValidationMiddleware, isAuthMiddleware, isExistIdUserMiddleware } from "../..//middleware/input-validation-middleware";
import { checkUserRoute } from "./schema";
import { usersService } from "./service/users-service";
import { QueryParams } from "../../types";
import { getQueryFromReqUser } from "../../utils";
import { userQueryRepository } from "./repository/query-users-repository";

export const userRoute = Router({});

userRoute.post("/", isAuthMiddleware, checkUserRoute, inputValidationMiddleware, async (req: Request, res: Response) => {
  const userId = await usersService.createUser(req.body.login, req.body.email, req.body.password, true);
  if (!userId) return res.sendStatus(520);

  const user = await usersService.getUserById(userId);
  if (!user) return res.sendStatus(520);

  if (user) return res.status(201).send(user);
});

userRoute.get("/", isAuthMiddleware, async (req: Request, res: Response) => {
  const queryParams: QueryParams = getQueryFromReqUser(req.query);
  const users = await userQueryRepository.findAllUsers(queryParams);
  return res.json(users);
});

userRoute.delete("/:id", isAuthMiddleware, isExistIdUserMiddleware, async (req: Request, res: Response) => {
  const result = await usersService.deleteUser(req.params.id);
  const status = result ? 204 : 404;
  return res.sendStatus(status);
});
