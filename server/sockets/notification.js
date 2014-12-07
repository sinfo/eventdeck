var async = require('async');
var server = require('server');
var log = require('server/helpers/logger');
var webSocket = server.webSocket.server;

function notificationServer(socket){

  socket.on('notification-count', function(data, cbClient){
    server.methods.notification.getUnreadCount(data.id, data.query, function(err, result){
      if(err){
        log.error({user: data.id, notifications: result}, '[socket-notification] error getting notification count');
        return cbClient(err);
      }
      socket.emit('notification-count-response', {count: result});
      cbClient();
    });
  });

  socket.on('notification-get', function(data, cbClient){
    server.methods.notification.list(data.id, data.query, function(err, result){
      if(err){
        log.error({user: data.id, notifications: result}, '[socket-notification] error getting notifications');
        return cbClient(err);
      }
      socket.emit('notification-get-response', {notifications: result});
      cbClient();
    });
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