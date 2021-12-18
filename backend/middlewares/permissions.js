const Card = require('../models/card');
const NotFoundError = require('../errors/not_found');
const InvalidData = require('../errors/invalid_data');
const DeleteNotYourCard = require('../errors/delete_not_your_card');

module.exports.permissionCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        next();
      } else {
        throw new DeleteNotYourCard('Your not the Onwer of this Card');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new InvalidData('Invalid data passed to the methods');
      }
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('There is no card with the requested ID');
      }
    })
    .catch(next);
};
