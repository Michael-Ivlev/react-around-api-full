const cardsRouter = require("express").Router();
const { celebrate, Joi, Segments } = require("celebrate");
const validator = require("validator");
const {
  getCards,
  removeCardById,
  addCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");
const auth = require("../middlewares/auth");
const { permissionCard } = require("../middlewares/permissions");

// custom Url celebrate validator
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

cardsRouter.get("/cards", auth, getCards);

cardsRouter.delete(
  "/cards/:cardId",
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      cardId: Joi.string().alphanum().required(),
    }),
  }),
  auth,
  permissionCard,
  removeCardById
);

cardsRouter.post(
  "/cards",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().alphanum().min(3).max(30).required(),
      link: Joi.string().required().custom(validateURL),
    }),
  }),
  auth,
  addCard
);

cardsRouter.put(
  "/cards/likes/:cardId",
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      cardId: Joi.string().alphanum().required(),
    }),
  }),
  auth,
  likeCard
);

cardsRouter.delete(
  "/cards/likes/:cardId",
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      cardId: Joi.string().alphanum().required(),
    }),
  }),
  auth,
  dislikeCard
);

// cardsRouter.put(
//   '/cards/:cardId/likes',
//   celebrate({
//     [Segments.PARAMS]: Joi.object().keys({
//       cardId: Joi.string().alphanum().required(),
//     }),
//   }),
//   auth,
//   likeCard,
// );

// cardsRouter.delete(
//   '/cards/:cardId/likes',
//   celebrate({
//     [Segments.PARAMS]: Joi.object().keys({
//       cardId: Joi.string().alphanum().required(),
//     }),
//   }),
//   auth,
//   dislikeCard,
// );

module.exports = cardsRouter;
