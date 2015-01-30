var CURRENT_EVENT = 'xxii-sinfo';
var PUBLIC_STATUS = 'announced';

module.exports = function render(content, isAuthenticated) {
  if(content instanceof Array) {
    if(isAuthenticated === false) {
      content = content && content.filter(function(model) {
        return model.participations && model.participations.filter(function(p) { return p.event == CURRENT_EVENT && p.status && p.status.toLowerCase() == PUBLIC_STATUS; }).length > 0;
      });
    }

    return content.map(function(model) { return renderObject(model, isAuthenticated); });
  }

  return renderObject(content, isAuthenticated);
};

function renderObject(model, isAuthenticated) {
  if(model.toObject){
    model = model.toObject({ getters: true });
  }

  if(isAuthenticated === false) {
    return {
      id: model.id || '',
      thread: model.thread || '',
      name: model.name || '',
      title: model.title || '',
      description: model.description || '',
      img: model.img || '',
      updated: model.updated || '',
    };
  }

  return {
    id: model.id,
    unread: model.unread,
    thread: model.thread,
    name: model.name,
    title: model.title,
    description: model.description,
    img: model.img,
    storedImg: model.img && '/api/images/'+ new Buffer(model.img || '').toString('base64'),
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