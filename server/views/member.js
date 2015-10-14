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
    img: model.img || '/static/default-profile.png',
    participations: model.participations,
    facebook: model.facebook && {
      id: model.facebook.id,
      username: model.facebook.username,
    },
    twitter: model.twitter,
    github: model.github,
    skype: model.skype,
    phones: model.phones,
    mails: model.mails && {
      main: model.mails.main,
      institutional: model.mails.institutional,
      dropbox: model.mails.dropbox,
      google: model.mails.google,
      microsoft: model.mails.microsoft,
    },
    updated: model.updated,
    unreadAccess: model.unreadAccess
  };
}
