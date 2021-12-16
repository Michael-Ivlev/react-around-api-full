const mongoose = require("mongoose");
var validator = require("validator");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  name: {
    type: String,
    default: "Jacques Cousteau",
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: "Explorer",
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: "https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg",
    validate: {
      validator(v) {
        // eslint-disable-next-line
        return /(^https:\/\/|http:\/\/)(?:www\.)?([a-z]|[A-Z]|[0-9]|[-._~:/?%#\[\]@!$&'()*+,;=])(?:#)?/g.test(
          v
        );
      },
      message: "URL is not a valid !",
    },
  },
});

// create the model and export it
module.exports = mongoose.model("user", userSchema);
