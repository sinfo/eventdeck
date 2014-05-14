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
  notificationsEndpoint_: 'http://the-tool.franciscodias.net/api/notifications',

  /**
   * Sends an XHR GET request to grab photos of lots and lots of notifications. The
   * XHR's 'onload' event is hooks up to the 'showNotifications_' method.
   *
   * @public
   */
  requestNotifications: function() {
    var req = new XMLHttpRequest();
    req.open("GET", this.notificationsEndpoint_, true);
    req.onload = this.showNotifications_.bind(this);
    req.send(null);
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

    for (var i = 0; i < notifications.length; i++) {
      var p = document.createElement('p');
      p.innerText = notifications[i].description;
      document.body.appendChild(p);
    }
  }
};

// Run our notification generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  notificationGenerator.requestNotifications();
});
