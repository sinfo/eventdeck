var config = {
  url: process.env.EVENTDECK_URL || 'https://dev.bananamarket.eu',
  port: process.env.EVENTDECK_PORT || 8766,
};

config.mongo = {
  url: process.env.EVENTDECK_MONGO_URL || 'mongodb://localhost/sinfo'
};

config.cookie = {
  name: process.env.EVENTDECK_COOKIE_NAME || 'login',
  password: process.env.EVENTDECK_COOKIE_PASSWORD || '44oJ1EoP0fR5BKoAmtDD6C1mCZzHTFYq9LDxt0EgaRQFEP6jkEix1Xa51Wq591nVOQ5d3XAjZWzIKlEYFZf5V7Rr52ilKPHxcZEDvupEoPY4JG0reyYSKHR2056VDMvDUFCH2sn55uNAKgGhWfQrOtnIexfO63feCYSdcxGcdCGZz86vT3bfJCbNZgFgVIkTg2gm3YFUxzzgUmDqkiNfv2nQcVfNaQP0UanEbLKiEedq5o1B6WzLYNvc37eycMsB'
};

config.mailgun = {
  email: process.env.EVENTDECK_MAILGUN_EMAIL || 'tool@bananamarket.eu',
  api: process.env.EVENTDECK_MAILGUN_API || 'key-7jm1c009ezjv85pkm1rqfxevufeovb43',
  publicApi: process.env.EVENTDECK_MAILGUN_PUBLIC_API || 'pubkey-0blv6drs63745oxru3itvfg1urp662y8'
};

config.facebook = {
  appId: process.env.EVENTDECK_FACEBOOK_APP_ID || '457207507744159',
  appSecret: process.env.EVENTDECK_FACEBOOK_APP_SECRET || '9f027c52e00bc3adbabcd926a3c95b97'
};

config.bunyan = {
  name: require('./package.json').name,
  level: process.env.EVENTDECK_LOG_LEVEL || 'trace'
};


module.exports = config;