const res = require("express/lib/response");
const Card = require("../models/card");

let ERROR_CODE = 500;

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(["owner", "likes"])
    .orFail()
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        ERROR_CODE = 404;
        return res
          .status(ERROR_CODE)
          .send({ message: `no cards in database or no such document${err}` });
      }
      return res
        .status(ERROR_CODE)
        .send({ message: `${err}An error has occurred` });
    });
};

module.exports.removeCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then((user) => res.send({ message: `${user._id}has been deleted` }))
    .catch((err) => {
      if (err.name === "CastError") {
        ERROR_CODE = 400;
        return res
          .status(ERROR_CODE)
          .send({ message: "Invalid data passed to the methods" });
      }
      if (err.name === "DocumentNotFoundError") {
        ERROR_CODE = 404;
        return res
          .status(ERROR_CODE)
          .send({ message: "There is no card with the requested ID" });
      }
      return res
        .status(ERROR_CODE)
        .send({ message: `${err}An error has occurred` });
    });
};

module.exports.addCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "SyntaxError") {
        ERROR_CODE = 400;
        return res.status(ERROR_CODE).send({
          message:
            "invalid data passed to the methods. check your url and that you pass, name and link",
        });
      }
      return res
        .status(ERROR_CODE)
        .send({ message: `${err}An error has occurred` });
    });
};

module.exports.likeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail()
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        ERROR_CODE = 400;
        return res
          .status(ERROR_CODE)
          .send({ message: "Invalid data passed to the methods" });
      }
      if (err.name === "DocumentNotFoundError") {
        ERROR_CODE = 404;
        return res
          .status(ERROR_CODE)
          .send({ message: "No card found with that id" });
      }
      return res
        .status(ERROR_CODE)
        .send({ message: `${err}An error has occurred` });
    });

module.exports.dislikeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail()
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        ERROR_CODE = 400;
        return res
          .status(ERROR_CODE)
          .send({ message: "Invalid data passed to the methods" });
      }
      if (err.name === "DocumentNotFoundError") {
        ERROR_CODE = 404;
        return res
          .status(ERROR_CODE)
          .send({ message: "No card found with that id" });
      }
      return res
        .status(ERROR_CODE)
        .send({ message: `${err}An error has occurred` });
    });
