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
    img: model.img || (model.facebook && model.facebook.username && 'https://graph.facebook.com/'+model.facebook.username+'/picture'),
    roles: model.roles && model.roles.map(function(role) {
      return {
        id: role.id,
        isTeamLeader: role.isTeamLeader,
      };
    }),
    facebook: model.facebook && {
      id: model.facebook.id,
      username: model.facebook.username,
    },
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
  }
}