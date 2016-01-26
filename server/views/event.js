var Boom = require('boom');

module.exports = function render (content, isAuthenticated) {
  if (content instanceof Array) {
    if (isAuthenticated === false) {
      content = content && content.filter(function (model) {
        return model.public;
      });
    }
    return content.map(function (model) { return renderObject(model, isAuthenticated); });
  } else {
    // Hack, this shouldn't probably be done here, but as all the related logic is here, let's keep on...
    if (isAuthenticated === false) {
      if (!content.public) { return Boom.notFound(); }
    }
  }

  return renderObject(content);
};

function renderObject (model, isAuthenticated) {
  return {
    id: model.id,
    name: model.name,
    kind: model.kind,
    description: model.description,
    public: model.public,
    date: model.date,
    duration: model.duration,
    updated: model.updated
  };
}
