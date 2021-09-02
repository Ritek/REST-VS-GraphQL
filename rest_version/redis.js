const redis = require("redis");
const client = redis.createClient();
const { promisify } = require("util");

const getOne = promisify(client.get).bind(client);
const setOne = promisify(client.set).bind(client);
const deleteOne = promisify(client.del).bind(client);

module.exports = { 
    redis: {
        client, setOne, getOne, deleteOne 
    }
}