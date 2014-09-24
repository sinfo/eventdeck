#!/bin/bash
git fetch --all
git reset --hard origin/development
npm run-script dist
forever restart serverApp/index.js
