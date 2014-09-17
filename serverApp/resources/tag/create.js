var Tag = require('../../db/models/tag');
var log = require('../../helpers/logger');

module.exports = create;

function create(request, reply) {

  var tag = request.payload;
  
  if(!tag.name) {
    return reply({error: 'You must provide a name.'});
  }

  tag.id = createId(tag.name);

  var newTag = new Tag(tag);

  newTag.save(function (err) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id, tag: newTag}, '[tag] error creating new tag');
      return reply({error: 'Error creating tag.'});
    }
    
    log.info({username: request.auth.credentials.id, tag: tag.id}, '[tag] new tag created');
    reply({success: 'Tag created.', tag:newTag});
  });
}

function createId(text) {
  return text.toLowerCase().replace(/ç/g, 'c').replace(/á|à|ã/g, 'a').replace(/é|è|ê/g, 'e').replace(/í|ì|î/g, 'i').replace(/ó|ò|õ|ô/g, 'o').replace(/[^a-zA-Z ]/g, '').replace(/\s/g, '-');
}