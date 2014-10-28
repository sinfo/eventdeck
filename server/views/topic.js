module.exports = function render(content) {
  if(typeof(content) == 'array' || content.length) {
    return content.map(renderObject);
  }

  return renderObject(content);  
}

function renderObject(model) {
  return {
    id: model._id,
    kind: model.kind,
    text: model.text,
    targets: model.targets,
    closed: model.closed,
    result: model.result,
    poll: model.poll && {
      kind: model.poll.kind,
      options: model.poll.options && model.poll.options.map(function(option) {
        return {
          content: option.content,
          votes: option.votes,
        };
      }),
    },
    duedate: model.duedate,
    meetings: model.meetings,
    tags: model.tags,
    root: model.root,
    updated: model.updated,
  }
}