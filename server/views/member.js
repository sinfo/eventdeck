var CURRENT_EVENT = '23-sinfo';

module.exports = function render(content, isAuthenticated) {
  if(content instanceof Array) {
    if(isAuthenticated === false) {
      content = content && content.filter(function(model) {
        return model.participations && model.participations.filter(function(p) { return p.role && p.event === CURRENT_EVENT; }).length > 0;
      });
    }

    return content.map(function(model) { return renderObject(model, isAuthenticated); });
  }

  return renderObject(content);
};

function renderObject (model, isAuthenticated) {

  if(isAuthenticated === false) {
    return {
      id: model.id,
      name: model.name,
      img: model.img || '/static/default-profile.png',
      twitter: model.twitter,
      github: model.github,
      mail: model.mails && model.mails.main,
      updated: model.updated,
      participations: model.participations
    };
  }

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
