import { checkSchema } from "express-validator";
import { userQueryRepository } from "../users/repository/query-users-repository";

export const checkAuthRoute = checkSchema({
  loginOrEmail: {
    trim: true,
    notEmpty: true,
    isString: true,
  },
  password: {
    trim: true,
    notEmpty: true,
    isString: true,
  },
});

export const isExistUserAuthRoute = checkSchema({
  login: {
    trim: true,
    notEmpty: true,
    isString: true,
    isLength: { options: { min: 3, max: 30 } },
    matches: {
      options: [/^(?=.*[a-z])[a-zA-Z0-9_-]*$/],
    },
    custom: {
      options: async (id, { req }) => {
        const isLogin = await userQueryRepository.findUserByLogin(req.login);
        if (isLogin) {
          throw new Error("Login is exist");
        }
      },
    },
  },
  password: {
    trim: true,
    notEmpty: true,
    isString: true,
    isLength: { options: { min: 6, max: 20 } },
    matches: {
      options: [/^(?=.*[a-z])[a-zA-Z0-9]*$/],
    },
  },
  email: {
    trim: true,
    notEmpty: true,
    isString: true,
    matches: {
      options: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i,
    },
    custom: {
      options: async (id, { req }) => {
        const user = await userQueryRepository.findUserByEmail(req.email);
        if (user) {
          throw new Error("Email is exist");
        }
      },
    },
  },
});

export const checkAuthCodeRoute = checkSchema({
  code: {
    trim: true,
    notEmpty: true,
    isUUID: true,
  },
});

export const checkAuthEmailRoute = checkSchema({
  email: {
    trim: true,
    notEmpty: true,
    isString: true,
    matches: {
      options: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i,
    },
    custom: {
      options: async (id, { req }) => {
        const user = await userQueryRepository.findUserByEmail(req.email);
        if (!user) {
          throw new Error("User with email is not found");
        }
        if (user.emailConfirmation.isConfirmed) {
          throw new Error("Email has already been confirmed");
        }
        req.user.body = user;
      },
    },
  },
});
