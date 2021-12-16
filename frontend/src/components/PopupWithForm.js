export function PopupWithForm(props) {
  return (
    <div
      className={`popup popup-${props.name} ${
        props.isOpen ? "popup_open" : ""
      }`}
    >
      <div className={`popup-${props.name}__container`}>
        <button
          onClick={props.onClose}
          className="popup__close hover"
          type="button"
        ></button>
        <form onSubmit={props.onSubmit}
          className="popup__form"
          name={`popup-${props.name}-form`}
          id={`popup-${props.name}__form`}
        >
          <h2
            className={`popup-${props.name}__form-heading`}
          >{`${props.title}`}</h2>
          {props.children}
          <button className="popup__button" type="submit">
            {props.buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}
