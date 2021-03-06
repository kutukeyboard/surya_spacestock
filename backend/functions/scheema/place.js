const { gql } = require("apollo-server");
const { db } = require("../config/firebase");
const typeDefs = gql`
  type Place {
    id: ID!
    name: String
    description: String
    facilities: [String]
    type: String
    images: Images
    address: Address
  }
  type Images {
    primary: String
    others: [String]
  }
  input ImageInput {
    primary: String
    others: [String]
  }
  type Address {
    street: String
    city: String
    country: String
    latitude: Float
    longitude: Float
  }
  input AddressInput {
    street: String
    city: String
    country: String
    latitude: Float
    longitude: Float
  }
  extend type Query {
    getPlaceById(id: ID!): Place
    getListPlaces(
      limit: Int!
      lastDoc: String
      direction: String
      searchText: String
    ): [Place]
  }
  extend type Mutation {
    createPlace(
      name: String
      description: String
      facilities: [String]
      type: String
      images: ImageInput
      address: AddressInput
    ): Place
    updatePlace(
      id: ID!
      name: String
      description: String
      facilities: [String]
      type: String
      images: ImageInput
      address: AddressInput
    ): Place
    deletePlace(id: ID!): Boolean
  }
`;

const resolvers = {
  Query: {
    getPlaceById: async (parent, { id }) => {
      try {
        const placeRef = await db.doc(`/places/${id}`).get();
        const result = {
          id: placeRef.id,
          ...placeRef.data(),
        };
        return result;
      } catch (error) {
        return error;
      }
    },
    getListPlaces: async (parent, args) => {
      try {
        let placeRef;
        let last;
        placeRef = db.collection("places");

        if (args.searchText && args.searchText !== "") {
          placeRef = placeRef.where("name", "==", args.searchText);
        }

        if (args.lastDoc && args.lastDoc !== "") {
          last = await db.collection("places").doc(args.lastDoc).get();
          if (args.direction === "fwd") {
            placeRef = placeRef.startAfter(last);
          } else {
            placeRef = placeRef.endBefore(last);
          }
        }

        placeRef = placeRef.limit(args.limit);

        placeRef = await placeRef.get();

        const result = placeRef.docs.map((place) => {
          return {
            id: place.id,
            ...place.data(),
          };
        });

        return result;
      } catch (error) {
        return error;
      }
    },
  },
  Mutation: {
    createPlace: async (
      parent,
      { name, description, facilities, type, images, address }
    ) => {
      try {
        const new_place = db.collection("places").doc();

        await new_place.set({
          name: name,
          description: description,
          facilities: facilities,
          type: type,
          images: images,
          address: {
            street: address.street,
            city: address.city,
            country: address.country,
            latitude: address.latitude,
            longitude: address.longitude,
          },
        });

        const result = await db.collection("places").doc(new_place.id).get();
        return result.data();
      } catch (error) {
        return error;
      }
    },
    updatePlace: async (parent, args) => {
      try {
        const docId = args.id;
        delete args.id;

        const new_place = db.collection("places").doc(docId);

        await new_place.set({ ...args }, { merge: true });
        const result = await db.collection("places").doc(docId).get();
        return result.data();
      } catch (error) {
        return error;
      }
    },
    deletePlace: async (parent, { id }) => {
      try {
        const new_place = db.collection("places").doc(id).delete();
        return true;
      } catch (error) {
        return error;
      }
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
