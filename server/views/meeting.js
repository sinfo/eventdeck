module.exports = function render(content) {
  if(typeof(content) == 'array' || content.length) {
    return content.map(renderObject);
  }

  return renderObject(content);  
}

function renderObject(model) {
  return {
    id: model._id,
    author: model.author,
    title: model.title,
    description: model.description,
    attendants: model.attendants,
    date: model.date,
    updated: model.updated,
  }
}