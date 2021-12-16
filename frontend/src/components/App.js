import "../index.css";
import { Header } from "./Header";
import { Main } from "./Main";
import { Footer } from "./Footer";
import { PopupWithForm } from "./PopupWithForm";
import { ImagePopup } from "./ImagePopup";
import React, { useState } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import api from "../utils/api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { EditProfilePopup } from "./EditProfilePopup";
import { EditAvatarPopup } from "./EditAvatarPopup";
import { AddPlacePopup } from "./AddPlacePopup";
import ProtectedRoute from "./ProtectedRoute.js";
import { Login } from "./Login";
import { Register } from "./Register";
import { InfoTooltip } from "./InfoTooltip";
import * as auth from "../utils/auth.js";

function App() {
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [currenEmail, setcurrenEmail] = useState("");
  const history = useHistory();
  const token = localStorage.getItem("jwt");

  React.useEffect(() => {
    if (token) {
      auth
        .checkToken(token)
        .then((res) => {
          if (res) {
            setLoggedIn(true);
            history.push("/");
            setcurrenEmail(res.data.email);
          }
        })
        .catch((err) => console.log(err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    api
      .getInitialCards()
      .then((res) => {
        setCards(res);
      })
      .catch((err) => console.log(err));
  }, []);

  React.useEffect(() => {
    api
      .getUserInfo()
      .then((res) => {
        setCurrentUser(res.data);
      })
      .catch((err) => console.log(err));
  }, []);
  console.log(currentUser);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isCardPopupOpen, setIsCardPopupOpen] = useState(false);
  const [isInfoTooltip, setInfoTooltip] = useState(false);
  const [isInfoTooltipSuccsess, setInfoTooltipSuccsess] = useState(false);

  function handleCardLike(card) {
    // Check one more time if this card was already liked
    const isLiked = card.likes.some((item) => item._id === currentUser._id);
    // Send a request to the API and getting the updated card data
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((item) => (item._id === card._id ? newCard : item))
        );
      })
      .catch((err) => console.log(err));
  }

  function handleCardDelete(card) {
    // check one more time if the onwer of the image
    const isOwn = card.owner._id === currentUser._id;
    if (isOwn) {
      api
        .removeCard(card._id)
        .then(() => {
          const newCardList = cards.filter((item) => !(item._id === card._id));
          setCards(newCardList);
        })
        .catch((err) => console.log(err));
    }
  }

  function handleAddPlaceSubmit(props) {
    api
      .addNewCard(props.name, props.link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleUserRegister(props) {
    auth
      .signup(props.email, props.password)
      .then(() => {
        setInfoTooltipSuccsess(true);
      })
      .catch((err) => {
        console.log(err);
        setInfoTooltipSuccsess(false);
      })
      .finally(() => setInfoTooltip(true));
  }

  function onLogin(props) {
    auth
      .signin(props.password, props.email)
      .then((res) => {
        if (res.token) {
          localStorage.setItem("jwt", res.token);
          setcurrenEmail(props.email);
          setLoggedIn(true);
          history.push("/");
        }
      })
      .catch((err) => console.log(err));
  }

  function onSignOut(props) {
    localStorage.removeItem("jwt");
    history.push("/signin");
  }

  function handleCardClick(card) {
    setSelectedCard(card);
    setIsCardPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsCardPopupOpen(false);
    setSelectedCard({});
    setInfoTooltip(false);
  }

  function handleUpdateUser(props) {
    api
      .setUserInfo(props.name, props.about)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleAvatarUpdate(props) {
    api
      .setAvatarImage(props.avatar)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="page">
      <div className="page__container">
        <InfoTooltip
          isOpen={isInfoTooltip}
          onClose={closeAllPopups}
          isSuccsess={isInfoTooltipSuccsess}
        />
        <Switch>
          <Route path="/signin">
            <Header buttonTitle="Sign Up" linkPath="/signup" />
            <Login handleLogin={onLogin} />
            <Footer />
          </Route>

          <Route path="/signup">
            <Header buttonTitle="Sign In" linkPath="/signin" />
            <Register handleRegister={handleUserRegister} />
            <Footer />
          </Route>

          <ProtectedRoute
            strict
            path="/"
            loggedIn={loggedIn}
            redirectTo="/signin"
          >
            <CurrentUserContext.Provider value={currentUser}>
              <EditProfilePopup
                isOpen={isEditProfilePopupOpen}
                onClose={closeAllPopups}
                onUpdateUser={handleUpdateUser}
              ></EditProfilePopup>
              <EditAvatarPopup
                isOpen={isEditAvatarPopupOpen}
                onClose={closeAllPopups}
                onUpdateAvatar={handleAvatarUpdate}
              />
              <AddPlacePopup
                isOpen={isAddPlacePopupOpen}
                onClose={closeAllPopups}
                onNewCard={handleAddPlaceSubmit}
              ></AddPlacePopup>
              <PopupWithForm
                name="delete"
                title="Are you sure?"
                buttonText="Yes"
              ></PopupWithForm>
              <ImagePopup
                isOpen={isCardPopupOpen}
                onClose={closeAllPopups}
                card={selectedCard}
              />
              <Header
                email={currenEmail}
                buttonTitle="Sign out"
                onSignOut={onSignOut}
              />
              <Main
                onEditProfileClick={handleEditProfileClick}
                onAddPlaceClick={handleAddPlaceClick}
                onEditAvatarClick={handleEditAvatarClick}
                onCardClick={handleCardClick}
                cards={cards}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
              ></Main>
              <Footer />
            </CurrentUserContext.Provider>
          </ProtectedRoute>
        </Switch>
      </div>
    </div>
  );
}

export default App;
