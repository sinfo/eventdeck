
module.exports = function render(comment) {
  return {
    id: comment._id,
    member: comment.member,
    text: comment.text,
    thread: comment.thread,
    subthread: comment.subthread,
    posted: comment.posted,
    updated: comment.updated,
  }
}