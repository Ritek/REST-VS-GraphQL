require('dotenv').config();
const fs = require('fs');
const { makeExecutableSchema } = require("@graphql-tools/schema");
const express = require("express");
const { graphqlHTTP } = require("express-graphql");

const mongoose = require('mongoose');

const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { request } = require('express');

const { promisify } = require("util");

const schema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: resolvers
});

var redis = require("redis"),
client = redis.createClient();

client.on("error", function (err) {
  console.log("Error " + err);
});
client.on("ready", function() {
  console.error('Redis is working!');
});

const getOne = promisify(client.get).bind(client);
const setOne = promisify(client.set).bind(client);
const deleteOne = promisify(client.del).bind(client);
const redisFunc = ({
  client,
  setOne,
  getOne,
  deleteOne
});
//client.del('a')
//client.flushdb();

const app = express();
app.use(
  graphqlHTTP({
    schema,
    graphiql: true,
    context: {
      redis: redisFunc,
      req: request
    },
  })
);

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  app.listen(4000);
  console.log('Running a GraphQL API server at http://localhost:4000/graphql');
});