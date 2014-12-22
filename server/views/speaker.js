module.exports = function render(content) {
  if(content instanceof Array) {
    return content.map(renderObject);
  }

  return renderObject(content);
};

function renderObject(model) {
  model = model.toJSON();

  return {
    id: model.id,
    unread: model.unread,
    thread: model.thread,
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
  };
}