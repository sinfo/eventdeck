module.exports = function render(content) {
  if(typeof(content) == 'array' || content.length) {
    return content.map(renderObject);
  }

  return renderObject(content);  
}

function renderObject(model) {
  return {
    id: model._id,
    chatId: model.chatId,
    member: model.member,
    source: model.source,
    text: model.text,
    date: model.date,
  }
}