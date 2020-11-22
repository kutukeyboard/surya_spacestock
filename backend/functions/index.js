const express = require("express");

const { ApolloServer } = require("apollo-server");

const server = new ApolloServer({
  modules: [require("./scheema/place")],
});

server.listen();
