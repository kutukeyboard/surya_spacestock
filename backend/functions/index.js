const { ApolloServer } = require("apollo-server");

const server = new ApolloServer({
  modules: [require("./scheema/place")],
  context: ({ req }) => {
    let token = req.headers.authorization || "";
    token = token.toString().replace("Bearer ", "");
    token = { token };
    return token;
  },
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
