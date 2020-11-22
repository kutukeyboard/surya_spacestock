import React from "react";

const Card = ({ id, image, title, description, city, handleOnclick }) => {
  return (
    <div className="cardContainer">
      <img src={image} className="cardImage" alt="" />
      <div className="cardInfo">
        <h3 className="cardTitle">{title}</h3>
        <p className="cardDescription">{description}</p>
        <p className="cardCity">{city}</p>
        <div className="cardButtonContainer">
          <button type="button" onClick={handleOnclick} className="cardButton">
            Detail
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
