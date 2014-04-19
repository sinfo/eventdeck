#!/usr/bin/env node

require('colors');
var spawn = require('child_process').spawn;
var gaze = require('gaze');

//process.chdir('..');

var executing = false;
var pending = false;

var watch = [
  'clientApp/js/**/*.js',
  'clientApp/css/**/*.scss',
  'serverApp/public/partials/*.html',
];

gaze(watch, watcher);

function watcher(err, watcher) {
  this.on('all', changed);
  console.log('watching'.green);
}

function changed(event, filepath) {
  console.log('[%s] %s'.yellow, event, filepath);
  run();
}

function run() {
  if (executing) {
    pending = true;
    return;
  }
  executing = true;
  var child = spawn('make', [], {stdio: 'inherit'});
  child.once('exit', exited);
}

function exited(code, signal) {
  executing = false;
  if (! code) {
    console.log('terminated'.green);
  }
  else {
    console.error('finished with exit code %d'.red, code);
  }
  if (pending) {
    run();
  }
  pending = false;
}

run();