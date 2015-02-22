var marked = require('marked');

// define custom renderer
var renderer = new marked.Renderer();

var link = renderer.link;

renderer.link = function () {
  return link.apply(renderer, arguments).replace('<a', '<a target="_blank"');
};

// set marked options
marked.setOptions({
  renderer: renderer,
  gfm: true,
});

// define custom marked
var customMarked = function () {
  return marked.apply(marked, arguments)
    // emails
    .replace(/([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)/g, '<a href="mailto:$1">$1</a>')
    // twitter
    .replace(/(\W)@(\w+)(?!(?:\w|\.\w))/g, '$1<a target="_blank" href="https://twitter.com/$2">@$2</a>')
    // mentions
    .replace(/(\W)@(\w+\.\w+)(?=\W)/g, function () {
      return arguments[1] + '<a href="/members/' + arguments[2].toLowerCase() + '">@' + arguments[2] + '</a>';
    });
};

// export custom marked
module.exports = customMarked;
