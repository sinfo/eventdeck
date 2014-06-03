# The Tool! Beta

Compile Angular app:
```
npm run-script dist
```

Sync server with Github:
```
cd /root/the-tool
./sync.sh

or

cd /root/the-tool
git fetch --all
git reset --hard origin/master
npm run-script dist
forever restart serverApp/index.js
```
