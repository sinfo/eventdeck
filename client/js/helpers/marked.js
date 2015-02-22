var marked = require('marked');

var renderer = new marked.Renderer();

var link = renderer.link;

renderer.link = function () {
  return link.apply(renderer, arguments).replace('<a', '<a target="_blank"');
};

marked.setOptions({
  renderer: renderer,
  gfm: true,
});

module.exports = marked;
