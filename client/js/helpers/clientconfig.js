var cookies = require('cookie-getter');

var CONFIG_COOKIE_NAME = 'eventdeck-config';

var config = cookies(CONFIG_COOKIE_NAME) || {};

// freeze it if browser supported
if (Object.freeze) {
    Object.freeze(config);
}

// wipe it out
document.cookie = 'config=;expires=Thu, 01 Jan 1970 00:00:00 GMT';

// export it
module.exports = config;
