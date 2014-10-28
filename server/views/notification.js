module.exports = function render(content) {
  if(typeof(content) == 'array' || content.length) {
    return content.map(renderObject);
  }

  return renderObject(content);  
}

function renderObject(model) {
  return {
    id: model._id,
    thread: model.thread,
    source: model.source,
    member: model.member,
    description: model.description,
    targets: model.targets,
    posted: model.posted,
  }
}