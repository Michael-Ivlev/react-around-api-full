import React, { useState } from "react";
import { PopupWithForm } from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export function EditProfilePopup(props) {
  const currentUser = React.useContext(CurrentUserContext);
  const [name, setName] = useState(currentUser.name);
  const [description, setDescription] = useState(currentUser.about);

  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, props.isOpen]);

  function handleNameChange(event) {
    setName(event.target.value);
  }

  function handleDescriptionChange(event) {
    setDescription(event.target.value);
  }

  function handleSubmit(e) {
    // Prevent the browser from navigating to the form address
    e.preventDefault();
    // Pass the values of the managed components to the external handler
    props.onUpdateUser({
      name,
      about: description,
    });
  }

  return (
    <PopupWithForm
      name="profile"
      title="Edit profile"
      isOpen={props.isOpen}
      onClose={props.onClose}
      buttonText="Save"
      onSubmit={handleSubmit}
    >
      <input
        name="popup-profile-profile-name-input"
        className="popup__input"
        id="popup-profile__form-input_name"
        type="text"
        placeholder="Jacques Cousteau"
        required
        value={name || ""}
        minLength="2"
        maxLength="40"
        onChange={handleNameChange}
      />
      <span
        id="popup-profile__form-input_name-error"
        className="popup__error"
      ></span>
      <input
        id="popup-profile__form-input_job"
        name="popup-profile-job-input"
        className="popup__input"
        type="text"
        placeholder="Explorer"
        required
        value={description || ""}
        minLength="2"
        maxLength="200"
        onChange={handleDescriptionChange}
      />
      <span
        id="popup-profile__form-input_job-error"
        className="popup__error"
      ></span>
    </PopupWithForm>
  );
}
