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
    title: model.title,
    description: model.description,
    img: model.img,
    contacts: model.contacts,
    participations: model.participations && model.participations.map(function(participation) {
      return {
        event: participation.event,
        member: participation.member,
        status: participation.status,
        kind: participation.kind,
      };
    }),
    updated: model.updated,
  }
}