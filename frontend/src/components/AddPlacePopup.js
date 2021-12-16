import React, { useState } from "react";
import { PopupWithForm } from "./PopupWithForm";

export function AddPlacePopup(props) {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");

  function handleNameChange(event) {
    setName(event.target.value);
  }

  function handleLinkChange(event) {
    setLink(event.target.value);
  }

  function handleSubmit(e) {
    // Prevent the browser from navigating to the form address
    e.preventDefault();
    props.onNewCard({
      link,
      name,
    });
  }

  React.useEffect(() => {
    setName('');
    setLink('');
}, [props.isOpen]);

  return (
    <PopupWithForm
      name="card"
      title="New place"
      isOpen={props.isOpen}
      onClose={props.onClose}
      buttonText="Create"
      onSubmit={handleSubmit}
    >
      <input
        name="popup-card-title-input"
        className="popup__input"
        id="popup-card__form-input_title"
        type="text"
        placeholder="Title"
        required
        value={name || ""}
        minLength="1"
        maxLength="30"
        onChange={handleNameChange}
      />
      <span
        id="popup-card__form-input_title-error"
        className="popup__error"
      ></span>
      <input
        id="popup-card__form-input_imgurl"
        name="popup-card-imgurl-input"
        className="popup__input"
        type="url"
        value={link || ""}
        placeholder="Image link"
        required
        onChange={handleLinkChange}
      />
      <span
        id="popup-card__form-input_imgurl-error"
        className="popup__error"
      ></span>
    </PopupWithForm>
  );
}
