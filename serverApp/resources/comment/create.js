var Comment      = require('../../db/models/comment.js');
var markdown     = require('markdown').markdown;
var notification = require('../notification');
var parser       = require('../parser');
var getTargets   = require('../member').getTargetsByThread;
var log          = require('../../helpers/logger');

module.exports = create;

function create(request, reply) {

  var comment = request.payload;

  comment.member = request.auth.credentials.id;

  comment.html = markdown.toHTML(request.payload.markdown);

  var newComment = new Comment(comment);

  newComment.save(function (err) {
    if (err) {
      log.error({err: err, username: comment.member}, '[comment] error creating comment');
      return reply({error: 'Error creating comment.'});
    }

    getTargets(comment.thread, function(err, targets) {
      if(err) { log.error({err: err, username: comment.member}, '[comment] error getting targets for %s', comment.thread); }

      notification.notify(comment.member, comment.thread, 'posted a new comment', newComment._id, targets);
    });

    parser.parse(comment.markdown, comment.thread, newComment._id, comment.member);

    log.info('[comment] %s created new comment on %s', comment.member, comment.thread, comment);

    reply({success: 'Comment created.'});
  });

}
