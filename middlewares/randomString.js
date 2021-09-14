const crypto = require('crypto');

const randomString = crypto
  .randomBytes(16) // сгенерируем случайную последовательность 16 байт (128 бит)
  .toString('hex'); // приведём её к строке
console.log(randomString);

module.exports = randomString;
