#!/bin/bash
git fetch --all
git reset --hard origin/dev
npm run-script dist
forever restart serverApp/index.js
