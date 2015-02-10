module.exports = function render(content, isAuthenticated) {
  if(content instanceof Array) {
    return content.map(function(model) { return renderObject(model, isAuthenticated); });
  }
  return renderObject(content);
};

function renderObject(model, isAuthenticated) {
  return {
    id: model.id || '',
    name: model.name || '',
    kind: model.kind,
    img: model.img || '',
    place: model.place || '',
    description: model.description || '',
    speakers: model.speakers && model.speakers.map(function(speaker) {
      return {
        id: speaker.id || '',
        name: speaker.name || '',
        position: speaker.position || '',
      };
    }) || [],
    companies: model.companies || [],
    date: model.date || '',
    duration: model.duration || '',
    updated: model.updated || '',
    tickets: model.tickets && {
      needed: model.tickets.needed,
      start: model.tickets.start,
      end: model.tickets.end,
      max: model.tickets.max
    },
  };
}