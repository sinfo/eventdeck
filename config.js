var pack = require('package');

var config = {
  url: process.env.EVENTDECK_URL || 'http://localhost:8080',
  port: process.env.EVENTDECK_PORT || 8080,
  isDev: true,
  isSecure: false
};

config.mongo = {
  url: process.env.EVENTDECK_MONGO_URL || 'mongodb://localhost/deck'
};

config.cookie = {
  name: process.env.EVENTDECK_COOKIE_NAME || 'eventdeck',
  password: process.env.EVENTDECK_COOKIE_PASSWORD || 'YOUR COOKIE PASSWORD'
};

config.mailgun = {
  email: process.env.EVENTDECK_MAILGUN_EMAIL || 'email@example.com',
  api: process.env.EVENTDECK_MAILGUN_API || 'YOUR MAILGUN KEY',
  publicApi: process.env.EVENTDECK_MAILGUN_PUBLIC_API || 'YOUR MAILGUN PUBLIC KEY'
};

config.facebook = {
  appId: process.env.EVENTDECK_FACEBOOK_APP_ID || 'YOUR APP ID',
  appSecret: process.env.EVENTDECK_FACEBOOK_APP_SECRET || 'YOUR APP SECRET'
};

config.bunyan = {
  name: pack.name,
  level: process.env.EVENTDECK_LOG_LEVEL || 'trace'
};

config.swagger = {
  pathPrefixSize: 2,
  apiVersion: pack.version
};

config.client = {
  apiUrl: config.url,
  debugMode: true
};

if(process.env.NODE_ENV == 'test') {
  config.mongo.url = process.env.EVENTDECK_MONGO_TEST_URL || 'mongodb://localhost/deck_test'
  config.bunyan.level = process.env.EVENTDECK_LOG_LEVEL_TEST || 'error'
}

module.exports = config;
