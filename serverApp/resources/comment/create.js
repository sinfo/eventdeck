var Comment      = require('./../../db/models/comment.js');
var markdown     = require('markdown').markdown;
var notification = require('./../notification');
var getTargets   = require('./../member').getTargetsByThread;

module.exports = create;

function create(request, reply) {

  var comment = request.payload;

  comment.member = request.auth.credentials.id;

  comment.html = markdown.toHTML(request.payload.markdown);

  var newComment = new Comment(comment);

  newComment.save(function (err) {
    if (err) {
      console.log("Error creating comment.");
      reply({error: "Error creating comment."});
    }
    else {
      getTargets(comment.thread, function(err, targets) {
        if(err) { console.log(err); }

        notification.notify(comment.member, comment.thread, 'posted a new comment', newComment._id, targets);
      });

      reply({success: "Comment created."});
    }
  });

}
