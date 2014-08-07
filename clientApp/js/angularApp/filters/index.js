'use strict';

angular.module('theTool.filters', [])
  .filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }])
  .filter('filterEventStatus', function(){
    return function(objs, event, status) {
      //console.log(status);
      var result = objs;
      if(event) {
        result = objs.filter(function(o) {
          return o.participations.filter(function(p) {
            if(status && status !== '') {
              return p.event === event.id && p.status === status;
            } else {
              return p.event === event.id;
            }
          }).length > 0;
        });
      }
      return result;
    };
  })
  .filter('filterRole', function() {
    return function(members, role) {
          var result = members;
          if(role) {
            result = members.filter(function(m) {
              return m.roles.filter(function(r) {
                return r.id == role;
              }).length > 0;
            });
          }
          return result;
      };
  });