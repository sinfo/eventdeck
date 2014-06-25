#!/bin/bash
git fetch --all
git reset --hard origin/all-angular
npm run-script dist
forever restart serverApp/index.js
