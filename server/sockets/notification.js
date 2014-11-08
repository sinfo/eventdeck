var async = require('async');
var server = require('server');
var log = require('server/helpers/logger');
var webSocket = server.webSocket.server;

function notificationServer(socket){

  socket.on('notification-init', function(data, cbClient){
    
    
  });

  socket.on('notify', function(notification, cbClient){
    
    if(notification.targets){
      async.each(notification.targets, function(target, cb){
        webSocket.to(target).emit('notify-target', {notification: notification});
        cb();
      });
      return cbClient();
    }

    server.methods.subscription.getByThread(notification.thread, function(subscriptions, err){
      if(err){
        log.error({err: err, subscription: notification.thread}, '[socket-notification] error getting subscriptions');
      }
      async.each(subscriptions, function(subscription, cb){
        webSocket.to(subscription.member).emit('notify-subscription', {notification: notification});
        cb();
      });
      return cbClient();
    });
  });
}

module.exports = notificationServer;