# EventDeck

EventDeck is a tool being built internally at [SINFO](http://sinfo.org) to help us manage everything related to our events.



### Installation:
  1. Clone the repo: <code>git clone git@github.com:sinfo/eventdeck.git</code>
  2. Enter the directory: <code>cd eventdeck</code>
  3. Install the dependencies: <code>npm install</code>
  4. Create a <code>config.js</code> file using the same structure as <code>config.example.js</code>
  5. Start the server using <code>npm start</code> or <code>forever start serverApp/index.js</code>

### Maintance:
Compile the angular app
```
npm run-script dist
```

Sync server with Github:
```
cd eventdeck
./sync.sh

or

cd eventdeck
git fetch --all
git reset --hard origin/master
npm run-script dist
forever restart serverApp/index.js
```
