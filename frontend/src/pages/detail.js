import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import "../styles/detail.css";

import Maps from "../components/maps";
const DetailPage = () => {
  const { itemId } = useParams();

  const [lastIndex, setLastIndex] = useState(0);
  const getPlaceById = gql`
    query placeById($id: ID!) {
      getPlaceById(id: $id) {
        id
        name
        description
        facilities
        type
        images {
          primary
          others
        }
        address {
          street
          city
          country
          latitude
          longitude
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(getPlaceById, {
    variables: {
      id: itemId,
    },
  });

  if (loading) return <p>Loading ...</p>;
  if (error) return <p>Opps...</p>;

  let images = [
    data.getPlaceById.images.primary,
    ...data.getPlaceById.images.others,
  ];

  let arrayImage = images.slice(lastIndex, 3 + lastIndex);

  const handleNext = () => {
    if (lastIndex + 3 < images.length - 1) {
      setLastIndex(lastIndex + 3);
    }
  };

  const handlePrev = () => {
    if (lastIndex - 3 >= 0) {
      setLastIndex(lastIndex - 3);
    }
  };

  return (
    <div className="detailContainer">
      <img
        src={data.getPlaceById.images.primary}
        className="detailImage"
        alt=""
      />
      <div className="detailInfo">
        <h3 className="detailTitle">{data.getPlaceById.name}</h3>
        <div className="detailPane">
          <div className="leftPane">
            <p>Deskripsi</p>
            <p className="infoDescription">{data.getPlaceById.description}</p>
            <br />
            <strong>Fasilitas</strong>

            <div className="facilitiesContainer">
              {data.getPlaceById.facilities.map((item) => {
                return (
                  <p className="facilitiesItem" key={"fcl." + item}>
                    {item}
                  </p>
                );
              })}
            </div>
          </div>
          <div className="rightPane">
            <p>Lokasi</p>
            <p className="infoDescription">
              {data.getPlaceById.address.street}
            </p>
            <div className="mapDetail">
              <Maps data={data.getPlaceById} multiple={false} />
            </div>
          </div>
        </div>
        <div className="carouselContainer">
          <button className="carouselBtn" onClick={handlePrev}>{`<`}</button>

          {arrayImage.map((item) => {
            return (
              <img src={item} key={item} className="carouselImage" alt="" />
            );
          })}

          <button className="carouselBtn" onClick={handleNext}>{`>`}</button>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
