module.exports = function render (content) {
  if (content instanceof Array) {
    return content.map(renderObject)
  }

  return renderObject(content)
}

function renderObject (model) {
  return {
    id: model._id,
    member: model.member,
    text: model.text,
    thread: model.thread,
    subthread: model.subthread,
    posted: model.posted,
    updated: model.updated
  }
}
