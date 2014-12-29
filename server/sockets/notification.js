var async = require('async');
var servers = require('server');
var log = require('server/helpers/logger');
var socketServer = servers.webSocket.server;
var socketClient = servers.webSocket.client;
var server = servers.hapi;

var events = {
  count: 'notification-count',
  countResp: 'notification-count-response',
  get: 'notifications-get',
  getResp: 'notifications-get',
  notify: 'notify',
  notifyTarget: 'notify-target',
  notifySubscripton: 'notify-subscription',
  access: 'access'
};

server.method('notification.emit', notify, {});

function notify(notification, cb){
  log.debug(notification);
  if(!notification){
    return cb();
  }
  socketClient.emit(events.notify, notification, function(err){
    if(err){
      log.error({ err: err, notification: notification}, 'error notifying sockets');
    }
    cb(err);
  });
}

function notificationListeners(socket){

  socket.on(events.count, function(data, cbClient){
    var query = data.data || {};
    server.methods.notification.getUnreadCount(data.id, query, function(err, result){
      if(err){
        log.error({err: err, user: data.id, notifications: result}, '[socket-notification] error getting notification count');
        socket.emit(events.countResp, {err: err});
        return cbClient(err);
      }
      socket.emit(events.countResp, {response: result});
      cbClient();
    });
  });

  socket.on(events.get, function(data, cbClient){
   var query = data.data || {};
    server.methods.notification.getByMember(socket.nickname, query, function(err, notifications){
      if(!notifications){
        socket.emit(events.getResp, {response: []});
        return cbClient();
      } 
      server.methods.notification.decorateWithUnreadStatus(socket.nickname, notifications, function(err, result){
        if(err){
          log.error({err: err, user: socket.nickname, notifications: result}, '[socket-notification] error getting notifications');
          socket.emit(events.getResp, {err: err});
          return cbClient(err);
        }
        socket.emit(events.getResp, {response: result});
        cbClient();
      });
    });
  });

  socket.on('notification-get', function(data, cbClient){
    //TODO notification fetch by id
  });

  socket.on(events.notify, function(notification, cbClient){
    
    if(notification.targets){
      async.each(notification.targets, function(target, cb){
        socketServer.to(target).emit(events.notifyTarget, notification);
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
        socketServer.to(subscription.member).emit(events.notifySubscripton, notification);
        cb();
      });
      return cbClient();
    });
  });

  socket.on(events.access, function(data, cbClient){
    server.methods.access.save(data.memberId, data.thread, function(err, result){
      if(err){
        log.error({err: err, access: result}, '[socket-notification] error saving access');
      }
      cbClient(err);
    });
  });

}

module.exports = {setListeners: notificationListeners, events: events};