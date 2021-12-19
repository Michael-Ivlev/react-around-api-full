const userRouter = require("express").Router();
const { celebrate, Joi, Segments } = require("celebrate");
const validator = require("validator");
const {
  getUsers,
  updateUserInfo,
  updateUserAvatar,
  createUser,
  login,
  currentUser,
} = require("../controllers/users");
const auth = require("../middlewares/auth");

// custom Url celebrate validator
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

userRouter.get("/users", auth, getUsers);

userRouter.patch(
  "/users/me",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().min(3).max(30).required(),
      about: Joi.string().min(3).max(30).required(),
    }),
  }),
  auth,
  updateUserInfo
);

userRouter.patch(
  "/users/me/avatar",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      avatar: Joi.string().required().custom(validateURL),
    }),
  }),
  auth,
  updateUserAvatar
);

userRouter.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

userRouter.post(
  "/signin",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8),
    }),
  }),
  login
);

userRouter.post(
  "/signup",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser
);

userRouter.get(
  "/users/me",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      _id: Joi.string().alphanum().required(),
    }),
  }),
  auth,
  currentUser
);

module.exports = userRouter;
