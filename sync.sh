#!/bin/bash
git fetch --all
git reset --hard origin/master
npm run-script dist
forever restart serverApp/index.js
