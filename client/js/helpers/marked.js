var marked = require('marked');

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
});

module.exports = marked;