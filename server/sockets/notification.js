var async = require('async');
var server = require('server');
var log = require('server/helpers/logger');
var webSocket = server.webSocket.server;
var hapiServer = server.hapi;

function notificationServer(socket){

  socket.on('notification-count', function(data, cbClient){
    var query = data.query || {};
    log.debug(cbClient);
    hapiServer.methods.notification.getUnreadCount(data.id, query, function(err, result){
      if(err){
        log.error({err: err, user: data.id, notifications: result}, '[socket-notification] error getting notification count');
        return cbClient(err);
      }
      socket.emit('notification-count-response', {count: result});
      cbClient();
    });
  });

  socket.on('notifications-get', function(data, cbClient){
   var query = data.query || {};
    hapiServer.methods.notification.list(data.id, query, function(err, notifications){
      hapiServer.mehtods.notification.decorateWithUnreadStatus(data.id, notifications, function(err, result){
        if(err){
          log.error({err: err, user: data.id, notifications: result}, '[socket-notification] error getting notifications');
          return cbClient(err);
        }
        socket.emit('notifications-get-response', result);
        cbClient();
      });
    });
  });

  socket.on('notification-get', function(data, cbClient){
    //TODO notification fetch by id
  });

  socket.on('notify', function(notification, cbClient){
    
    if(notification.targets){
      async.each(notification.targets, function(target, cb){
        webSocket.to(target).emit('notify-target', {notification: notification});
        cb();
      });
      return cbClient();
    }

    hapiServer.methods.subscription.getByThread(notification.thread, function(subscriptions, err){
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