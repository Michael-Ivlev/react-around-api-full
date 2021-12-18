import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export function Card(props) {
  const currentUser = React.useContext(CurrentUserContext);
  // Checking if the current user is the owner of the current card
  const isOwn = props.card.owner._id === currentUser._id;
  // Creating a variable which you'll then set in `className` for the delete button
  const cardDeleteButtonClassName = `element__delete ${
    isOwn ? " element__delete_visible" : "element__delete_hidden"
  }`;

  function handleClick() {
    props.onCardClick(props.card);
  }

  function handleLikeClick() {
    props.onCardLike(props.card);
  }

  function handleDeleteClick() {
    props.onCardDelete(props.card);
  }

  // Check if the card was liked by the current user
  const isLiked = props.card.likes.some((i) => i._id === currentUser._id);

  // Create a variable which you then set in `className` for the like button
  const cardLikeButtonClassName = `${
    isLiked ? "heart-button heart-button_active" : "heart-button"
  }`;

  return (
    <div className="element">
      <button
        className={cardDeleteButtonClassName}
        type="button"
        name="element-delete-button"
        onClick={handleDeleteClick}
      ></button>
      <img
        className="element__img"
        src={`${props.card.link}`}
        alt={`${props.card.name}`}
        onClick={handleClick}
      />
      <div className="element__container">
        <h2 className="element__container-heading">{`${props.card.name}`}</h2>
        <div className="element__container-heartbutton">
          <button
            className={cardLikeButtonClassName}
            type="button"
            name="heart-button"
            onClick={handleLikeClick}
          ></button>
          <p className="image-likes">{`${props.card.likes.length}`}</p>
        </div>
      </div>
    </div>
  );
}
