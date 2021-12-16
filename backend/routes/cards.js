const cardsRouter = require("express").Router();
const {
  getCards,
  removeCardById,
  addCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");
const auth = require("../middlewares/auth");
// const permissions = require("../middlewares/permissions");
const { permissionCard } = require("../middlewares/permissions");

cardsRouter.get("/cards", getCards);

cardsRouter.delete("/cards/:cardId", auth, permissionCard, removeCardById);

cardsRouter.post("/cards", auth, addCard);

cardsRouter.put("/cards/:cardId/likes", auth, likeCard);

cardsRouter.delete("/cards/:cardId/likes", auth, dislikeCard);

module.exports = cardsRouter;
