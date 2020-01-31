const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const pg = require("pg");
const redis = require("redis");

const keys = require("./keys");

// Express App Setup
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres Client Setup
const { Pool } = pg;
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
});
pgClient.on("error", () => console.log("Lost PG connection"));

pgClient
  .query("CREATE TABLE IF NOT EXISTS values (number INT)")
  .catch(error => console.log(error));

// Redis Client Setup
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});

// duplicate is needed because if redis client is used as subscribtion or as
// publisher it could not be used for other purposes:
const redisPublisher = redisClient.duplicate();

// Express route handlers
app.get("/", (req, res) => {
  res.send("Hi");
});

app.get("/values/all", async (req, res) => {
  try {
    const values = await pgClient.query("SELECT * from values");
    res.send(values.rows);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/values/current", async (req, res) => {
  redisClient.hgetall("values", (error, values) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.send(values);
    }
  });
});

app.post("/values", async (req, res) => {
  const index = req.body.index;

  if (parseInt(index) > 40) {
    return res.status(422).send("Index too high");
  }

  redisClient.hset("values", index, "Nothing yet!");
  redisPublisher.publish("insert", index);

  pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);

  res.send({ working: true });
});

app.listen(5000, () => {
  console.log("Listening");
});
