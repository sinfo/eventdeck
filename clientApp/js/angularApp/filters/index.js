'use strict';

angular.module('theTool.filters', [])
  .filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }])
  .filter('filterEvent', function(){
    return function(objs, event) {
          var result = objs;
          console.log(event);
          if(event) {
            result = objs.filter(function(o) {
              return o.participations.filter(function(p) {
                return p.event === event;
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