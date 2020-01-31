const redis = require("redis");

const keys = require("./keys");

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});

// duplicate is needed because if redis client is used as subscribtion or as
// publisher it could not be used for other purposes:
const sub = redisClient.duplicate();

const fib = index => {
  if (index < 2) {
    return 1;
  } else {
    return fib(index - 1) + fib(index - 2);
  }
};

sub.on("message", (channel, message) => {
  redisClient.hset("values", message, fib(parseInt(message)));
});
sub.subscribe("insert");
