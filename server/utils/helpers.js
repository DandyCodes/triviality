function randomRangeInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

const delay = milliseconds =>
  new Promise(resolve => setTimeout(resolve, milliseconds));

module.exports = { randomRangeInt, delay };
