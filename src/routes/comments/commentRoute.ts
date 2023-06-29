import { Router, Request, Response } from "express";
import { authBearerMiddleware, inputValidationMiddleware, isCommentOwnerMiddleware, isExistIdCommentMiddleware } from "../../middleware/input-validation-middleware";
import { commentsService } from "./service/comments-service";
import { checkCommentRoute } from "./schema";

export const commentRoute = Router({});

commentRoute.get("/:id", isExistIdCommentMiddleware, async (req: Request, res: Response) => {
  const findComment = req.body.comment;
  return res.status(200).send(findComment);
});

commentRoute.put(
  "/:id",
  authBearerMiddleware,
  isExistIdCommentMiddleware,
  isCommentOwnerMiddleware,
  checkCommentRoute,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const result = await commentsService.updateComment(req.params.id, req.body.content);
    const status = result ? 204 : 404;
    return res.sendStatus(status);
  }
);

commentRoute.delete("/:id", authBearerMiddleware, isExistIdCommentMiddleware, isCommentOwnerMiddleware, async (req: Request, res: Response) => {
  const result = await commentsService.deleteComment(req.params.id);
  const status = result ? 204 : 404;
  return res.sendStatus(status);
});
