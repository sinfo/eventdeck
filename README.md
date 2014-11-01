# EventDeck

[![Build Status](https://magnum.travis-ci.com/sinfo/eventdeck.svg?token=bYLgwH8zFdHVE6syVqz5)](https://magnum.travis-ci.com/sinfo/eventdeck)
[![Dependency Status](https://david-dm.org/sinfo/eventdeck.svg)](https://david-dm.org/sinfo/eventdeck)
[![devDependency Status](https://david-dm.org/sinfo/eventdeck/dev-status.svg)](https://david-dm.org/sinfo/eventdeck#info=devDependencies)

EventDeck is a tool being built internally at [SINFO](http://sinfo.org) to help us manage everything related to our events.



### Installation:
  1. Clone the repo: <code>git clone git@github.com:sinfo/eventdeck.git</code>
  2. Enter the directory: <code>cd eventdeck</code>
  3. Install the dependencies: <code>npm install</code>
  4. Set the env varibales used on <code>config.js</code> file
  5. Start the server using <code>npm start</code> or <code>forever start server/index.js</code>

Sync server with Github:
```
cd eventdeck
./sync.sh

or

cd eventdeck
git fetch --all
git reset --hard origin/master
forever restart server/index.js
```
