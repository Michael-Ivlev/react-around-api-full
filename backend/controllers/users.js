const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const NotFoundError = require("../errors/not_found");
const InvalidData = require("../errors/invalid_data");
const AuthError = require("../errors/auth_error");
const EmailAlreadyExists = require("../errors/email_already_exists");
const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .orFail()
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        throw new AuthError(`no users in database or no such document${err}`);
      }
    })
    .catch(next);
};

module.exports.getUsersById = (req, res, next) => {
  User.findById(req.params.id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        throw new NotFoundError("No user found with that id");
      }
      if (err.name === "DocumentNotFoundError") {
        throw new NotFoundError("There is no user with the requested ID");
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({
        email,
        password: hash,
        name,
        about,
        avatar,
      })
        .then((user) => res.send(user))
        .catch((err) => {
          if (err.message.includes("E11000 duplicate key error collection")) {
            throw new EmailAlreadyExists("User with this Email already exist");
          }
          if (err.name === "ValidationError" || err.name === "SyntaxError") {
            throw new InvalidData(
              "invalid data passed to the methods. check your url and that you pass name and about"
            );
          }
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.updateUserInfo = (req, res, next) => {
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
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new InvalidData("invalid data passed to the methods");
      }
      if (err.name === "DocumentNotFoundError") {
        throw new NotFoundError(
          `no users in database or no such document ${err.name}`
        );
      }
    })
    .catch(next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  if (!avatar) {
    throw new InvalidData("invalid data passed to the method no avatar");
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
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        throw new NotFoundError(
          `no users in database or no such document ${err.name}`
        );
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        throw new AuthError("Incorrect password or email");
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new AuthError("Incorrect password or email");
        }
        const token = jwt.sign(
          { _id: user._id },
          NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
          {
            expiresIn: "7 days",
          }
        );
        res.send({ token });
      });
    })
    .catch(next);
};

module.exports.currentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        throw new InvalidData("No user found with that id");
      }
      if (err.name === "DocumentNotFoundError") {
        throw new NotFoundError("There is no user with the requested ID");
      }
    })
    .catch(next);
};
