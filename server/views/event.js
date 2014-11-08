module.exports = function render(content) {
  if(content instanceof Array) {
    return content.map(renderObject);
  }

  return renderObject(content);  
};

function renderObject(model) {
  return {
    id: model.id,
    name: model.name,
    kind: model.kind,
    description: model.description,
    date: model.date,
    duration: model.duration,
    updated: model.updated,
  };
}