var marked = require('marked');

var renderer = new marked.Renderer();

var link = renderer.link;

renderer.link = function (href, title, text) {
  return link.apply(renderer, [href, title, text]).replace('<a', '<a target="_blank"');
};

marked.setOptions({
  renderer: renderer,
  gfm: true,
});

module.exports = marked;
