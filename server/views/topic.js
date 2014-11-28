module.exports = function render(content) {
  if(content instanceof Array) {
    return content.map(renderObject);
  }

  return renderObject(content);
};

function renderObject(model) {
  return {
    id: model._id,
    kind: model.kind,
    name: model.name,
    text: model.text,
    author: model.author,

    targets: model.targets,

    closed: model.closed,

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

    tags: model.tags,

    posted: model.posted,
    updated: model.updated,
  };
}