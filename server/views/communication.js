
module.exports = function render(communication) {
  return {
    id: communication._id,
    member: communication.member,
    text: communication.text,
    thread: communication.thread,
    subthread: communication.subthread,
    event: communication.event,
    kind: communication.kind,
    status: communication.status,
    posted: communication.posted,
    updated: communication.updated,
  }
}