import React, { useState, useRef } from "react";
import { useQuery, gql } from "@apollo/client";
import { useHistory } from "react-router-dom";

import Card from "../components/card";
import Maps from "../components/maps";

import "../styles/search.css";

const SearchPage = () => {
  const [lastDoc, setLastDoc] = useState("");
  const [queryDirection, setQueryDirection] = useState("fwd");
  const [searchText, setSearchText] = useState("");

  const history = useHistory();
  const sInput = useRef();

  const getListPlaces = gql`
    query listPlace(
      $limit: Int!
      $direction: String!
      $lastDoc: String
      $searchText: String
    ) {
      getListPlaces(
        limit: $limit
        direction: $direction
        lastDoc: $lastDoc
        searchText: $searchText
      ) {
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

  const { loading, error, data } = useQuery(getListPlaces, {
    variables: {
      limit: 4,
      direction: queryDirection,
      lastDoc: lastDoc,
      searchText: searchText,
    },
  });

  const handlePrev = () => {
    if (data) {
      const doc = data.getListPlaces[data.getListPlaces.length - 1].id;
      setLastDoc(doc);
      setQueryDirection("prev");
    }
  };
  const handleNext = () => {
    if (data) {
      const doc = data.getListPlaces[data.getListPlaces.length - 1].id;
      setLastDoc(doc);
      setQueryDirection("fwd");
    }
  };

  const handleSearch = () => {
    setSearchText(sInput.current.value);
  };
  if (loading) return <p className="resultText">Loading ...</p>;
  if (error) return <p className="resultText">ooops ...</p>;

  return (
    <div>
      <div className="searchbar">
        <select id="searchTypeSelect">
          <option>All</option>
          <option>Apartment</option>
          <option>Office</option>
        </select>
        <input
          className="searchInput"
          type="text"
          id="searchText"
          placeholder="search"
          ref={sInput}
        />
        <button type="button" onClick={handleSearch}>
          GO
        </button>
      </div>
      {data.getListPlaces.length > 0 ? (
        <div className="content">
          <div className="leftContent">
            <div className="cardContent">
              {data &&
                data.getListPlaces.map((item) => {
                  return (
                    <Card
                      key={`card-${item.id}`}
                      id={item.id}
                      image={item.images.primary}
                      title={item.name}
                      description={item.description}
                      city={item.address.city}
                      handleOnclick={() => history.push(`/${item.id}`)}
                    />
                  );
                })}
            </div>
            {data.getListPlaces.length > 1 && (
              <div className="btnContainer">
                <button
                  className="navBtnPrev"
                  onClick={handlePrev}
                  disabled={lastDoc !== "" ? false : true}
                >
                  Prev
                </button>
                <button className="navBtnNext" onClick={handleNext}>
                  Next
                </button>
              </div>
            )}
          </div>

          <div className="mapContent">
            <Maps data={data.getListPlaces} multiple={true} />
          </div>
        </div>
      ) : (
        <p className="resultText">No Data...</p>
      )}
    </div>
  );
};

export default SearchPage;
