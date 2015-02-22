var pack = require('package');
var url = require('url');

var config = {
  url: process.env.EVENTDECK_URL || 'http://localhost:8080',
  host: process.env.EVENTDECK_HOST || 'localhost',
  port: process.env.EVENTDECK_PORT || 8080,
  isDev: process.env.NODE_ENV != 'production',
  isSecure: process.env.EVENTDECK_IS_SECURE === true || process.env.EVENTDECK_IS_SECURE === 'true'
};

config.cannon = {
  url: process.env.CANNON_URL || 'http://localhost:8090'
};

config.mongo = {
  url: process.env.EVENTDECK_MONGO_URL || 'mongodb://localhost/deck'
};

config.cookie = {
  name: process.env.EVENTDECK_COOKIE_NAME || 'eventdeck-auth',
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
  streams: [
    {
      level: process.env.NODE_ENV=='test' && 'error' || process.env.EVENTDECK_LOG_LEVEL || 'trace',
      stream: process.stdout
    },
    {
      type: 'rotating-file',
      level: process.env.EVENTDECK_LOG_LEVEL || 'trace',
      path: './eventdeck.log',
      period: '1d',   // daily rotation
      count: 3        // keep 3 back copies
    }
  ]
};

config.swagger = {
  pathPrefixSize: 2,
  apiVersion: pack.version,
  basePath: config.url,
};

config.client = {
  apiUrl: config.url,
  debugMode: true,
  facebook: {
    appId: config.facebook.appId
  },
  cannonUrl: config.cannon.url
};

config.images = {
  directory: __dirname+'/public/images'
};

config.cors = {
  origin: ['*'],
  additionalHeaders: ['Only-Public']
};

config.ical = {
  path: __dirname + '/public/ical/ical.ics'
};

config.templates = {};

if(process.env.NODE_ENV == 'test') {
  config.mongo.url = process.env.EVENTDECK_MONGO_TEST_URL || 'mongodb://localhost/deck_test';
  config.bunyan.level = process.env.EVENTDECK_LOG_LEVEL_TEST || 'error';
}

module.exports = config;
