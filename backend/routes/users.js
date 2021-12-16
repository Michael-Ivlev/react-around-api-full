const userRouter = require("express").Router();
const {
  getUsers,
  getUsersById,
  updateUserInfo,
  updateUserAvatar,
  createUser,
  login,
  currentUser,
} = require("../controllers/users");
const auth = require("../middlewares/auth");

userRouter.get("/users", auth, getUsers);

// userRouter.get("/users/:id", getUsersById);

userRouter.patch("/users/me", auth, updateUserInfo);

userRouter.patch("/users/me/avatar", auth, updateUserAvatar);

userRouter.post("/signin", login);

userRouter.post("/signup", createUser);

userRouter.get("/users/me", auth, currentUser);

module.exports = userRouter;
