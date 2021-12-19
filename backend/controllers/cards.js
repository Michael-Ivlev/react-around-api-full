const Card = require("../models/card");
const NotFoundError = require("../errors/not_found");
const InvalidData = require("../errors/invalid_data");
const User = require("../models/user");

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(["owner", "likes"])
    .orFail()
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        throw new NotFoundError(
          `no cards in database or no such document${err}`
        );
      }
    })
    .catch(next);
};

module.exports.removeCardById = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then((user) => res.send({ message: `${user._id}has been deleted` }))
    .catch((err) => {
      if (err.name === "CastError") {
        throw new InvalidData("Invalid data passed to the methods");
      }
      if (err.name === "DocumentNotFoundError") {
        throw new NotFoundError("There is no card with the requested ID");
      }
    })
    .catch(next);
};

module.exports.addCard = (req, res, next) => {
  const { name, link } = req.body;
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      Card.create({ name, link, owner: user })
        .then((card) => res.send(card))
        .catch((err) => {
          if (err.name === "ValidationError" || err.name === "SyntaxError") {
            throw new InvalidData(
              "invalid data passed to the methods. check your url and that you pass, name and link"
            );
          }
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "SyntaxError") {
        throw new InvalidData(
          "invalid data passed to the methods. check your Id and that you pass, name and link"
        );
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .populate(["owner", "likes"])
    .orFail()
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        throw new InvalidData("Invalid data passed to the methods");
      }
      if (err.name === "DocumentNotFoundError") {
        throw new NotFoundError("No card found with that id");
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .populate(["owner", "likes"])
    .orFail()
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        throw new InvalidData("Invalid data passed to the methods");
      }
      if (err.name === "DocumentNotFoundError") {
        throw new NotFoundError("No card found with that id");
      }
    })
    .catch(next);
};
