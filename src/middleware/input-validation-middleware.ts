import { Request, Response } from "express";
import { NextFunction } from "express";
import { validationResult } from "express-validator";

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const reformattedErrors = errors.array({ onlyFirstError: true }).map((err) => {
      // @ts-ignore
      return { message: err.msg, field: err.path };
    });

    res.status(400).json({ errorsMessages: reformattedErrors });
  } else {
    next();
  }
};

export const isAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader: string | undefined = req.headers.authorization;
  if (authHeader !== "Basic YWRtaW46cXdlcnR5") {
    res.sendStatus(401);
    return;
  } else {
    next();
  }
};
