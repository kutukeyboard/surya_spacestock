import React from "react";
import GoogleMapReact from "google-map-react";

const Maps = ({ data, multiple }) => {
  const Marker = () => {
    return <div className="SuperAwesomePin"></div>;
  };

  return (
    <div className="mapContainer">
      <GoogleMapReact
        bootstrapURLKeys={{
          key: process.env.REACT_APP_gmap,
        }}
        defaultCenter={
          multiple
            ? [data[0].address.latitude, data[0].address.longitude]
            : [data.address.latitude, data.address.longitude]
        }
        defaultZoom={11}
      >
        {multiple ? (
          data.map((place) => {
            return (
              <Marker
                key={"asa" + place.id}
                lat={place.address.latitude}
                lng={place.address.longitude}
                text={place.title}
              />
            );
          })
        ) : (
          <Marker
            key={"asa" + data.id}
            lat={data.address.latitude}
            lng={data.address.longitude}
            text={data.title}
          />
        )}
      </GoogleMapReact>
    </div>
  );
};

export default Maps;
