export const InfoTooltip = (props) => {
  return (
    <div
      className={`popup popup popup-image ${props.isOpen ? "popup_open" : ""}`}
    >
      <div className="InfoTooltip__container">
        <button
          onClick={props.onClose}
          className="popup__close hover"
          type="button"
        ></button>
        <div
          className={
            props.isSuccsess ? "InfoTooltip__success" : "InfoTooltip__unsuccess"
          }
        ></div>
        <h2 className="InfoTooltip__title">
          {props.isSuccsess
            ? "Success! You have now been registered."
            : "Oops, something went wrong! Please try again."}
        </h2>
      </div>
    </div>
  );
};
