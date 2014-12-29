var async = require('async');
var servers = require('server');
var log = require('server/helpers/logger');
var webSocket = servers.webSocket.server;
var server = servers.hapi;

function notificationServer(socket){

  socket.on('notification-count', function(data, cbClient){
    var query = data.data || {};
    server.methods.notification.getUnreadCount(data.id, query, function(err, result){
      if(err){
        log.error({err: err, user: data.id, notifications: result}, '[socket-notification] error getting notification count');
        socket.emit('notification-count-response', {err: err});
        return cbClient(err);
      }
      socket.emit('notification-count-response', {response: result});
      cbClient();
    });
  });

  socket.on('notifications-get', function(data, cbClient){
   var query = data.data || {};
    server.methods.notification.getByMember(socket.nickname, query, function(err, notifications){
      if(!notifications){
        socket.emit('notifications-get-response', {response: []});
        return cbClient();
      } 
      server.methods.notification.decorateWithUnreadStatus(socket.nickname, notifications, function(err, result){
        if(err){
          log.error({err: err, user: socket.nickname, notifications: result}, '[socket-notification] error getting notifications');
          socket.emit('notifications-get-response', {err: err});
          return cbClient(err);
        }
        socket.emit('notifications-get-response', {response: result});
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
        webSocket.to(target).emit('notify-target', notification);
        cb();
      });
      return cbClient();
    }

    server.methods.subscription.getByThread(notification.thread, function(subscriptions, err){
      if(err){
        log.error({err: err, subscription: notification.thread}, '[socket-notification] error getting subscriptions');
        return cbClient(err);
      }
      async.each(subscriptions, function(subscription, cb){
        webSocket.to(subscription.member).emit('notify-subscription', notification);
        cb();
      });
      return cbClient();
    });
  });

  socket.on('access', function(data, cbClient){
    server.methods.access.save(data.memberId, data.thread, function(err, result){
      if(err){
        log.error({err: err, access: result}, '[socket-notification] error saving access');
      }
      cbClient(err);
    });
  });

}

module.exports = notificationServer;