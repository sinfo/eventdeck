// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Global variable containing the query we'd like to pass to Flickr. In this
 * case, notifications!
 *
 * @type {string}
 */
var QUERY = 'notifications';

var notificationGenerator = {
  /**
   * Flickr URL that will give us lots and lots of whatever we're looking for.
   *
   * See http://www.flickr.com/services/api/flickr.photos.search.html for
   * details about the construction of this URL.
   *
   * @type {string}
   * @private
   */
  memberEndpoint_: 'http://the-tool.franciscodias.net/api/member/me',
  notificationsEndpoint_: 'http://the-tool.franciscodias.net/api/notification',

  member: {},

  /**
   * Sends an XHR GET request to grab photos of lots and lots of notifications. The
   * XHR's 'onload' event is hooks up to the 'showNotifications_' method.
   *
   * @public
   */
  requestNotifications: function() {
    var req = new XMLHttpRequest();
    req.open("GET", this.memberEndpoint_, true);
    req.onload = this.requestMember_.bind(this);
    req.send(null);
  },

  requestMember_: function(e) {
    try
    {
      member = JSON.parse(e.target.responseText);

      var req = new XMLHttpRequest();
      req.open("GET", this.notificationsEndpoint_, true);
      req.onload = this.showNotifications_.bind(this);
      req.send(null);
    }
    catch(err)
    {
      var a = document.createElement('a');
      var p = document.createElement('p');
      a.setAttribute("href", "http://the-tool.franciscodias.net/login");
      a.setAttribute("target", "_blank");
      a.innerHTML = "Login on THE TOOL!"
      p.appendChild(a);
      document.body.appendChild(a);
    } 
  },

  /**
   * Handle the 'onload' event of our notification XHR request, generated in
   * 'requestKittens', by generating 'img' elements, and stuffing them into
   * the document for display.
   *
   * @param {ProgressEvent} e The XHR ProgressEvent.
   * @private
   */
  showNotifications_: function (e) {
    var notifications = JSON.parse(e.target.responseText);
    console.log(notifications);

    notifications.sort(function(a, b){
      return new Date(b.posted) - new Date(a.posted);
    });

    for (var i = 0; i < notifications.length; i++) {
      var p = document.createElement('p');
      var a = document.createElement('a');

      a.setAttribute("href", "http://the-tool.franciscodias.net/#/"+notifications[i].thread.replace("-", "/"));
      a.setAttribute("target", "_blank");
      a.setAttribute("class", "activity");

      if(notifications[i].unread.indexOf(member.id) != -1) {
        a.innerHTML = '<b>' + notifications[i].description + '</b>';
      } else {
        a.innerHTML = notifications[i].description;
      }
      var small = document.createElement('small');
      small.innerHTML = ' ('+timeSince(notifications[i].posted)+')';
      a.appendChild(small);
      p.appendChild(a);
      document.body.appendChild(p);
    }
  }
};

// Run our notification generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  notificationGenerator.requestNotifications();
});

function timeSince(date) {
    date = new Date(date);
    var seconds = Math.floor((Date.now() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
        return interval + " years ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
  };