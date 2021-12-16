import React, { useRef } from "react";
import { PopupWithForm } from "./PopupWithForm";

export function EditAvatarPopup(props) {
  const avatarInputRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();

    props.onUpdateAvatar({
      avatar: avatarInputRef.current.value,
    });
  }

  return (
    <PopupWithForm
      name="avataredit"
      title="Change profile picture"
      isOpen={props.isOpen}
      onClose={props.onClose}
      buttonText="Save"
      onSubmit={handleSubmit}
    >
      <input
        name="popup-avataredit-profile-link-input"
        className="popup__input"
        id="popup-avataredit__form-input_link"
        type="url"
        placeholder="Jacques Cousteau"
        required
        minLength="2"
        ref={avatarInputRef}
      />
      <span
        id="popup-avataredit__form-input_link-error"
        className="popup__error"
      ></span>
    </PopupWithForm>
  );
}
