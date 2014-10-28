module.exports = function render(content) {
  if(typeof(content) == 'array' || content.length) {
    return content.map(renderObject);
  }

  return renderObject(content);  
}

function renderObject(model) {
  return {
    id: model.id,
    name: model.name,
    kind: model.kind,
    img: model.img,
    place: model.place,
    description: model.description,
    speakers: model.speakers && model.speakers.map(function(speaker) {
      return {
        id: speaker.id,
        name: speaker.name,
        position: speaker.position,
      };
    }),
    companies: model.companies,
    date: model.date,
    duration: model.duration,
    updated: model.updated,
  }
}