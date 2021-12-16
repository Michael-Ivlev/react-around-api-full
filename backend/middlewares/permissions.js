const Card = require("../models/card");

module.exports.permissionCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        next();
      } else {
        return res
          .status(401)
          .send({ message: "Your not the Onwer of this Card" });
      }
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
          .send({ message: "There is no card with the requested ID" });
      }
      return res
        .status(ERROR_CODE)
        .send({ message: `${err}An error has occurred` });
    });
};
