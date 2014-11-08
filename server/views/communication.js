module.exports = function render(content) {
  if(content instanceof Array) {
    return content.map(renderObject);
  }

  return renderObject(content);  
};

function renderObject(model) {
  return {
    id: model._id,
    member: model.member,
    text: model.text,
    thread: model.thread,
    subthread: model.subthread,
    event: model.event,
    kind: model.kind,
    status: model.status,
    posted: model.posted,
    updated: model.updated,
  };
}