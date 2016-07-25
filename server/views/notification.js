module.exports = function render (content) {
  if (content instanceof Array) {
    return content.map(renderObject)
  }
  return renderObject(content)
}

function renderObject (model) {
  if (model.toObject) {
    model = model.toObject({ getters: true })
  }

  return {
    id: model._id,
    thread: model.thread,
    source: model.source,
    member: model.member,
    description: model.description,
    targets: model.targets,
    posted: model.posted,
    unread: model.unread
  }
}
