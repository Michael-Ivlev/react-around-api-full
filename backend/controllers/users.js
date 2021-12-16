const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let ERROR_CODE = 500;

module.exports.getUsers = (req, res) => {
  User.find({})
    .orFail()
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        ERROR_CODE = 404;
        return res
          .status(ERROR_CODE)
          .send({ message: `no users in database or no such document${err}` });
      }
      return res
        .status(ERROR_CODE)
        .send({ message: `${err}An error has occurred` });
    });
};

module.exports.getUsersById = (req, res) => {
  User.findById(req.params.id)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        ERROR_CODE = 400;
        return res.status(404).send({ error: "No user found with that id" });
      }
      if (err.name === "DocumentNotFoundError") {
        ERROR_CODE = 404;
        return res
          .status(ERROR_CODE)
          .send({ message: "There is no user with the requested ID" });
      }
      return res
        .status(ERROR_CODE)
        .send({ message: `${err}An error has occurred` });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({
        email: email,
        password: hash,
        name: name,
        about: about,
        avatar: avatar,
      })
        .then((user) => res.send({ data: user }))
        .catch((err) => {
          if (err.name === "ValidationError" || err.name === "SyntaxError") {
            ERROR_CODE = 400;
            return res.status(ERROR_CODE).send({
              message:
                "invalid data passed to the methods. check your url and that you pass name and about",
            });
          }
          return res
            .status(ERROR_CODE)
            .send({ message: `${err}An error has occurred` });
        });
    })
    .catch((err) => res.status(400).send(err));
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      about,
    },
    {
      new: true, // the then handler receives the updated entry as input
      runValidators: true, // the data will be validated before the update
    }
  )
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        ERROR_CODE = 400;
        return res.status(ERROR_CODE).send(err);
      }
      if (err.name === "DocumentNotFoundError") {
        ERROR_CODE = 404;
        return res.status(ERROR_CODE).send({
          message: `no users in database or no such document ${err.name}`,
        });
      }
      return res
        .status(ERROR_CODE)
        .send({ message: `${err}An error has occurred` });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  if (!avatar) {
    ERROR_CODE = 400;
    return res
      .status(ERROR_CODE)
      .send("invalid data passed to the method no avatar");
  }
  return User.findByIdAndUpdate(
    req.user._id,
    {
      avatar,
    },
    {
      new: true, // the then handler receives the updated entry as input
      runValidators: true, // the data will be validated before the update
    }
  )
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        ERROR_CODE = 400;
        return res.status(ERROR_CODE).send(err);
      }
      if (err.name === "DocumentNotFoundError") {
        ERROR_CODE = 404;
        return res.status(ERROR_CODE).send({
          message: `no users in database or no such document ${err.name}`,
        });
      }
      return res
        .status(ERROR_CODE)
        .send({ message: `${err}An error has occurred` });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Incorrect password or email"));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("bad cred"));
        }
        console.log(user._id);
        const token = jwt.sign({ _id: user._id }, "not-so-secret-string", {
          expiresIn: "7 days",
        });
        res.send({ token });
      });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports.currentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        ERROR_CODE = 400;
        return res.status(404).send({ error: "No user found with that id" });
      }
      if (err.name === "DocumentNotFoundError") {
        ERROR_CODE = 404;
        return res
          .status(ERROR_CODE)
          .send({ message: "There is no user with the requested ID" });
      }
      return res
        .status(ERROR_CODE)
        .send({ message: `${err}An error has occurred` });
    });
};
