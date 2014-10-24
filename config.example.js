var config = {
  url: process.env.EVENTDECK_URL || 'https://deck.eventdeck.co',
  port: process.env.EVENTDECK_PORT || 8080,
};

config.mongo = {
  url: process.env.EVENTDECK_MONGO_URL || 'mongodb://localhost/deck'
};

config.cookie = {
  name: process.env.EVENTDECK_COOKIE_NAME || 'eventdeck',
  password: process.env.EVENTDECK_COOKIE_PASSWORD || 'YOUR COOKIE PASSWORD'
};

config.mailgun = {
  email: process.env.EVENTDECK_MAILGUN_EMAIL || 'deck@sinfo.org',
  api: process.env.EVENTDECK_MAILGUN_API || 'YOUR MAILGUN KEY',
  publicApi: process.env.EVENTDECK_MAILGUN_PUBLIC_API || 'YOUR MAILGUN PUBLIC KEY'
};

config.facebook = {
  appId: process.env.EVENTDECK_FACEBOOK_APP_ID || 'YOUR APP ID',
  appSecret: process.env.EVENTDECK_FACEBOOK_APP_SECRET || 'YOUR APP SECRET'
};

config.bunyan = {
  name: require('./package.json').name,
  level: process.env.EVENTDECK_LOG_LEVEL || 'trace'
};

config.swagger = {
  pathPrefixSize: 1,
  apiVersion: pack.version
};


module.exports = config;