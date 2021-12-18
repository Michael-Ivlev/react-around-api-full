import React from "react";
import { Card } from "./Card";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export function Main(props) {
  const currentUser = React.useContext(CurrentUserContext);
  return (
    <main className="main">
      <section className="profile">
        <div className="profile__container">
          <div className="profile__avatar-container">
            <img
              src={`${currentUser.avatar}`}
              className="profile__avatar"
              alt="Avatar that describe the user"
            />
            <div
              className="profile__avatar-overlay"
              onClick={props.onEditAvatarClick}
            ></div>
          </div>
          <div className="profile__info">
            <div className="profile__info-heading-container">
              <h1 className="profile__info-heading">{`${currentUser.name}`}</h1>
              <button
                type="button"
                className="profile__info-edit hover"
                onClick={props.onEditProfileClick}
              ></button>
            </div>
            <p className="profile__info-description">{`${currentUser.about}`}</p>
          </div>
        </div>
        <button
          type="button"
          className="profile__add-button hover"
          onClick={props.onAddPlaceClick}
        ></button>
      </section>
      <section className="elements">
        {props.cards.map((card) => {
          return (
            <Card
              key={card._id}
              card={card}
              onCardClick={props.onCardClick}
              onCardLike={props.onCardLike}
              onCardDelete={props.onCardDelete}
            />
          );
        })}
      </section>
    </main>
  );
}
