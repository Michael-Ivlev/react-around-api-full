export function ImagePopup(props) {
  return (
    <div
      className={`popup popup popup-image ${props.isOpen ? "popup_open" : ""}`}
      // classNameName={`popup popup popup-image ${
      //   props.card.name ? "popup_open" : ""
      // }`}
    >
      <div className="popup-image__container">
        <button
          onClick={props.onClose}
          className="popup__close hover"
          type="button"
        ></button>
        <img
          className="popup-image__image"
          src={`${props.card.link}`}
          alt={`${props.card.name}`}
        />

        <h2 className="popup-image__name">{`${props.card.name}`}</h2>
      </div>
    </div>
  );
}
